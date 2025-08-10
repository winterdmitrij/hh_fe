import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RptRoutingModule } from "./rpt-routing.module";
import { AccountBalanceComponent } from "./account-balance/account-balance.component";
import { PostBalanceComponent } from "./post-balance/post-balance.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AccountBalanceComponent, PostBalanceComponent],
  imports: [CommonModule, FormsModule, RptRoutingModule],
})
export class RptModule {}
