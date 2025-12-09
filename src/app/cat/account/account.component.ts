import { Component, OnDestroy, OnInit } from "@angular/core";
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

  constructor(
    private accSrv: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDropdown();
  }

  async loadDropdown(): Promise<void> {
    this.accSrv.findAllGroups().subscribe((data) => {
      this.accountgroups = data;

      // Pfadparameter ablesen
      this.route.params.subscribe((params: Params) => {
        const agId = params["agid"];

        if (agId) {
          this.curGroupId = agId;
          this.loadAccounts(agId);
        } else {
          this.accSrv.findFirstGroup().subscribe((group) => {
            if (group) {
              this.router.navigate(["/cat/accountgroup", group.id, "accounts"]);
            }
          });
        }
      });
    });
  }

  loadAccounts(groupId: string): void {
    this.accSrv.findOneGroup(groupId).subscribe((data) => {
      if (data.accounts) {
        this.accounts = data.accounts;
      }
    });
  }

  onSelectChange(newGroupId: string): void {
    this.router.navigate(["/cat/accountgroup", String(newGroupId), "accounts"]);
  }
}
