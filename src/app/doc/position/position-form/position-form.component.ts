import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { forkJoin, tap } from "rxjs";

import { AccountService } from "../../../cat/services/account.service";
import { DocumentModel, PositionModel } from "../../doc.model";
import { InformationService } from "../../../cat/services/information.service";
import { PostService } from "../../../cat/services/post.service";
import {
  AccountModel,
  InformationModel,
  PostModel,
  TransactionModel,
} from "../../../cat/cat.model";

@Component({
  selector: "app-position-form",
  templateUrl: "./position-form.component.html",
  styleUrl: "./position-form.component.css",
})
export class PositionFormComponent implements OnInit, OnChanges {
  @Input() document!: DocumentModel;
  @Input() position?: PositionModel;

  @Output() submitPosition = new EventEmitter<any>();

  transactions: TransactionModel[] = [];
  selTransactionId?: number;

  allPosts: PostModel[] = [];
  posts: PostModel[] = [];

  accounts: AccountModel[] = [];
  selAccountId?: number;

  documentInfo?: InformationModel;

  positionId: string = "";
  canChanged: boolean = true;

  form = new FormGroup({
    id: new FormControl("", Validators.required),
    doc_id: new FormControl("", Validators.required),
    acc_id: new FormControl<number | null>(null, Validators.required),
    tra_id: new FormControl<number | null>(null, Validators.required),
    pst_id: new FormControl<number | null>(null, Validators.required),
    amt: new FormControl<number | null>(null, Validators.required),
    cmt: new FormControl(""),
  });

  constructor(
    private accSrv: AccountService,
    private pstSrv: PostService,
    private infSrv: InformationService,
  ) {}

  // ---------------- INIT ----------------
  ngOnInit(): void {
    //    this.loadData();

    // 🔥 FIX: Reaktion auf Transaction-Wechsel
    this.form.get("tra_id")!.valueChanges.subscribe((taId) => {
      this.posts = this.allPosts.filter(
        (post) => post.postgroup?.transaction?.id === taId,
      );

      //this.selTransactionId = Number(taId);
      //this.filterPosts();

      // optional reset post selection
      this.form.get("pst_id")?.setValue(null);
    });
    console.log("ngOnInit TransactionId: ", this.selTransactionId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["position"]) {
      this.loadData();
      /*
      if (this.position) {
        
      } else {
        this.resetForm();
      }
        */
    }

    console.log("ngOnChanges TransactionId: ", this.selTransactionId);
  }

  // ---------------- DATA LOAD ----------------
  private loadData() {
    const docType = this.document.id.substring(5, 8);

    forkJoin({
      transactions: this.pstSrv.findAllTransactions(),
      accounts: this.accSrv.findAllAccounts(),
      posts: this.pstSrv.findAllPosts(),
      info: this.infSrv.findOne(docType),
    })
      .pipe(
        tap(({ transactions, accounts, posts, info }) => {
          this.documentInfo = info;

          // Accounts
          this.accounts = accounts;
          this.selAccountId = info.account.id;

          // Transactions
          this.transactions = transactions;

          // Posts
          this.allPosts = posts;

          // 🔥 Bestimme Transaction
          if (this.position?.post?.id) {
            const postId = this.position.post.id;

            const matchedTransaction = this.transactions.find((t) =>
              t.postgroups?.some((pg) =>
                pg.posts?.some((p) => p.id === postId),
              ),
            );

            if (matchedTransaction) {
              this.selTransactionId = matchedTransaction.id;
            }
          }

          if (!this.selTransactionId && info.transaction?.id) {
            this.selTransactionId = info.transaction.id;
          }

          if (!this.selTransactionId) {
            this.selTransactionId = this.transactions[0].id;
          }
          console.log("loadData TransactionId: ", this.selTransactionId);

          // Form setzen
          this.form.get("tra_id")?.setValue(this.selTransactionId);

          // Enable / Disable
          this.canChanged = !this.documentInfo?.transaction?.id;
          if (this.canChanged) {
            this.form.get("tra_id")?.enable();
          } else {
            this.form.get("tra_id")?.disable();
          }

          // 🔥 FIX: richtige Quelle
          this.allPosts = posts;

          // 🔥 FIX: initial filter
          this.filterPosts();

          this.patchForm();
        }),
      )
      .subscribe();
  }

