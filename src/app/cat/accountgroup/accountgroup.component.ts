declare var bootstrap: any;
import { Component, OnInit } from "@angular/core";
import { AccountGroupModel } from "../cat.model";
import { AccountService } from "../services/account.service";
import { catchError, Observable, of } from "rxjs";

@Component({
  selector: "app-accountgroup",
  templateUrl: "./accountgroup.component.html",
  styleUrl: "./accountgroup.component.css",
})
export class AccountgroupComponent implements OnInit {
  title = "Kontengruppen";

  accountGroups: AccountGroupModel[] = [];
  updAccountGroup?: AccountGroupModel;
  delAccountGroup?: AccountGroupModel;

  isEditMode: boolean = false;
  isModalOpen: boolean = false;

  constructor(private accSrv: AccountService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.accSrv
      .findAllAccountGroups()
      .subscribe((data) => (this.accountGroups = data));
  }

  //----- C L I C K - E V E N T S -----
  onClickModalCreate(): void {
    this.isEditMode = false;
    this.showModal("accountGroupModal");
  }

  onClickModalUpdate(accountGroup: AccountGroupModel): void {
    this.updAccountGroup = accountGroup;
    this.isEditMode = true;
    this.showModal("accountGroupModal");
  }

  onClickModalDelete(accountGroup: AccountGroupModel): void {
    this.delAccountGroup = accountGroup;
    this.showModal("delAccountGroupModal");
  }

  onClickCloseModal(modalId: string): void {
    this.hideModal(modalId);
  }

  // ----- M O D A L E V E N T S - B E H A N D L U N G -----
  // Add or Upd Position
  handleAccountGroupSave(accountGroup: AccountGroupModel): void {
    if (this.updAccountGroup) {
      this.handleRequest(
        this.accSrv.updateAccountGroup(accountGroup.id, accountGroup),
        "accountGroupModal",
      );
    } else {
      this.handleRequest(
        this.accSrv.createNewAccountGroup(accountGroup),
        "accountGroupModal",
      );
    }
  }

  handleAccountGroupDelete(accountGroup: AccountGroupModel): void {
    console.log("Löschende Kontengruppe: ", accountGroup);
    if (accountGroup.accounts?.length || accountGroup.act || accountGroup.shw) {
      console.log("Darf NICHT gelöscht werden");
    } else {
      this.accSrv
        .deleteAccountGroup(accountGroup)
        .pipe(
          catchError((error) => {
            console.log("Fehler beim Löschen der Kontengruppe: ", error);
            alert("Kontengruppe konte nicht gelöscht werden.");
            return of();
          }),
        )
        .subscribe(() =>
          console.log("Kontengruppe wurde erfolgreich gelöscht."),
        );
    }

    this.hideModal("delAccountGroupModal");
  }

  private handleRequest(obs$: Observable<any>, modalId: string): void {
    obs$.subscribe({
      next: (res) => {
        console.log("Erfolg: ", res);

        this.hideModal(modalId);
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

  private hideModal(modalId: string): void {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    this.updAccountGroup = undefined;
    this.delAccountGroup = undefined;
    this.isModalOpen = false;
    modal.hide();
    this.loadData();
  }
}
