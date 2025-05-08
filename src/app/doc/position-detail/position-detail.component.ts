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
import { PositionDetailModel, PositionModel } from "../doc.model";
import { PositionDetailService } from "./position-detail.service";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";

function complexAmountValidator(
  control: AbstractControl
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

@Component({
  selector: "app-position-detail",
  templateUrl: "./position-detail.component.html",
  styleUrl: "./position-detail.component.css",
})
export class PositionDetailComponent implements OnChanges, AfterViewInit {
  @Input() position?: PositionModel;
  @Output() submitPosition = new EventEmitter<any>();

  detail?: PositionDetailModel;

  form = new FormGroup({
    pos_id: new FormControl("", Validators.required),
    amt_dtl: new FormControl("", [complexAmountValidator]),
  });

  constructor(private posDplSrv: PositionDetailService) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes["position"] && this.position?.id) {
      try {
        this.detail = await this.posDplSrv.findOrCreate(this.position.id);
        this.patchForm();
      } catch (err) {
        console.log(
          "Fehler beim Laden oder Erstellen des Position-Details: ",
          err
        );
      }
    }
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
      this.submitPosition.emit(dtl);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
