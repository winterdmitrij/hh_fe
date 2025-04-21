import {
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
import { AccountModel, InformationModel, PostModel } from "../../cat/cat.model";
import { AccountService } from "../../cat/account/account.service";
import { PostService } from "../../cat/post/post.service";
import { DocumentModel, PositionModel } from "../doc.model";
import { InformationService } from "../../cat/services/information.service";

// Custom Validator
function nonZeroValidator(control: AbstractControl): ValidationErrors | null {
  return control.value !== 0 ? null : { nonZero: true };
}

@Component({
  selector: "app-position-form",
  templateUrl: "./position-form.component.html",
  styleUrl: "./position-form.component.css",
})
export class PositionFormComponent implements OnInit, OnChanges {
  /**
   * Diese Form wird fürs Hinzufügen oder Äktualisiren von Position benutzt
   */

  /* ToDo:
- Info-Elemente bei Feld.invalid (z.B Border: red, info: zu lang, oder Pflichtfeld...)
- Filter-Möglichkeit für posts (vielleicht radios: nur Einkommen, nur Ausgaben)
- HIER muss Schaltfläche mit Lupe beim EXP-Dokument angezeigt
*/
  @Input() document?: DocumentModel;
  @Input() position?: PositionModel;

  @Output() submitPosition = new EventEmitter<any>();

  // Dropdown-Listen
  posts: PostModel[] = [];
  accounts: AccountModel[] = [];

  // Dokumenteninformation
  docInf?: InformationModel;
  defAccId?: number;

  posId?: string;

  // Reactive Form
  form = new FormGroup({
    id: new FormControl("", [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
    ]),
    doc_id: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8),
    ]),
    acc_id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(100),
    ]),
    pst_id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(10000),
    ]),
    amt: new FormControl<number | null>(null, [
      Validators.required,
      nonZeroValidator,
    ]),
    cmt: new FormControl(""),
  });

  constructor(
    private accSrv: AccountService,
    private pstSrv: PostService,
    private infSrv: InformationService
  ) {}

  ngOnInit(): void {
    this.loadDropdowns();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["document"]) {
      this.loadDocInfoAndInitForm();
    }
    if (changes["position"] && this.document) {
      this.patchForm(); // Für Edit-Mode
    }
  }

  // --- Initialisierung ---
  loadDropdowns() {
    this.accSrv.findAll().subscribe((data) => (this.accounts = data));
    this.pstSrv.findAll().subscribe((data) => (this.posts = data));
  }

  // gibt den Dokument-Type aus Dokument-Id zurück
  loadDocInfoAndInitForm() {
    if (!this.document) return;
    const docTyp = this.document.id.substring(5, 8);

    this.infSrv.findOne(docTyp).subscribe({
      next: (info) => {
        this.docInf = info;
        this.defAccId = info.account.id;
        this.patchForm(); // Initialisiere erst jetzt!
      },
      error: (err) => {
        console.error("Fehler beim Laden der Dokument-Information:", err);
      },
    });
  }

  // Befüllt der FormForm
  patchForm() {
    if (!this.document) return;

    if (!this.position) {
      // Neue Position (Add)
      this.posId = this.getNextPosId();

      this.form.patchValue({
        id: this.posId,
        doc_id: this.document.id,
        acc_id: this.defAccId ?? null,
      });

      console.log("Neue Position: ", this.posId);
    } else {
      // Vorhandene Position (Edit)
      this.posId = this.position.id;

      this.form.patchValue({
        id: this.position.id,
        doc_id: this.document.id,
        acc_id: this.position.account?.id ?? null,
        pst_id: this.position.post?.id ?? null,
        amt: this.position.amt ?? null,
        cmt: this.position.cmt ?? "",
      });

      console.log("Position bearbeiten: ", this.posId);
    }
  }

  // --- Submit ---
  onSubmit() {
    if (this.form.valid) {
      const pos = {
        id: this.form.value.id,
        amt: this.form.value.amt,
        cmt: this.form.value.cmt,
        document: { id: this.form.value.doc_id },
        account: { id: this.form.value.acc_id },
        post: { id: this.form.value.pst_id },
      };

      this.submitPosition.emit(pos);
      this.form.reset();
    } else {
      this.form.markAllAsTouched(); // UI zeigt sofort Fehler
    }
  }

  // --- Hilfsmethoden ---
  getNextPosId(): string {
    if (!this.document) return "";
    const docId = this.document.id;

    // Existierende Position-Id's
    const extPosIds = this.document.positions?.map((pos) => pos.id) || [];

    // Filtriere nur Suffix-Number
    const sufNums = extPosIds
      .map((id) => id.split(".")[1]) // "02"
      .map((str) => parseInt(str || "0", 10)) // 2
      .filter((n) => !isNaN(n)); // Nur gültige Zahlen

    // Max Zahl finden
    const maxNum = sufNums.length > 0 ? Math.max(...sufNums) : 0;

    // Ins String konvertieren
    const nextNum = (maxNum + 1).toString().padStart(2, "0");

    return `${docId}.${nextNum}`;
  }
}
