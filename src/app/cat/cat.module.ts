import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TransactionComponent } from "./transaction/transaction.component";
import { PostgroupComponent } from "./postgroup/postgroup.component";
import { PostComponent } from "./post/post.component";
import { AccountgroupComponent } from "./accountgroup/accountgroup.component";
import { AccountComponent } from "./account/account.component";
import { RouterModule } from "@angular/router";
import { CatRoutingModule } from "./cat-routing.module";

@NgModule({
  declarations: [
    TransactionComponent,
    PostgroupComponent,
    PostComponent,
    AccountgroupComponent,
    AccountComponent,
  ],
  imports: [CommonModule, CatRoutingModule, RouterModule],
  exports: [
    TransactionComponent,
    PostgroupComponent,
    PostComponent,
    AccountgroupComponent,
    AccountComponent,
  ],
})
export class CatModule {}
