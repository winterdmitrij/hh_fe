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
import {
  AccountModel,
  InformationModel,
  PostModel,
  TransactionModel,
} from "../../cat/cat.model";
import { AccountService } from "../../cat/services/account.service";
import { DocumentModel, PositionModel } from "../doc.model";
import { InformationService } from "../../cat/services/information.service";
import { TransactionService } from "../../cat/transaction/transaction.service";
import { firstValueFrom } from "rxjs";
import { PostService } from "../../cat/services/post.service";

// Validator für Betrag: darf nich 0 sein
function nonZeroValidator(control: AbstractControl): ValidationErrors | null {
  return control.value !== 0 ? null : { nonZero: true };
}

@Component({
  selector: "app-position-form",
  templateUrl: "./position-form.component.html",
  styleUrl: "./position-form.component.css",
})
export class PositionFormComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() document?: DocumentModel;
  @Input() position?: PositionModel;
  @Output() submitPosition = new EventEmitter<any>();

  accounts: AccountModel[] = [];
  transactions: TransactionModel[] = [];
  allPosts: PostModel[] = [];
  posts: PostModel[] = [];

  docInf?: InformationModel;
  defAccId?: number;
  selTraId?: number;

  canChanged: boolean = false;
  isUpdMode: boolean = false;
  posId?: string;
  //  docTyp?: string;

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
    tra_id: new FormControl<number>(1, Validators.required),
    pst_id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(10000),
    ]),
    amt: new FormControl<number | null>(null, [
      Validators.required,
      //nonZeroValidator,
    ]),
    cmt: new FormControl(""),
  });

  constructor(
    private accSrv: AccountService,
    private traSrv: TransactionService,
    private infSrv: InformationService,
    private pstSrv: PostService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadDropdowns();
    this.loadDocInfoAndInitForm();

    this.form.get("tra_id")?.valueChanges.subscribe((tra_id) => {
      this.selTraId = Number(tra_id);
      this.posts = this.getFiltredPosts(this.selTraId);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["position"] || changes["document"]) {
      this.isUpdMode = !!this.position;

      if (this.transactions.length > 0) {
        this.loadDocInfoAndInitForm();
      }
    }
  }

  // Erhalten Daten von BE
  async loadDropdowns(): Promise<void> {
    try {
      const [accData, traData, pstData] = await Promise.all([
        firstValueFrom(this.accSrv.findAllAccounts()),
        firstValueFrom(this.traSrv.findAll()),
        firstValueFrom(this.pstSrv.findAll()),
      ]);
      this.accounts = accData;
      this.transactions = traData;
      this.allPosts = pstData;
    } catch (error) {
      console.error("Fehler beim Laden der Dropdowns: ", error);
    }
  }

  // Eventbearbeitung auf Form
  ngAfterViewInit(): void {
    const modalEl = document.getElementById("positionModal");

    if (!modalEl) return;

    // Zurücksetzen beim Schließen
    modalEl.addEventListener("hidden.bs.modal", () => {
      this.resetForm();
    });
  }

  // Laden die Dokumentinformation und Initioalisieren Form-Variablen
  loadDocInfoAndInitForm() {
    if (!this.document) return;

    const docTyp = this.document.id.substring(5, 8);

    this.infSrv.findOne(docTyp).subscribe({
      next: (info) => {
        this.docInf = info;
        this.defAccId = info.account.id;

        // 1. Versuche die tra_id anhand des Post der Position zu bestimmen
        if (this.position?.post?.id) {
          const postId = this.position.post.id;
          const matchedTra = this.transactions.find((t) =>
            t.postgroups?.some((pg) => pg.posts?.some((p) => p.id === postId)),
          );
          if (matchedTra) {
            this.selTraId = matchedTra.id;
          }
        }

        // 2. Falls keine zugehörige Transaction gefunden, verwende die Dokument-Default-Transaction
        if (!this.selTraId && info.transaction?.id) {
          this.selTraId = info.transaction.id;
        }

        // 3. Wenn immer noch nichts gefunden, setze auf 1
        if (!this.selTraId) {
          this.selTraId = 1;
        }

        // 4. Setze Wert im Formular und (de)aktiviere entsprechend
        this.form.get("tra_id")?.setValue(this.selTraId);
        this.canChanged = !info.transaction?.id;
        if (this.canChanged) {
          this.form.get("tra_id")?.enable();
        } else {
          this.form.get("tra_id")?.disable();
        }

        // 5. Filtere Posts und patchForm
        this.posts = this.getFiltredPosts(this.selTraId);

        if (this.transactions.length > 0) {
          this.patchForm();
        }
      },
      error: (err) => {
        console.error("Fehler beim Laden der Dokument-Information:", err);
      },
    });
  }

  // Befüllen die Form mit Daten
  patchForm() {
    if (!this.document) return;

    // Für neue Position
    if (!this.position) {
      this.posId = this.getNextPosId();

      this.form.patchValue({
        id: this.posId,
        doc_id: this.document.id,
        acc_id: this.defAccId ?? null,
        tra_id: this.selTraId ?? 1,
      });
    } else {
      // Für editierende Position
      this.posId = this.position.id;
      this.form.patchValue({
        id: this.position.id,
        doc_id: this.document.id,
        acc_id: this.position.account?.id ?? null,
        tra_id: this.selTraId ?? 1,
        pst_id: this.position.post?.id ?? null,
        amt: this.position.amt ?? 0,
        cmt: this.position.cmt ?? "",
      });
    }
    console.log("PositionId: ", this.posId);
  }

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
    } else {
      this.form.markAllAsTouched();
    }
  }

  // Beleeren Form
  private resetForm() {
    this.form.reset();

    // Touch-Status entfernen (sonst bleibt is-invalid sichtbar)
    Object.keys(this.form.controls).forEach((key) =>
      this.form.get(key)?.markAsUntouched(),
    );

    // Setze Defaultwerte für neue Position
    this.form.patchValue({
      acc_id: this.defAccId,
      tra_id: this.selTraId ?? 1,
    });
  }

  //-------------------------------------------------------//
  //               Hilfsfunktionen                         //
  //-------------------------------------------------------//
  private getNextPosId(): string {
    if (!this.document) return "";
    const docId = this.document.id;

    const extPosIds = this.document.positions?.map((pos) => pos.id) || [];
    const sufNums = extPosIds
      .map((id) => id.split(".")[1])
      .map((str) => parseInt(str || "0", 10))
      .filter((n) => !isNaN(n));

    const maxNum = sufNums.length > 0 ? Math.max(...sufNums) : 0;
    const nextNum = (maxNum + 1).toString().padStart(2, "0");

    return `${docId}.${nextNum}`;
  }

  private getFiltredPosts(taId: number): PostModel[] {
    const fltPst = this.allPosts.filter(
      (p) => String(p.postgroup?.transaction?.id) === String(taId),
    );
    return fltPst;
  }
}
