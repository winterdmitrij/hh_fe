import { Component, OnInit } from "@angular/core";
import { AccountBalanceService } from "../services/account-balance.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-account-balance",
  templateUrl: "./account-balance.component.html",
  styleUrl: "./account-balance.component.css",
})
export class AccountBalanceComponent implements OnInit {
  years: number[] = [];
  rptYear?: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accBalSrv: AccountBalanceService
  ) {}

  ngOnInit(): void {
    this.loadYears();
  }

  loadYears() {}

  loadAccountsBalance(year: number) {}

  // Jahr ist gewächselt
  onSelectChange(newYear: string) {
    this.router.navigate(["/rpt/accounts-balances", String(newYear)]);
  }
}
