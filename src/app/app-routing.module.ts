import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TransactionComponent } from "./cat/transaction/transaction.component";
import { PostgroupComponent } from "./cat/postgroup/postgroup.component";

const routes: Routes = [
  { path: "transactions", component: TransactionComponent },
  { path: "", redirectTo: "transactions", pathMatch: "full" },
  { path: "transaction/:id", component: PostgroupComponent },
  { path: "postgroups", component: PostgroupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
