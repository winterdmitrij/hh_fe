declare var bootstrap: any;
import { Component, OnInit } from "@angular/core";
import { PostGroupModel, PostModel, TransactionModel } from "../cat.model";
import { PostService } from "../services/post.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import {
  catchError,
  EMPTY,
  forkJoin,
  Observable,
  of,
  switchMap,
  tap,
} from "rxjs";

export enum ModalId {
  ADD_UPD = "postModal",
  DELETE = "delPostModal",
}

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrl: "./post.component.css",
})
export class PostComponent implements OnInit {
  title: string = "Posten";
  modalId = ModalId; //! für HTML

  transactions: TransactionModel[] = [];
  curTransactionId?: string;

  postGroups: PostGroupModel[] = [];
  curPostGroupId?: string;

  posts: PostModel[] = [];

  isEditMode: boolean = false;
  isModalOpen: boolean = false;
  updPost?: PostModel;
  delPost?: PostModel;

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
      .subscribe((postgroup) => {
        if (postgroup.posts) {
          this.posts = postgroup.posts;
        }
      });
  }

  // ----- C L I C K E V E N T S -----
  onChangeSelectTransactions(taId: string): void {
    this.redirectToFirst(taId);
  }

  onChangeSelectPostGroups(pgId: string): void {
    if (this.curTransactionId) {
      this.redirectTo(this.curTransactionId, pgId);
    }
  }

  onClickModalCreate(): void {
    this.isEditMode = false;
    this.showModal(this.modalId.ADD_UPD);
  }

  onClickModalUpdate(post: PostModel): void {
    this.updPost = { ...post }; //! wichtig
    this.isEditMode = true;
    this.showModal(this.modalId.ADD_UPD);
  }

  onClickModalDelete(post: PostModel): void {
    this.delPost = post;
    this.showModal(this.modalId.DELETE);
  }

  onClickCloseModal(modalId: string): void {
    this.hideModal(modalId);
  }

  // ----- M O D A L E V E N T S -----
  handlePostSave(post: PostModel) {
    if (this.updPost) {
      this.handleRequest(
        this.pstSrv.updatePost(post.id, post),
        this.modalId.ADD_UPD,
      );
    } else {
      this.handleRequest(this.pstSrv.createNewPost(post), this.modalId.ADD_UPD);
    }
  }

  handlePostDelete(post: PostModel) {
    //! Wenn nicht erlaubt, sofort abbrechen
    if (post.act || post.trf || post.csh) {
      console.log("Darf NICHT gelöscht werden");
      return;
    }

    this.handleRequest(this.pstSrv.deletePost(post), this.modalId.DELETE);
  }

  private handleRequest(obs$: Observable<any>, modalId: string) {
    obs$
      .pipe(
        catchError((err) => {
          console.error("Fehler: ", err);
          //alert(err || "Fehler bei der Anfrage");
          return EMPTY; //! wichtig: stoppt next()
        }),
      )
      .subscribe((res) => {
        console.log("Erfolg: ", res);
        //alert("Operation erfolgreich");

        this.hideModal(modalId);
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

  private hideModal(modalId: string): void {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    this.updPost = undefined;
    this.delPost = undefined;
    this.isEditMode = false;
    this.isModalOpen = false;
    modal.hide();

    if (this.curTransactionId && this.curPostGroupId) {
      this.loadData(this.curTransactionId, this.curPostGroupId);
    } else {
      this.redirectToFirst();
    }
  }

  // ----- N A V I G A T I O N -----
  private redirectToFirst(taId?: string): void {
    const transaction$ = taId
      ? this.pstSrv.findOneTransaction(taId) // wenn taId übergeben wurde
      : this.pstSrv.findFirstTransaction(); // wenn keinen taId übergeben wurde

    transaction$
      .pipe(
        switchMap((transaction) => {
          if (!transaction) return EMPTY;

          return this.pstSrv.findFirstPostGroup(String(transaction.id)).pipe(
            tap((postgroup) => {
              if (!postgroup) return;

              this.redirectTo(String(transaction.id), String(postgroup.id));
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
