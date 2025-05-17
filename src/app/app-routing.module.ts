import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TransactionComponent } from "./cat/transaction/transaction.component";
import { PostgroupComponent } from "./cat/postgroup/postgroup.component";
import { PeriodComponent } from "./doc/period/period.component";
import { DocumentComponent } from "./doc/document/document.component";
import { PositionComponent } from "./doc/position/position.component";
import { MonthBalanceComponent } from "./home/month-balance/month-balance.component";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },

  {
    path: "home",
    loadChildren: () => import("./home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "cat",
    loadChildren: () => import("./cat/cat.module").then((m) => m.CatModule),
  },
  {
    path: "doc",
    loadChildren: () => import("./doc/doc.module").then((m) => m.DocModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
