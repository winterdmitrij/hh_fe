import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MonthBalanceComponent } from "./month-balance/month-balance.component";
import { TransactionDetailComponent } from "./transaction-detail/transaction-detail.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HomeRoutingModule } from "./home-routing.module";

@NgModule({
  declarations: [MonthBalanceComponent, TransactionDetailComponent],
  imports: [FormsModule, CommonModule, HomeRoutingModule, RouterModule],
  exports: [MonthBalanceComponent, TransactionDetailComponent],
})
export class HomeModule {}
