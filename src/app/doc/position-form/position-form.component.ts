import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AccountModel, PostModel } from "../../cat/cat.model";
import { AccountService } from "../../cat/account/account.service";
import { PostService } from "../../cat/post/post.service";
import { DocumentModel, PositionModel } from "../doc.model";

@Component({
  selector: "app-position-form",
  templateUrl: "./position-form.component.html",
  styleUrl: "./position-form.component.css",
})
export class PositionFormComponent implements OnInit, OnChanges {
  /* ToDo:
- Validator an Betrag: !=0;
- Default Werte von acc_id und pst_id für Dokumenten
- Filter-Möglichkeit für pst_id
- 
*/

  @Input() document?: DocumentModel;
  @Input() position?: PositionModel;

  posId?: string;

  @Output() submitPosition = new EventEmitter<any>();

  posts: PostModel[] = [];
  accounts: AccountModel[] = [];

  form = new FormGroup({
    id: new FormControl("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
      ],
    }),
    doc_id: new FormControl("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ],
    }),
    acc_id: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(100)],
    }),
    pst_id: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(10000)],
    }),
    amt: new FormControl<number>(0, {
      nonNullable: true,
      validators: Validators.required, // ToDo: Validator: nonZeroValidator
    }),
    cmt: new FormControl(""),
  });

  constructor(private accSrv: AccountService, private pstSrv: PostService) {}

  ngOnInit(): void {
    this.loadDropdowns();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["document"] || changes["position"]) {
      this.initForm();
    }
  }

  // lädt die Konten und Posten
  loadDropdowns() {
    this.accSrv.findAll().subscribe((data) => (this.accounts = data));
    this.pstSrv.findAll().subscribe((data) => (this.posts = data));
  }

  // initialisiert den Form
  initForm() {
    if (!this.document) return;

    // Entscheiden ob Add oder Edit
    if (!this.position) {
      this.posId = this.getNextPosId();

      // Form befüllen
      this.form.patchValue({
        id: this.posId,
        doc_id: this.document?.id,
      });

      console.log("Neuer PositionsId (Add): ", this.posId);
    } else {
      this.posId = this.position.id; // Das brauche ich fürs Form

      // Form befüllen
      this.form.patchValue({
        id: this.position.id,
        doc_id: this.document.id,
        acc_id: this.position.account?.id,
        pst_id: this.position.post?.id,
        amt: this.position.amt ?? 0,
        cmt: this.position.cmt ?? "",
      });

      console.log("Position bearbeiten (Edit), Id: ", this.posId);
    }
  }

  // gibt den neuen Positions-Id zurück
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

  // Submit
  onSubmit() {
    if (this.form.valid) {
      const savPos = {
        id: this.form.value.id,
        amt: this.form.value.amt,
        cmt: this.form.value.cmt,
        document: { id: this.form.value.doc_id },
        account: { id: this.form.value.acc_id },
        post: { id: this.form.value.pst_id },
      };

      this.submitPosition.emit(savPos);
      this.form.reset();
    }
  }
}
