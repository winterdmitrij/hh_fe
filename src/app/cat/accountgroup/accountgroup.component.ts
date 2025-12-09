import { Component, OnInit } from "@angular/core";
import { AccountGroupModel } from "../cat.model";
import { AccountService } from "../services/account.service";

@Component({
  selector: "app-accountgroup",
  templateUrl: "./accountgroup.component.html",
  styleUrl: "./accountgroup.component.css",
})
export class AccountgroupComponent implements OnInit {
  accountgroups: AccountGroupModel[] = [];
  updAccountgroup?: AccountGroupModel;

  constructor(private accSrv: AccountService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.accSrv
      .findAllGroups()
      .subscribe((data) => (this.accountgroups = data));
  }

  onClickEdit(accountgroup: AccountGroupModel): void {
    this.updAccountgroup = accountgroup;
  }

  onUpdAccountgroup(accountgroup: AccountGroupModel): void {
    //ToDo:
  }
}
