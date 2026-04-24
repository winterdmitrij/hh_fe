import { Component, OnInit } from "@angular/core";
import { PostBalanceService } from "../services/post-balance.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PeriodService } from "../../doc/services/period.service";
import { PostBalanceModel } from "../rpt.model";

@Component({
  selector: "app-post-balance",
  templateUrl: "./post-balance.component.html",
  styleUrl: "./post-balance.component.css",
})
export class PostBalanceComponent implements OnInit {
  //ToDo: Filter: Ausgaben, Einkommen, vllt. Überweisungen
  //ToDo: Filter: Posts anzeigen/verstecken
  //ToDo: Style:  Farbkonzept der Tabelle nachdenken

  years: number[] = [];
  rptYear?: string;

  balances: PostBalanceModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prdSrv: PeriodService,
    private pstBalSrv: PostBalanceService,
  ) {}

  ngOnInit() {
    this.loadSelectData();
  }

  loadSelectData() {
    this.prdSrv.findAllYears().subscribe((yearLst) => {
      this.years = yearLst;

      // Pfad-Parameter ablesen und Dokument laden oder verlinken
      this.route.params.subscribe((params: Params) => {
        const year = params["year"];

        if (year) {
          this.rptYear = year;
          this.loadReport(year);
        } else {
          this.prdSrv.findCurPrd().subscribe((period) => {
            if (period) {
              this.router.navigate([
                "/rpt/posts-balances",
                String(period.year),
              ]);
            }
          });
        }
      });
    });
  }

  loadReport(year: string) {
    this.pstBalSrv.findAllBy(year).subscribe((data) => {
      this.balances = data;
    });
  }

  // Periode ist gewächselt
  onSelectChange(newYear: string) {
    this.router.navigate(["/rpt/posts-balances", String(newYear)]);
  }
}
