import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TransactionComponent } from "./transaction/transaction.component";
import { PostgroupComponent } from "./postgroup/postgroup.component";
import { PostComponent } from "./post/post.component";
import { AccountgroupComponent } from "./accountgroup/accountgroup.component";
import { AccountComponent } from "./account/account.component";
import { RouterModule } from "@angular/router";
import { CatRoutingModule } from "./cat-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PostgroupFormComponent } from './postgroup/postgroup-form/postgroup-form.component';
import { PostFormComponent } from './post/post-form/post-form.component';
import { AccountgroupFormComponent } from './accountgroup/accountgroup-form/accountgroup-form.component';
import { AccountFormComponent } from './account/account-form/account-form.component';

@NgModule({
  declarations: [
    TransactionComponent,
    PostgroupComponent,
    PostComponent,
    AccountgroupComponent,
    AccountComponent,
    PostgroupFormComponent,
    PostFormComponent,
    AccountgroupFormComponent,
    AccountFormComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CatRoutingModule,
    RouterModule,
  ],
  exports: [
    TransactionComponent,
    PostgroupComponent,
    PostComponent,
    AccountgroupComponent,
    AccountComponent,
  ],
})
export class CatModule {}
