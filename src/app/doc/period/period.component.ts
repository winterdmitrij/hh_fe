declare var bootstrap: any;
import { Component, OnInit } from "@angular/core";
import { PeriodModel } from "../doc.model";
import { PeriodService } from "../services/period.service";
import { tap } from "rxjs";

@Component({
  selector: "app-period",
  templateUrl: "./period.component.html",
  styleUrl: "./period.component.css",
})
export class PeriodComponent implements OnInit {
  title = "Perioden";

  periods: PeriodModel[] = [];

  isModalOpen: boolean = false;
  updPeriod?: PeriodModel;

  constructor(private prdSrv: PeriodService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.prdSrv
      .findAll()
      .pipe(tap((data) => (this.periods = data)))
      .subscribe();
  }

  //----- C L I C K - E V E N T S -----
  onClickModalUpdate(period: PeriodModel): void {
    this.updPeriod = period;
    this.showModal("updPeriodModal");
  }

  onClickCloseModal(modalId: string): void {
    this.hideModal(modalId);
  }

  // ----- M O D A L E V E N T S - B E H A N D L U N G -----
  handlePeriodSave(period: PeriodModel): void {
    this.prdSrv.updatePeriod(period.prd, period).subscribe({
      next: (res) => this.loadData(),
      error: (err) => alert(err),
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
    this.updPeriod = undefined;
    this.isModalOpen = false;
    modal.hide();

    this.loadData();
  }
}
