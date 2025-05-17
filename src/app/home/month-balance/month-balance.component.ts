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
  /**
   * ToDo:
   */

  periods: PeriodModel[] = [];
  maxActPrd?: PeriodModel;

  period?: string;
  monthBalances: MonthBalanceModel[] = [];

  // Filter
  showAccounts: boolean = true;
  includeHiden: boolean = false;
  includeInact: boolean = false;

  modalOpen: boolean = false;
  dtlPrd?: string;
  dtlAccId?: number;
  dtlTraDsg?: string;

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
          this.period = prd;
          console.log("curPrd von Pfad: ", prd);

          this.loadMonthBalance(prd);
        } else {
          //const maxActPrd = this.getLatestActivePeriod(prdLst);
          this.prdSrv.findCurPrd().subscribe((p) => {
            this.maxActPrd = p;

            console.log("curPrd von DB: ", this.maxActPrd);
            if (this.maxActPrd) {
              this.router.navigate(["/home", this.maxActPrd.prd]);
            }
          });
        }
      });
    });
  }

  loadMonthBalance(prd: string) {
    this.mntBalSrv.findAllBy(prd).subscribe((data) => {
      this.monthBalances = data;
      console.log("Monats Daten: ", this.monthBalances);
    });
  }

  // Periode ist gewächselt
  onSelectChange(newPrd: string) {
    this.router.navigate(["/home", String(newPrd)]);
  }

  // Transactiondetail gedrückt
  onDetailClick(accId: number, taDsg: string) {
    this.dtlPrd = this.period;
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
