import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DocumentComponent } from "./document/document.component";
import { PositionComponent } from "./position/position.component";
import { PositionDetailComponent } from "./position-detail/position-detail.component";
import { PeriodComponent } from "./period/period.component";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PositionFormComponent } from './position-form/position-form.component';

@NgModule({
  declarations: [
    DocumentComponent,
    PositionComponent,
    PositionDetailComponent,
    PeriodComponent,
    PositionFormComponent,
  ],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  exports: [
    DocumentComponent,
    PositionComponent,
    PositionDetailComponent,
    PeriodComponent,
  ],
})
export class DocModule {}
