import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DocumentComponent } from "./document/document.component";
import { PositionComponent } from "./position/position.component";
import { PeriodComponent } from "./period/period.component";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PositionFormComponent } from "./position/position-form/position-form.component";
import { DocRoutingModule } from "./doc-routing.module";
import { PositionDetailComponent } from "./position/position-detail/position-detail.component";

@NgModule({
  declarations: [
    DocumentComponent,
    PositionComponent,
    PositionDetailComponent,
    PeriodComponent,
    PositionFormComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DocRoutingModule,
    RouterModule,
  ],
  exports: [
    DocumentComponent,
    PositionComponent,
    PositionDetailComponent,
    PeriodComponent,
    PositionFormComponent,
  ],
})
export class DocModule {}
