import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PeriodComponent } from "./period/period.component";
import { DocumentComponent } from "./document/document.component";
import { PositionComponent } from "./position/position.component";

const routes: Routes = [
  { path: "periods", component: PeriodComponent },
  { path: "documents", component: DocumentComponent },
  { path: "periods/:prd/documents", component: DocumentComponent },
  { path: "periods/:prd/documents/:id", component: PositionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocRoutingModule {}
