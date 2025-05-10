import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TransactionComponent } from "./cat/transaction/transaction.component";
import { PostgroupComponent } from "./cat/postgroup/postgroup.component";
import { PeriodComponent } from "./doc/period/period.component";
import { DocumentComponent } from "./doc/document/document.component";
import { PositionComponent } from "./doc/position/position.component";
import { MonthBalanceComponent } from "./home/month-balance/month-balance.component";

const routes: Routes = [
  { path: "home", component: MonthBalanceComponent },
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home/:prd", component: MonthBalanceComponent },
  { path: "transactions", component: TransactionComponent },
  { path: "transaction/:id", component: PostgroupComponent },
  { path: "postgroups", component: PostgroupComponent },
  { path: "periods", component: PeriodComponent },
  { path: "periods/:prd/documents", component: DocumentComponent },
  { path: "documents", component: DocumentComponent },
  { path: "periods/:prd/documents/:id", component: PositionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
