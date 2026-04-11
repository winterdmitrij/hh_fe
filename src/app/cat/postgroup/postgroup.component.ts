declare var bootstrap: any;
import { Component, OnInit } from "@angular/core";
import { PostGroupModel, TransactionModel } from "../cat.model";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PostService } from "../services/post.service";

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

  //----- E V E N T S -----
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
  /*
  onClickModalActivate(postGroup: PostGroupModel): void {
    this.updPostGroup = postGroup;
  }
*/

  onClickCloseModal(modalId: string): void {
    this.modalHide(modalId);
  }

  activeTogle(postGroup: PostGroupModel): void {
    this.pstSrv
      .updatePostGroup(postGroup.id, { act: !postGroup.act })
      .subscribe({
        next: (res) => this.loadPostGroups(this.curTransactionId!),
        error: (err) =>
          alert(err?.error?.message || err.message || "Unbekannter Fehler"),
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
    //this.delPosition = undefined;
    this.modalOpen = false;
    modal.hide();
  }
}
