import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountBalanceComponent } from "./account-balance/account-balance.component";
import { PostBalanceComponent } from "./post-balance/post-balance.component";

const routes: Routes = [
  {
    path: "accounts-balances",
    component: AccountBalanceComponent,
  },
  {
    path: "accounts-balances/:year",
    component: AccountBalanceComponent,
  },
  { path: "posts-balances", component: PostBalanceComponent },
  { path: "posts-balances/:year", component: PostBalanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RptRoutingModule {}
