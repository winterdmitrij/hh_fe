import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TransactionComponent } from "./cat/transaction/transaction.component";

const routes: Routes = [
  { path: "transactions", component: TransactionComponent },
  { path: "", redirectTo: "transactions", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
