import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TransactionDetailService } from "../services/transaction-detail.service";
import { TransactionDetailModel } from "../home.model";

@Component({
  selector: "app-transaction-detail",
  templateUrl: "./transaction-detail.component.html",
  styleUrl: "./transaction-detail.component.css",
})
export class TransactionDetailComponent implements OnChanges {
  /**
   * ToDo:
   * - Header nachdenken: accountDsg nicht immer richtig.
   * - AfterView realisieren: Um accountDsg leeren, nach schliesen.
   */
  @Input() period!: string;
  @Input() accountId!: number;
  @Input() transactionDsg!: string;

  details?: TransactionDetailModel[];
  accountDsg?: string;

  constructor(private praDtlSrv: TransactionDetailService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["period"] ||
      changes["accountId"] ||
      changes["transactionDsg"]
    ) {
      this.loadTransactions();
    }
  }

  loadTransactions() {
    if (this.period && this.accountId && this.transactionDsg) {
      this.praDtlSrv
        .findAllBy(this.period, this.accountId, this.transactionDsg)
        .subscribe((data) => {
          this.details = data;
          console.log("Details: ", this.details);
          if (data.length > 0) {
            this.accountDsg = data[0].acc_dsg;
          }
        });
    }
  }

  // Gibt TRUE, wenn Positionen vorhanden sind.
  get hasDetails(): boolean {
    return Array.isArray(this.details) && this.details.length > 0;
  }
}
