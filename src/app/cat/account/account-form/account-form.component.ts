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
import { AccountModel } from "../../cat.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AccountService } from "../../services/account.service";
import { map, Observable } from "rxjs";

@Component({
  selector: "app-account-form",
  templateUrl: "./account-form.component.html",
  styleUrl: "./account-form.component.css",
})
export class AccountFormComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() account?: AccountModel;
  @Input() accountGroupId?: string;
  @Output() submitAccount = new EventEmitter<any>();

  newAccountId?: number;

  form = new FormGroup({
    id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3),
    ]),
    dsg: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(30),
    ]),
    dsc: new FormControl("", [Validators.maxLength(50)]),
    rnk: new FormControl("", [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1),
    ]),
    act: new FormControl<boolean>(true, [Validators.required]),
    sav: new FormControl<boolean>(false, [Validators.required]),
    shw: new FormControl<boolean>(true, [Validators.required]),
    ag_id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1),
    ]),
  });

  constructor(private accSrv: AccountService) {}

  ngOnInit() {
    this.patchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["account"]) {
      if (this.account) {
        this.patchForm();
      } else {
        this.resetForm();
      }
    }
  }

  patchForm() {
    if (this.account) {
      this.form.patchValue({
        id: this.account.id,
        dsg: this.account.dsg,
        dsc: this.account.dsc,
        rnk: this.account.rnk,
        act: this.account.act,
        sav: this.account.sav,
        shw: this.account.shw,
        ag_id: Number(this.accountGroupId),
      });
    } else {
      this.getNewAccountId().subscribe((id) => {
        this.newAccountId = id;

        this.form.patchValue({
          id: this.newAccountId,
          act: true,
          sav: false,
          shw: true,
          ag_id: Number(this.accountGroupId),
        });
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const account = {
        id: this.form.value.id,
        dsg: this.form.value.dsg,
        dsc: this.form.value.dsc,
        rnk: this.form.value.rnk,
        act: this.form.value.act,
        sav: this.form.value.sav,
        shw: this.form.value.shw,
        accountgroup: { id: this.form.value.ag_id },
      };

      this.submitAccount.emit(account);
    } else {
      this.form.markAllAsTouched();
    }
  }

  // ----- E V E N T B E A R B E I T U N G -----
  ngAfterViewInit(): void {
    const modalEl = document.getElementById("accountModal");

    if (!modalEl) return;

    // Zurücksetzen beim Schließen
    modalEl.addEventListener("hidden.bs.modal", () => {
      this.resetForm();
    });

    // Beim Öffnen → neu befüllen
    modalEl.addEventListener("shown.bs.modal", () => {
      this.patchForm();
    });
  }

  private resetForm() {
    this.form.reset();
    this.account = undefined;
    //    this.accountGroupId = undefined;
    this.newAccountId = undefined;

    // Touch-Status entfernen (sonst bleibt is-invalid sichtbar)
    Object.keys(this.form.controls).forEach((key) =>
      this.form.get(key)?.markAsUntouched(),
    );
  }

  // ----- H I L F S F U N K T I O N E N -----
  private getNewAccountId(): Observable<number> {
    return this.accSrv.findOneAccountGroup(this.accountGroupId!).pipe(
      map((data) => {
        const count = data.accounts?.length || 0;
        const newId = +this.accountGroupId! * 100 + count + 1;
        return newId;
      }),
    );
  }
}
