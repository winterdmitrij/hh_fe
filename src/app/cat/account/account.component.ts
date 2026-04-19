import { Component, OnInit } from "@angular/core";
import { AccountGroupModel, AccountModel } from "../cat.model";
import { AccountService } from "../services/account.service";
import { ActivatedRoute, Params, Router } from "@angular/router";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrl: "./account.component.css",
})
export class AccountComponent implements OnInit {
  accountgroups: AccountGroupModel[] = [];
  curGroupId?: string;

  accounts: AccountModel[] = [];
  updAccount?: AccountModel;
  newAccount?: AccountModel;
  actAccount?: AccountModel;

  constructor(
    private accSrv: AccountService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDropdown();
  }

  async loadDropdown(): Promise<void> {
    this.accSrv.findAllAccountGroups().subscribe((data) => {
      this.accountgroups = data;

      // Pfadparameter ablesen
      this.route.params.subscribe((params: Params) => {
        const agId = params["agid"];

        if (agId) {
          this.curGroupId = agId;
          this.loadAccounts(agId);
        } else {
          this.accSrv.findFirstAccountGroup().subscribe((group) => {
            if (group) {
              this.router.navigate(["/cat/accountgroup", group.id, "accounts"]);
            }
          });
        }
      });
    });
  }

  loadAccounts(groupId: string): void {
    this.accSrv.findOneAccountGroup(groupId).subscribe((data) => {
      if (data.accounts) {
        this.accounts = data.accounts;
      }
    });
  }

  onChangeSelect(newGroupId: string): void {
    this.router.navigate(["/cat/accountgroup", String(newGroupId), "accounts"]);
  }

  //-- Events ---------------------------------------------
  // ToDo: Es fehlt noch die Add-, Del- und Upd-Funktionen
  onClickCreate(): void {
    //ToDo
  }

  onClickUpdate(account: AccountModel): void {
    //ToDo
  }

  onClickActivate(account: AccountModel): void {
    this.actAccount = account;
  }

  //-- Actions ---------------------------------------------
  createAccount(account: AccountModel): void {
    //ToDo
  }

  updateAccount(account: AccountModel): void {
    this.accSrv.updateAccount(account.id, account).subscribe({
      next: (res) => this.loadAccounts(this.curGroupId!),
      error: (err) => alert(err),
    });
  }

  activeTogle(account: AccountModel): void {
    this.accSrv.updateAccount(account.id, { act: !account.act }).subscribe({
      next: (res) => this.loadAccounts(this.curGroupId!),
      error: (err) => alert(err),
    });
  }
}
