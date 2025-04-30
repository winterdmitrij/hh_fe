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
import {
  AccountModel,
  InformationModel,
  PostModel,
  TransactionModel,
} from "../../cat/cat.model";
import { AccountService } from "../../cat/account/account.service";
import { DocumentModel, PositionModel } from "../doc.model";
import { InformationService } from "../../cat/services/information.service";
import { TransactionService } from "../../cat/transaction/transaction.service";
import { firstValueFrom } from "rxjs";

// Custom Validator
function nonZeroValidator(control: AbstractControl): ValidationErrors | null {
  return control.value !== 0 ? null : { nonZero: true };
}

@Component({
  selector: "app-position-form",
  templateUrl: "./position-form.component.html",
  styleUrl: "./position-form.component.css",
})
export class PositionFormComponent implements OnInit {
  /**
   * Diese Form wird fürs Hinzufügen oder Äktualisiren von Position benutzt
   */
  @Input() document?: DocumentModel;
  @Input() position?: PositionModel;

  @Output() submitPosition = new EventEmitter<any>();

  // Dropdown-Listen
  accounts: AccountModel[] = [];
  posts: PostModel[] = [];

  transactions: TransactionModel[] = [];

  // Dokumenteninformation
  docInf?: InformationModel;
  defAccId?: number;
  selTraId?: number; // TransactionId für Postsfilter
  canChanged: boolean = false; // wenn false, darf traId nicht geändert werden

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
    tra_id: new FormControl<number>(1, Validators.required),
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
    private traSrv: TransactionService,
    private infSrv: InformationService
  ) {}

  async ngOnInit(): Promise<void> {
    console.log("ngOnInit gestarted.");
    await this.loadDropdowns();

    // Jetzt kannst du die nächste Funktion starten
    this.loadDocInfoAndInitForm(); // jetzt sicher nach Dropdowns

    // Änderung des Transaktions
    this.form.get("tra_id")?.valueChanges.subscribe((tra_id) => {
      this.selTraId = Number(tra_id);
      this.posts = this.getFiltredPosts(this.selTraId);
    });
  }

  // --- Initialisierung ---
  async loadDropdowns(): Promise<void> {
    console.log("loadDropdowns gestarted.");

    try {
      const [accData, traData] = await Promise.all([
        firstValueFrom(this.accSrv.findAll()),
        firstValueFrom(this.traSrv.findAll()),
      ]);

      this.accounts = accData;
      this.transactions = traData;
    } catch (error) {
      console.error("Fehler beim Laden der Dropdowns: ", error);
    }

    console.log("- Accounts: ", this.accounts);
    console.log("- Transactions: ", this.transactions);
  }

  // ermittelt Dokumentinfo
  loadDocInfoAndInitForm() {
    console.log("loadDocInfoAndInitForm gestarted: ", this.document);
    if (!this.document) return;

    const docTyp = this.document.id.substring(5, 8);

    this.infSrv.findOne(docTyp).subscribe({
      next: (info) => {
        this.docInf = info;
        this.defAccId = info.account.id;
        if (info.transaction?.id) {
          this.selTraId = info.transaction?.id;
          //this.form.get("tra_id")?.setValue(this.selTraId);
          this.canChanged = false;
          this.form.get("tra_id")?.disable();
        } else {
          this.selTraId = 1;
          //          this.form.get("tra_id")?.setValue(this.selTraId);
          this.canChanged = true;
          this.form.get("tra_id")?.enable();
        }
        console.log("- Selected TransactionId: ", this.selTraId);
        this.form.get("tra_id")?.setValue(this.selTraId);

        this.posts = this.getFiltredPosts(this.selTraId);
        console.log("- Aktuelle Posten: ", this.posts);

        // PatchForm nur wenn Transaktionen schon geladen
        if (this.transactions.length > 0) this.patchForm();
      },
      error: (err) => {
        console.error("Fehler beim Laden der Dokument-Information:", err);
      },
    });
  }

  // Befüllt der FormForm
  // ToDo: beim Ändern befüllung der Konto
  patchForm() {
    console.log("patchForm gestarted.");
    if (!this.document) return;

    if (!this.position) {
      // Neue Position (Add)
      this.posId = this.getNextPosId();

      this.form.patchValue({
        id: this.posId,
        doc_id: this.document.id,
        acc_id: this.defAccId ?? null,
        tra_id: this.selTraId ?? 1,
      });

      //      console.log("Neue Position: ", this.posId);
    } else {
      // Vorhandene Position (Edit)
      this.posId = this.position.id;

      this.form.patchValue({
        id: this.position.id,
        doc_id: this.document.id,
        acc_id: this.position.account?.id ?? null,
        //       tra_id: this.selTraId,
        pst_id: this.position.post?.id ?? null,
        amt: this.position.amt ?? null,
        cmt: this.position.cmt ?? "",
      });

      //      console.log("Position bearbeiten: ", this.posId);
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
    console.log("getNextPosId gestarted.");
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

  // Gibt filtrierten Posts zurück
  private getFiltredPosts(taId: number): PostModel[] {
    console.log("getFilteredPosts gestarted. Id: ", taId); // Gibt richtig aus

    const tra = this.transactions.find((t) => +t.id === +taId);
    console.log("- Selected Transaction: ", tra); // Gibt undefined aus

    if (!tra || !tra.postgroups) {
      return [];
    }

    //    console.log("- Groups des Transaktions: ", tra.postgroups);
    return tra.postgroups
      .flatMap((pg) => pg.posts || []) // sammelt alle Posts aus allen Gruppen
      .filter((post) => post.act); // optional: nur aktive/sichtbare
  }
}
