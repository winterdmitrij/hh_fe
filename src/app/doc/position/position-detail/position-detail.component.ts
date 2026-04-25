import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { PositionDetailModel, PositionModel } from "../../doc.model";
import { PositionDetailService } from "../../services/position-detail.service";

function complexAmountValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  // 1. Zeichenprüfung (erlaubt: Ziffern, +, -, ,)
  const allowedCharsRegex = /^[0-9+,\-\s]*$/;
  if (!allowedCharsRegex.test(value)) {
    return { invalidChars: true };
  }

  // 2. Keine doppelten Operatoren
  const repeatedOpsRegex = /(\+\+|--|\+\-|-\+)/;
  if (repeatedOpsRegex.test(value)) {
    return { repeatedOperators: true };
  }

  // 3. Splitten & prüfen jeder Zahl
  const parts: string[] = value.split(/(?=[+-])/); // trennt bei + oder -

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed === "") continue; // ignoriert leere Teile

    // Muss ein gültiges Dezimalformat sein (z.B. -12,34)
    if (!/^[-+]?\d+(,\d{1,2})?$/.test(trimmed)) {
      return { invalidNumber: true };
    }
  }

  return null;
}

type FormMode = "create" | "update";

@Component({
  selector: "app-position-detail",
  templateUrl: "./position-detail.component.html",
  styleUrl: "./position-detail.component.css",
})
export class PositionDetailComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() position!: PositionModel;
  @Output() submitPosition = new EventEmitter<{
    positionDetail: PositionDetailModel;
    mode: FormMode;
  }>();

  isEditMode: boolean = false;

  form = new FormGroup({
    pos_id: new FormControl("", Validators.required),
    amt_dtl: new FormControl("", [complexAmountValidator]),
  });

  constructor(private posDtlSrv: PositionDetailService) {}

  ngOnInit(): void {
    this.patchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["position"]) {
      this.patchForm();
    } else {
      this.resetForm();
    }
  }

  private patchForm() {
    this.posDtlSrv
      .findOnePositionDetail(this.position.id)
      .subscribe((positionDetail) => {
        if (positionDetail) {
          this.form.patchValue({
            pos_id: positionDetail.pos_id,
            amt_dtl: positionDetail.amt_dtl,
          });
          this.isEditMode = true;
        } else {
          this.form.reset();
          this.form.patchValue({ pos_id: this.position.id });
          this.isEditMode = false;
        }
      });
  }

  onSubmit() {
    if (this.form.valid) {
      const positionDetail = {
        pos_id: String(this.form.value.pos_id),
        amt_dtl: String(this.form.value.amt_dtl),
      };

      this.submitPosition.emit({
        positionDetail: positionDetail,
        mode: this.isEditMode ? "update" : "create",
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  // ----- E V E N T B E A R B E I T U N G -----
  ngAfterViewInit(): void {
    const modalEl = document.getElementById("positionDetailModal");

    if (!modalEl) return;

    // Zurücksetzen beim Schließen
    modalEl.addEventListener("hidden.bs.modal", () => {
      this.form.reset();
    });

    // Beim Öffnen → neu befüllen
    modalEl.addEventListener("shown.bs.modal", () => {
      this.patchForm();
    });
  }

  private resetForm() {
    this.form.reset();

    // Touch-Status entfernen (sonst bleibt is-invalid sichtbar)
    Object.keys(this.form.controls).forEach((key) =>
      this.form.get(key)?.markAsUntouched(),
    );
  }
}
