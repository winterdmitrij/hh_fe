import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MonthBalanceComponent } from "./month-balance/month-balance.component";

const routes: Routes = [
  { path: "", component: MonthBalanceComponent }, // Standard-Startseite
  { path: ":prd", component: MonthBalanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
