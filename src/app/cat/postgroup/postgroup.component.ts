declare var bootstrap: any;
import { Component, OnInit } from "@angular/core";
import { PostGroupModel, TransactionModel } from "../cat.model";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PostService } from "../services/post.service";
import { catchError, Observable, of } from "rxjs";

@Component({
  selector: "app-postgroup",
  templateUrl: "./postgroup.component.html",
  styleUrl: "./postgroup.component.css",
})
export class PostgroupComponent implements OnInit {
  title: string = "Postgruppen";

  transactions: TransactionModel[] = [];
  curTransactionId?: string;

  postGroups: PostGroupModel[] = [];

  isEditMode: boolean = false;
  modalOpen: boolean = false;
  updPostGroup?: PostGroupModel;
  delPostGroup?: PostGroupModel;

  constructor(
    private pstSrv: PostService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDropdown();
  }

  async loadDropdown(): Promise<void> {
    this.pstSrv.findAllTransactions().subscribe((data) => {
      this.transactions = data;

      // Pfadparameter ablesen
      this.route.params.subscribe((params: Params) => {
        const taId = params["taid"];

        if (taId) {
          this.curTransactionId = taId;
          this.loadPostGroups(taId);
        } else {
          this.pstSrv.findFirstTransaction().subscribe((transaction) => {
            if (transaction) {
              this.router.navigate([
                "/cat/transaction",
                transaction.id,
                "postgroups",
              ]);
            }
          });
        }
      });
    });
  }

  loadPostGroups(taId: string): void {
    this.pstSrv.findOneTransaction(taId).subscribe((data) => {
      if (data.postgroups) {
        this.postGroups = data.postgroups;
      }
    });
  }

  //----- C L I C K - E V E N T S -----
  onChangeSelect(newTaId: string): void {
    this.router.navigate(["/cat/transaction", String(newTaId), "postgroups"]);
  }

  onClickModalCreate(): void {
    this.isEditMode = false;
    this.showModal("postGroupModal");
  }

  onClickModalUpdate(postGroup: PostGroupModel): void {
    this.updPostGroup = postGroup;
    this.isEditMode = true;
    this.showModal("postGroupModal");
  }

  onClickModalDelete(postGroup: PostGroupModel): void {
    this.delPostGroup = postGroup;
    this.showModal("delPostGroupModal");
  }

  onClickCloseModal(modalId: string): void {
    this.modalHide(modalId);
  }

  // ----- M O D A L E V E N T S - B E H A N D L U N G -----
  // Add or Upd Position
  handlePostGroupSave(postGroup: PostGroupModel) {
    if (this.updPostGroup) {
      this.handleRequest(
        this.pstSrv.updatePostGroup(postGroup.id, postGroup),
        "postGroupModal",
      );
    } else {
      this.handleRequest(
        this.pstSrv.createNewPostGroup(postGroup),
        "postGroupModal",
      );
    }
    //console.log("Die Postgruppe erfolgreich gespeichert.", postGroup);
  }

  handlePostGroupDelete(postGroup: PostGroupModel) {
    // Wenn die Postgruppe mind. einen Post hat, darf die nicht gelöscht werden
    if (postGroup.posts?.length) {
      console.log("Darf NICHT gelöscht werden");
    } else {
      this.pstSrv
        .deletePostGroup(postGroup)
        .pipe(
          catchError((error) => {
            console.error("Fehler beim Löschen der Postgruppe:", error);
            alert("Postgruppe konnte nicht gelöscht werden.");
            return of();
          }),
        )
        .subscribe(() => {
          console.log("Postgruppe wurde erfolgreich gelöscht.");
        });
    }

    this.modalHide("delPostGroupModal");
    if (this.curTransactionId) {
      this.loadPostGroups(this.curTransactionId);
    }
  }

  private handleRequest(obs$: Observable<any>, modalId: string) {
    obs$.subscribe({
      next: (res) => {
        console.log("Erfolg: ", res);

        this.modalHide(modalId);
        if (this.curTransactionId) {
          this.loadPostGroups(this.curTransactionId);
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
      this.modalOpen = true;
      modal.show();
    }
  }

  private modalHide(modalId: string) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    this.updPostGroup = undefined;
    this.delPostGroup = undefined;
    this.modalOpen = false;
    modal.hide();
  }
}
