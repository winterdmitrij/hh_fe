import { Component, OnInit } from "@angular/core";
import { PeriodModel } from "../doc.model";
import { PeriodService } from "./period.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-period",
  templateUrl: "./period.component.html",
  styleUrl: "./period.component.css",
})
export class PeriodComponent implements OnInit {
  periods: PeriodModel[] = [];
  updPeriod?: PeriodModel;

  constructor(private prdSrv: PeriodService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.prdSrv.findAll().subscribe((data) => (this.periods = data));
  }

  onClickEdit(period: PeriodModel) {
    this.updPeriod = period;
  }

  // Save Change
  onUpdPrd(period: PeriodModel): void {
    this.prdSrv.update(period.prd, period).subscribe({
      next: (response) => this.load(),
      error: (error: HttpErrorResponse) => alert(error.message),
    });
  }
}