  // ---------------- FORM ----------------
  patchForm() {
    if (!this.document) return;

    if (this.position) {
      this.positionId = this.position.id;

      this.selTransactionId =
        this.position.post?.postgroup?.transaction?.id ??
        this.documentInfo?.transaction?.id ??
        this.selTransactionId ??
        1;

      console.log("updPatch TransactionId: ", this.selTransactionId);

      this.form.patchValue({
        id: this.position.id,
        doc_id: this.document.id,
        acc_id: this.position.account?.id ?? null,
        tra_id: this.selTransactionId,
        amt: this.position.amt ?? null,
        cmt: this.position.cmt ?? "",
      });

      // 🔥 zuerst Posts laden
      this.updatePosts(this.selTransactionId);

      // 🔥 dann Post setzen
      this.form.patchValue({
        pst_id: this.position?.post?.id ?? null,
      });
    } else {
      this.resetForm();
      this.positionId = this.getNewPositionId();

      this.selTransactionId =
        this.documentInfo?.transaction?.id ?? this.transactions[0].id;

      console.log("insPatch TransactionId: ", this.selTransactionId);

      this.form.patchValue({
        id: this.positionId,
        doc_id: this.document.id,
        acc_id: this.documentInfo?.account.id ?? null,
        tra_id: this.selTransactionId,
      });

      // 🔥 zuerst Posts laden
      this.updatePosts(this.selTransactionId);

      // 🔥 dann Post setzen
      this.form.patchValue({
        pst_id: null,
      });
    }
  }

  private resetForm() {
    this.form.reset({
      acc_id: null,
      tra_id: null,
      pst_id: null,
      amt: null,
      cmt: "",
    });

    this.selTransactionId = undefined;
    this.selAccountId = undefined;
    this.posts = [];
    this.positionId = "";

    Object.keys(this.form.controls).forEach((key) =>
      this.form.get(key)?.markAsUntouched(),
    );
  }

  // ---------------- MODAL ----------------
  ngAfterViewInit(): void {
    const modalEl = document.getElementById("positionModal");

    if (!modalEl) return;

    modalEl.addEventListener("hidden.bs.modal", () => {
      this.resetForm();
    });

    modalEl.addEventListener("shown.bs.modal", () => {
      this.patchForm();
    });

    console.log("ngAfterViewInit TransactionId: ", this.selTransactionId);
  }

  // ---------------- SUBMIT ----------------
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const position = {
      id: this.form.value.id!,
      amt: this.form.value.amt!,
      cmt: this.form.value.cmt ?? "",
      document: { id: this.form.value.doc_id! },
      account: { id: this.form.value.acc_id! },
      post: { id: this.form.value.pst_id! },
    };

    this.submitPosition.emit(position);
  }

  // ---------------- HELPERS ----------------
  private filterPosts(): void {
    this.posts = this.allPosts.filter(
      (post) => post.postgroup?.transaction?.id === this.selTransactionId,
    );
  }

  private updatePosts(taId: number): void {
    this.posts = this.allPosts.filter(
      (post) => post.postgroup?.transaction?.id === taId,
    );
  }

  private getNewPositionId(): string {
    if (!this.document) return "";

    const docId = this.document.id;

    const nums =
      this.document.positions?.map((p) => Number(p.id.split(".")[1])) ?? [];

    const next = Math.max(0, ...nums) + 1;

    return `${docId}.${String(next).padStart(2, "0")}`;
  }
}
