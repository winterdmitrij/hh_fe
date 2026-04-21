declare var bootstrap: any;
import { Component, OnInit } from "@angular/core";
import { PostGroupModel, TransactionModel } from "../cat.model";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PostService } from "../services/post.service";
import { catchError, EMPTY, Observable, of, switchMap, tap } from "rxjs";

export enum ModalId {
  ADD_UPD = "postGroupModal",
  DELETE = "delPostGroupModal",
}

@Component({
  selector: "app-postgroup",
  templateUrl: "./postgroup.component.html",
  styleUrl: "./postgroup.component.css",
})
export class PostgroupComponent implements OnInit {
  title: string = "Postgruppen";
  modalId = ModalId; //! für HTML

  transactions: TransactionModel[] = [];
  curTransactionId?: string;

  postGroups: PostGroupModel[] = [];

  isEditMode: boolean = false;
  isModalOpen: boolean = false;
  updPostGroup?: PostGroupModel;
  delPostGroup?: PostGroupModel;

  constructor(
    private pstSrv: PostService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const taId = params["taid"];

      if (taId) {
        this.loadData(taId);
      } else {
        this.redirectToFirst();
      }
    });
  }

  private loadData(taId: string): void {
    this.curTransactionId = taId;

    this.pstSrv
      .findAllTransactions()
      .pipe(
        tap((transactions) => {
          this.transactions = transactions;
        }),
        switchMap(() => this.pstSrv.findOneTransaction(taId)),
      )
      .subscribe((transaction) => {
        if (transaction.postgroups) {
          this.postGroups = transaction.postgroups;
        }
      });
  }

  //----- C L I C K - E V E N T S -----
  onChangeSelectTransaction(taId: string): void {
    this.redirectTo(taId);
  }

  onClickModalCreate(): void {
    this.isEditMode = false;
    this.showModal(this.modalId.ADD_UPD);
  }

  onClickModalUpdate(postGroup: PostGroupModel): void {
    this.updPostGroup = { ...postGroup }; //! wichtig
    this.isEditMode = true;
    this.showModal(this.modalId.ADD_UPD);
  }

  onClickModalDelete(postGroup: PostGroupModel): void {
    this.delPostGroup = postGroup;
    this.showModal(this.modalId.DELETE);
  }

  onClickCloseModal(modalId: string): void {
    this.hideModal(modalId);
  }

  // ----- M O D A L E V E N T S - B E H A N D L U N G -----
  // Add or Upd Position
  handlePostGroupSave(postGroup: PostGroupModel) {
    if (this.updPostGroup) {
      this.handleRequest(
        this.pstSrv.updatePostGroup(postGroup.id, postGroup),
        this.modalId.ADD_UPD,
      );
    } else {
      this.handleRequest(
        this.pstSrv.createNewPostGroup(postGroup),
        this.modalId.ADD_UPD,
      );
    }
  }

  handlePostGroupDelete(postGroup: PostGroupModel): void {
    //! Wenn nicht erlaubt, sofort abbrechen
    if (postGroup.act && postGroup.posts?.length) {
      console.log("Darf NICHT gelöscht werden");
      return;
    }

    this.handleRequest(
      this.pstSrv.deletePostGroup(postGroup),
      this.modalId.DELETE,
    );
  }

  private handleRequest(obs$: Observable<any>, modalId: string): void {
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

  private hideModal(modalId: string) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    this.updPostGroup = undefined;
    this.delPostGroup = undefined;
    this.isEditMode = false;
    this.isModalOpen = false;
    modal.hide();

    if (this.curTransactionId) {
      this.loadData(this.curTransactionId);
    } else {
      this.redirectToFirst();
    }
  }

  // ----- N A V I G A T I O N -----
  private redirectToFirst(): void {
    this.pstSrv
      .findFirstTransaction()
      .pipe(
        tap((transaction) => {
          if (!transaction) return;

          this.redirectTo(String(transaction.id));
        }),
      )
      .subscribe();
  }

  private redirectTo(taId: string): void {
    this.router.navigate(["/cat", "transaction", taId, "postgroups"]);
  }
}
