import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TransactionComponent } from "./transaction/transaction.component";
import { PostgroupComponent } from "./postgroup/postgroup.component";

const routes: Routes = [
  { path: "transactions", component: TransactionComponent },
  { path: "transaction/:id", component: PostgroupComponent },
  { path: "postgroups", component: PostgroupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatRoutingModule {}
