declare var bootstrap: any;
import { Component, OnInit } from "@angular/core";
import { AccountGroupModel } from "../cat.model";
import { AccountService } from "../services/account.service";
import { catchError, EMPTY, Observable, of } from "rxjs";

export enum ModalId {
  ADD_UPD = "accountGroupModal",
  DELETE = "delAccountGroupModal",
}

@Component({
  selector: "app-accountgroup",
  templateUrl: "./accountgroup.component.html",
  styleUrl: "./accountgroup.component.css",
})
export class AccountgroupComponent implements OnInit {
  title = "Kontengruppen";
  modalId = ModalId; //! für HTTML

  accountGroups: AccountGroupModel[] = [];

  isEditMode: boolean = false;
  isModalOpen: boolean = false;
  updAccountGroup?: AccountGroupModel;
  delAccountGroup?: AccountGroupModel;

  constructor(private accSrv: AccountService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.accSrv
      .findAllAccountGroups()
      .subscribe((data) => (this.accountGroups = data));
  }

  //----- C L I C K - E V E N T S -----
  onClickModalCreate(): void {
    this.isEditMode = false;
    this.showModal(this.modalId.ADD_UPD);
  }

  onClickModalUpdate(accountGroup: AccountGroupModel): void {
    this.updAccountGroup = { ...accountGroup }; //! wichtig
    this.isEditMode = true;
    this.showModal(this.modalId.ADD_UPD);
  }

  onClickModalDelete(accountGroup: AccountGroupModel): void {
    this.delAccountGroup = accountGroup;
    this.showModal(this.modalId.DELETE);
  }

  onClickCloseModal(modalId: string): void {
    this.hideModal(modalId);
  }

  // ----- M O D A L E V E N T S - B E H A N D L U N G -----
  handleAccountGroupSave(accountGroup: AccountGroupModel): void {
    if (this.updAccountGroup) {
      this.handleRequest(
        this.accSrv.updateAccountGroup(accountGroup.id, accountGroup),
        this.modalId.ADD_UPD,
      );
    } else {
      this.handleRequest(
        this.accSrv.createNewAccountGroup(accountGroup),
        this.modalId.ADD_UPD,
      );
    }
  }

  handleAccountGroupDelete(accountGroup: AccountGroupModel): void {
    //! Wenn nicht erlaubt, sofort abbrechen
    if (accountGroup.accounts?.length || accountGroup.act || accountGroup.shw) {
      console.log("Darf NICHT gelöscht werden");
      return;
    }

    this.handleRequest(
      this.accSrv.deleteAccountGroup(accountGroup),
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

  private hideModal(modalId: string): void {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    this.updAccountGroup = undefined;
    this.delAccountGroup = undefined;
    this.isEditMode = false;
    this.isModalOpen = false;
    modal.hide();
    this.loadData();
  }
}
