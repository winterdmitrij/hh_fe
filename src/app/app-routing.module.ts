import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TransactionComponent } from "./cat/transaction/transaction.component";
import { PostgroupComponent } from "./cat/postgroup/postgroup.component";
import { PeriodComponent } from "./doc/period/period.component";
import { DocumentComponent } from "./doc/document/document.component";
import { PositionComponent } from "./doc/position/position.component";

const routes: Routes = [
  { path: "transactions", component: TransactionComponent },
  //  { path: "", redirectTo: "transactions", pathMatch: "full" },
  { path: "transaction/:id", component: PostgroupComponent },
  { path: "postgroups", component: PostgroupComponent },
  { path: "periods", component: PeriodComponent },
  { path: "documents", component: DocumentComponent },
  { path: "documents/:id", component: PositionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
