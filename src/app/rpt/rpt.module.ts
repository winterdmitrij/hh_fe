import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RptRoutingModule } from './rpt-routing.module';
import { AccountBalanceComponent } from './account-balance/account-balance.component';
import { PostBalanceComponent } from './post-balance/post-balance.component';


@NgModule({
  declarations: [
    AccountBalanceComponent,
    PostBalanceComponent
  ],
  imports: [
    CommonModule,
    RptRoutingModule
  ]
})
export class RptModule { }
