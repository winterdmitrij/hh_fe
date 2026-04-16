declare var bootstrap: any;
import { Component, OnInit } from "@angular/core";
import { PostGroupModel, PostModel, TransactionModel } from "../cat.model";
import { PostService } from "../services/post.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { EMPTY, forkJoin, Observable, switchMap, tap } from "rxjs";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrl: "./post.component.css",
})
export class PostComponent implements OnInit {
  title: string = "Positionen";

  transactions: TransactionModel[] = [];
  curTransactionId?: string;

  postGroups: PostGroupModel[] = [];
  curPostGroupId?: string;

  posts: PostModel[] = [];

  isEditMode: boolean = false;
  isModalOpen: boolean = false;
  updPost?: PostModel;

  constructor(
    private pstSrv: PostService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const taId = params["taid"];
      const pgId = params["pgid"];

      if (taId && pgId) {
        this.loadData(taId, pgId);
      } else {
        this.redirectToFirst();
      }
    });
  }

  private loadData(taId: string, pgId: string): void {
    this.curTransactionId = taId;
    this.curPostGroupId = pgId;

    forkJoin({
      transactions: this.pstSrv.findAllTransactions(), // für alle Transaktionen
      transaction: this.pstSrv.findOneTransaction(taId), // für die akt. Transaktion
    })
      .pipe(
        tap(({ transactions, transaction }) => {
          this.transactions = transactions;
          this.postGroups = transaction.postgroups ?? [];
        }),
        switchMap(() => this.pstSrv.findOnePostGroup(pgId)),
      )
      .subscribe((pg) => {
        if (pg.posts) {
          this.posts = pg.posts;
        }
      });
  }

  // ----- C L I C K E V E N T S -----
  onChangeSelectTransactions(taId: string): void {
    this.redirectToFirst(taId);
  }

  onChangeSelectTransactionPostGroups(pgId: string): void {
    if (this.curTransactionId) {
      this.redirectTo(this.curTransactionId, pgId);
    }
  }

  onClickModalCreate(): void {
    this.isEditMode = false;
    this.showModal("postModal");
  }

  onClickModalUpdate(post: PostModel): void {
    this.updPost = post;
    this.isEditMode = true;
    this.showModal("postModal");
  }

  onClickCloseModal(modalId: string): void {
    this.modalHide(modalId);
  }

  // ----- M O D A L E V E N T S -----
  handlePostSave(post: PostModel) {
    if (this.updPost) {
      this.handleRequest(this.pstSrv.updatePost(post.id, post), "postModal");
    } else {
      this.handleRequest(this.pstSrv.createNewPost(post), "postModal");
    }
    console.log("Das Post erfolgreich gespeichert.", post);
  }

  handlePostGroupDelete(post: PostModel) {
    // ToDo
    console.log("Das Post erfolgreich geslöscht.", post);
    this.modalHide("delPostModal");
    if (this.curTransactionId && this.curPostGroupId) {
      this.loadData(this.curTransactionId, this.curPostGroupId);
    }
  }

  private handleRequest(obs$: Observable<any>, modalId: string) {
    obs$.subscribe({
      next: (res) => {
        console.log("Erfolg: ", res);

        this.modalHide(modalId);
        if (this.curTransactionId && this.curPostGroupId) {
          this.loadData(this.curTransactionId, this.curPostGroupId);
        }
      },
      error: (err) => {
        console.error("Fehler: ", err);
      },
    });
  }

  // ----- M O D A L S -----
  private showModal(modalId: string): void {
    const modalEl = document.getElementById(modalId);

    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      this.isModalOpen = true;
      modal.show();
    }
  }

  private modalHide(modalId: string) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    this.updPost = undefined;
    //this.delPost = undefined;
    this.isModalOpen = false;
    modal.hide();
  }

  // ----- N A V I G A T I O N -----
  private redirectToFirst(taId?: string): void {
    const transaction$ = taId
      ? this.pstSrv.findOneTransaction(taId) // wenn taId übergeben wurde
      : this.pstSrv.findFirstTransaction(); // wenn keinen taId übergeben wurde

    transaction$
      .pipe(
        switchMap((tr) => {
          if (!tr) return EMPTY;

          return this.pstSrv.findFirstPostGroup(String(tr.id)).pipe(
            tap((pg) => {
              if (!pg) return;

              this.redirectTo(String(tr.id), String(pg.id));
            }),
          );
        }),
      )
      .subscribe();
  }

  private redirectTo(taId: string, pgId: string): void {
    this.router.navigate([
      "/cat",
      "transaction",
      taId,
      "postgroup",
      pgId,
      "posts",
    ]);
  }
}
