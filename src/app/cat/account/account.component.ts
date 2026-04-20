declare var bootstrap: any;
import { Component, OnInit } from "@angular/core";
import { AccountGroupModel, AccountModel } from "../cat.model";
import { AccountService } from "../services/account.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { catchError, EMPTY, Observable, switchMap, tap } from "rxjs";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrl: "./account.component.css",
})
export class AccountComponent implements OnInit {
  title: string = "Konten";

  accountGroups: AccountGroupModel[] = [];
  curAccountGroupId?: string;

  accounts: AccountModel[] = [];

  isEditMode: boolean = false;
  isModalOppen: boolean = false;
  updAccount?: AccountModel;
  delAccount?: AccountModel;

  constructor(
    private accSrv: AccountService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const agId = params["agid"];

      if (agId) {
        this.loadData(agId);
      } else {
        this.redirectToFirst();
      }
    });
  }

  private loadData(agId: string): void {
    this.curAccountGroupId = agId;

    this.accSrv
      .findAllAccountGroups()
      .pipe(
        tap((accountGroups) => {
          this.accountGroups = accountGroups;
        }),
        switchMap(() => this.accSrv.findOneAccountGroup(agId)),
      )
      .subscribe((accountGroup) => {
        if (accountGroup.accounts) {
          this.accounts = accountGroup.accounts;
        }
      });
  }

  // ----- C L I C K E V E N T S -----
  onChangeSelectAccountGroup(agId: string): void {
    this.redirectTo(agId);
  }

  onClickModalCreate(): void {
    this.isEditMode = false;
    this.showModal("accountModal");
  }

  onClickModalUpdate(account: AccountModel): void {
    this.updAccount = { ...account }; //! wichtig
    this.isEditMode = true;
    this.showModal("accountModal");
  }

  onClickModalDelete(account: AccountModel): void {
    this.delAccount = account;
    this.showModal("delAccountModal");
  }

  onClickCloseModal(modalId: string): void {
    this.hideModal(modalId);
  }

  // ------ M O D A L E V E N T S -----
  handleAccountSave(account: AccountModel): void {
    const modalId = "accountModal";

    if (this.updAccount) {
      this.handleRequest(
        this.accSrv.updateAccount(account.id, account),
        modalId,
      );
    } else {
      this.handleRequest(this.accSrv.createNewAccount(account), modalId);
    }
  }

  handleAccountDelete(account: AccountModel): void {
    const modalId = "delAccountModal";

    // nicht erlaubt → sofort abbrechen
    if (account.act || account.sav || account.shw) {
      console.log("Darf NICHT gelöscht werden");
      return;
    }

    this.handleRequest(this.accSrv.deleteAccount(account), modalId);
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
      this.isModalOppen = true;
      modal.show();
    }
  }

  private hideModal(modalId: string): void {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    this.updAccount = undefined;
    this.delAccount = undefined;
    this.isEditMode = false;
    this.isModalOppen = false;
    modal.hide();

    if (this.curAccountGroupId) {
      this.loadData(this.curAccountGroupId);
    } else {
      this.redirectToFirst();
    }
  }

  // ----- N A V I G A T I O N -----
  private redirectToFirst(): void {
    this.accSrv
      .findFirstAccountGroup()
      .pipe(
        tap((accountGroup) => {
          if (!accountGroup) return;

          this.redirectTo(String(accountGroup.id));
        }),
      )
      .subscribe();
  }

  private redirectTo(agId: string): void {
    this.router.navigate(["/cat", "accountgroup", agId, "accounts"]);
  }
}
