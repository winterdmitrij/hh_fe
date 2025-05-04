import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { PositionDetailModel, PositionModel } from "../doc.model";
import { PositionDetailService } from "./position-detail.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-position-detail",
  templateUrl: "./position-detail.component.html",
  styleUrl: "./position-detail.component.css",
})
export class PositionDetailComponent implements OnInit, AfterViewInit {
  /** ToDos
   * - Validierung für amt_dtl
   * - resetForm() richtig
   */

  @Input() position?: PositionModel;
  @Output() submitPosition = new EventEmitter<any>();

  detail?: PositionDetailModel;

  form = new FormGroup({
    pos_id: new FormControl("", Validators.required),
    amt_dtl: new FormControl(""),
  });

  constructor(private posDplSrv: PositionDetailService) {}

  async ngOnInit(): Promise<void> {
    if (!this.position) return;

    try {
      this.detail = await this.posDplSrv.findOrCreate(this.position.id);
    } catch (err) {
      console.log(
        "Fehler beim Laden oder Erstellen des Position-Details: ",
        err
      );
    }

    this.patchForm();
  }

  ngAfterViewInit(): void {
    const modalEl = document.getElementById("detailModal");

    if (!modalEl) return;

    // Zurücksetzen beim Schließen
    modalEl.addEventListener("hidden.bs.modal", () => {
      this.form.reset();
    });
  }

  private patchForm() {
    console.log("PatchForm. Detail: ", this.detail);
    if (!this.detail) return;

    this.form.patchValue({
      pos_id: this.detail.pos_id,
      amt_dtl: this.detail.amt_dtl,
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const dtl = {
        pos_id: this.form.value.pos_id,
        amt_dtl: this.form.value.amt_dtl,
      };

      console.log("Submit: ", dtl);

      this.submitPosition.emit(dtl);
      //this.resetForm();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
