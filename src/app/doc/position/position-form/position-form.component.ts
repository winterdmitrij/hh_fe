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
    this.form.get("tra_id")!.valueChanges.subscribe((taId) => {
      if (!taId) return;

      this.selTransactionId = taId;
      this.updatePosts(taId);

      this.form.get("pst_id")?.setValue(null);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["position"]) {
      this.loadData();
    }
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
          this.accounts = accounts;
          this.transactions = transactions;
          this.allPosts = posts;

          //this.selAccountId = info.account.id;

          // 🔥 EINMAL bestimmen
          this.selTransactionId = this.resolveTransactionId();

          // enable / disable
          this.canChanged = !info.transaction?.id;
          if (this.canChanged) {
            this.form.get("tra_id")?.enable();
          } else {
            this.form.get("tra_id")?.disable();
          }

          // 🔥 Posts setzen
          this.updatePosts(this.selTransactionId);

          // 🔥 Form befüllen
          this.patchForm();
        }),
      )
      .subscribe();
  }

  // ---------------- FORM ----------------
  patchForm() {
    if (!this.document) return;

    this.positionId = this.position
      ? this.position.id
      : this.getNewPositionId();

    const traId = this.selTransactionId!;
    console.log("patchForm Tra-ID: ", traId);

    this.form.patchValue({
      id: this.positionId,
      doc_id: this.document.id,
      acc_id:
        this.position?.account?.id ?? this.documentInfo?.account.id ?? null,
      tra_id: traId,
      amt: this.position?.amt ?? null,
      cmt: this.position?.cmt ?? "",
    });

    // 🔥 WICHTIG: zuerst Posts aktualisieren
    this.updatePosts(traId);

    // 🔥 dann Post setzen
    this.form.patchValue({
      pst_id: this.position?.post?.id ?? null,
    });
  }

  private resetForm() {
    this.form.reset({
      id: null,
      doc_id: null,
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
    this.position = undefined;

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
      //this.patchForm();
      this.loadData();
    });
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
  private resolveTransactionId(): number {
    // 🔥 1. über Position → Post → Transaction suchen
    if (this.position?.post?.id) {
      const postId = this.position.post.id;

      const found = this.transactions.find((t) =>
        t.postgroups?.some((pg) => pg.posts?.some((p) => p.id === postId)),
      );

      if (found) {
        return found.id;
      }
    }

    // 🔥 2. fallback: Document Default
    if (this.documentInfo?.transaction?.id) {
      return this.documentInfo.transaction.id;
    }

    // 🔥 3. fallback: erste Transaction
    return this.transactions[0]?.id ?? 1;
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
