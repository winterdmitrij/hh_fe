import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  shareReplay,
  switchMap,
  withLatestFrom,
} from "rxjs";

import { AccountService } from "../../../cat/services/account.service";
import { PostService } from "../../../cat/services/post.service";
import { InformationService } from "../../../cat/services/information.service";

import {
  AccountModel,
  InformationModel,
  PostModel,
  TransactionModel,
} from "../../../cat/cat.model";
import { DocumentModel, PositionModel } from "../../doc.model";

@Component({
  selector: "app-position-form",
  templateUrl: "./position-form.component.html",
})
export class PositionFormComponent implements OnInit {
  // ---------------- INPUT → STREAM ----------------
  private document$ = new BehaviorSubject<DocumentModel | null>(null);
  private position$ = new BehaviorSubject<PositionModel | null>(null);

  @Input() set document(value: DocumentModel) {
    this.document$.next(value);
  }

  @Input() set position(value: PositionModel | undefined) {
    this.position$.next(value ?? null);
  }

  @Output() submitPosition = new EventEmitter<any>();

  // ---------------- DATA STREAMS ----------------
  transactions$ = this.pstSrv.findAllTransactions();
  accounts$ = this.accSrv.findAllAccounts();
  posts$ = this.pstSrv.findAllPosts();

  documentInfo$ = this.document$.pipe(
    filter((doc): doc is DocumentModel => !!doc),
    switchMap((doc) => {
      const docType = doc.id.substring(5, 8);
      return this.infSrv.findOne(docType);
    }),
  );

  // ---------------- VIEW MODEL ----------------
  vm$ = combineLatest([
    this.document$,
    this.position$,
    this.transactions$,
    this.accounts$,
    this.posts$,
    this.documentInfo$,
  ]).pipe(
    map(([document, position, transactions, accounts, posts, info]) => {
      if (!document) return null;

      // 🔥 Transaction bestimmen
      let traId: number | undefined;

      if (position?.post?.id) {
        const found = transactions.find((t) =>
          t.postgroups?.some((pg) =>
            pg.posts?.some((p) => p.id === position.post?.id),
          ),
        );
        traId = found?.id;
      }

      traId = traId ?? info.transaction?.id ?? transactions[0]?.id ?? 1;

      // 🔥 Posts filtern
      const filteredPosts = posts.filter(
        (p) => p.postgroup?.transaction?.id === traId,
      );

      // 🔥 Position ID
      const positionId = position?.id ?? this.getNewPositionId(document);

      return {
        document,
        position,
        transactions,
        accounts,
        posts: filteredPosts,
        info,
        traId,
        positionId,
      };
    }),
    shareReplay(1),
  );

  // ---------------- FORM ----------------
  form = new FormGroup({
    id: new FormControl("", Validators.required),
    doc_id: new FormControl("", Validators.required),
    acc_id: new FormControl<number | null>(null, Validators.required),
    tra_id: new FormControl<number | null>(null, Validators.required),
    pst_id: new FormControl<number | null>(null, Validators.required),
    amt: new FormControl<number | null>(null, Validators.required),
    cmt: new FormControl(""),
  });

  posts: PostModel[] = [];

  constructor(
    private accSrv: AccountService,
    private pstSrv: PostService,
    private infSrv: InformationService,
  ) {}

  // ---------------- INIT ----------------
  ngOnInit(): void {
    // 🔥 Form automatisch befüllen
    this.vm$.subscribe((vm) => {
      if (!vm) return;

      this.posts = vm.posts;

      this.form.patchValue({
        id: vm.positionId,
        doc_id: vm.document.id,
        acc_id: vm.position?.account?.id ?? vm.info.account.id,
        tra_id: vm.traId,
        pst_id: vm.position?.post?.id ?? null,
        amt: vm.position?.amt ?? null,
        cmt: vm.position?.cmt ?? "",
      });

      // enable / disable
      if (vm.info.transaction?.id) {
        this.form.get("tra_id")?.disable();
      } else {
        this.form.get("tra_id")?.enable();
      }
    });

    // 🔥 Transaction Wechsel
    this.form
      .get("tra_id")!
      .valueChanges.pipe(withLatestFrom(this.posts$))
      .subscribe(([taId, posts]) => {
        if (!taId) return;

        this.posts = posts.filter((p) => p.postgroup?.transaction?.id === taId);

        this.form.get("pst_id")?.setValue(null);
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
  private getNewPositionId(document: DocumentModel): string {
    const nums =
      document.positions?.map((p) => Number(p.id.split(".")[1])) ?? [];

    const next = Math.max(0, ...nums) + 1;

    return `${document.id}.${String(next).padStart(2, "0")}`;
  }
}
