import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TransactionComponent } from "./transaction/transaction.component";
import { PostgroupComponent } from "./postgroup/postgroup.component";
import { AccountgroupComponent } from "./accountgroup/accountgroup.component";
import { AccountComponent } from "./account/account.component";
import { PostComponent } from "./post/post.component";

const routes: Routes = [
  { path: "transactions", component: TransactionComponent },
  { path: "postgroups", component: PostgroupComponent },
  { path: "transaction/:taid/postgroups", component: PostgroupComponent },
  { path: "posts", component: PostComponent },
  { path: "transaction/:taid/postgroup/:pgid/posts", component: PostComponent },
  { path: "accountgroups", component: AccountgroupComponent },
  { path: "accounts", component: AccountComponent },
  { path: "accountgroup/:agid/accounts", component: AccountComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatRoutingModule {}
