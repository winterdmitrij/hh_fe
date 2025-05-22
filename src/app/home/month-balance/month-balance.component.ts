declare var bootstrap: any;
import { Component, OnInit } from "@angular/core";
import { PeriodService } from "../../doc/period/period.service";
import { PeriodModel } from "../../doc/doc.model";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { MonthBalanceService } from "../services/month-balance.service";
import { MonthBalanceModel } from "../home.model";

@Component({
  selector: "app-month-balance",
  templateUrl: "./month-balance.component.html",
  styleUrl: "./month-balance.component.css",
})
export class MonthBalanceComponent implements OnInit {
  periods: PeriodModel[] = [];
  curPrd?: string;

  monthBalances: MonthBalanceModel[] = [];

  // Filter
  showAccounts: boolean = false;
  includeHiden: boolean = false;
  includeInact: boolean = false;

  modalOpen: boolean = false;
  dtlPrd?: string;
  dtlAccId?: number;
  dtlTraDsg?: string;

  // Für Tabellenfuß
  cashAccIds: number[] = [101, 102, 103, 104, 201];
  cashTotal: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prdSrv: PeriodService,
    private mntBalSrv: MonthBalanceService
  ) {}

  ngOnInit() {
    this.loadPeriods();
  }

  loadPeriods() {
    this.prdSrv.findAll().subscribe((prdLst) => {
      this.periods = prdLst;

      // Pfad-Parameter ablesen und Dokument laden oder verlinken
      this.route.params.subscribe((params: Params) => {
        const prd = params["prd"];

        if (prd) {
          this.curPrd = prd;
          this.loadMonthBalance(prd);
        } else {
          this.prdSrv.findCurPrd().subscribe((period) => {
            if (period) {
              this.router.navigate(["/home", period.prd]);
            }
          });
        }
      });
    });
  }

  loadMonthBalance(prd: string) {
    this.mntBalSrv.findAllBy(prd).subscribe((data) => {
      this.monthBalances = data;

      this.cashTotal = data
        .filter((mb) => this.cashAccIds.includes(+mb.acc_id))
        .reduce((sum, mb) => sum + (+mb.end_std || 0), 0);
    });
  }

  // Periode ist gewächselt
  onSelectChange(newPrd: string) {
    this.router.navigate(["/home", String(newPrd)]);
  }

  // Transactiondetail gedrückt
  onDetailClick(accId: number, taDsg: string) {
    this.dtlPrd = this.curPrd;
    this.dtlAccId = accId;
    this.dtlTraDsg = taDsg;

    const modalEl = document.getElementById("transactionsDetail");

    if (modalEl) {
      this.modalOpen = true;
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  //? Nicht sicher, ob ich es hier brauche
  onModalClosed() {
    const modalEl = document.getElementById("transactionsDetail");

    if (modalEl) {
      this.dtlPrd = undefined;
      this.dtlAccId = undefined;
      this.dtlTraDsg = undefined;
      this.modalOpen = false;
      console.log("Modal geschloßen!");
      const modal = new bootstrap.Modal(modalEl);
      modal.hide();
    }
  }

  get filteredMonthBalances(): MonthBalanceModel[] {
    return this.monthBalances.filter((mb) => {
      // 1. Filter: Gruppen oder Konten
      if (!this.showAccounts && !mb.grp) return false;

      // 2. Filter: Nur sichtbare?
      if (!this.includeHiden && !mb.shw) return false;

      // 3. Filter: Nur active?
      if (!this.includeInact && !mb.act) return false;

      return true; // Alle Bedingungen erfüllt
    });
  }
}
