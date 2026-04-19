import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { AccountGroupModel } from "../../cat.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AccountService } from "../../services/account.service";
import { map, Observable } from "rxjs";

@Component({
  selector: "app-accountgroup-form",
  templateUrl: "./accountgroup-form.component.html",
  styleUrl: "./accountgroup-form.component.css",
})
export class AccountgroupFormComponent implements OnInit, AfterViewInit {
  @Input() accountGroup?: AccountGroupModel;
  @Output() submitAccountGroup = new EventEmitter<any>();

  newAccountGroupId?: number;

  form = new FormGroup({
    id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1),
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
    shw: new FormControl<boolean>(true, [Validators.required]),
  });

  constructor(private accSrv: AccountService) {}

  ngOnInit(): void {
    this.patchForm();
  }

  patchForm(): void {
    if (this.accountGroup) {
      this.form.patchValue({
        id: this.accountGroup.id,
        dsg: this.accountGroup.dsg,
        dsc: this.accountGroup.dsc ?? "",
        rnk: this.accountGroup.rnk ?? "",
        act: this.accountGroup.act ?? true,
        shw: this.accountGroup.shw ?? true,
      });
    } else {
      id: this.getNewAccountGroupId().subscribe((id) => {
        this.newAccountGroupId = id;

        this.form.patchValue({
          id: id,
        });
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const accountGroup = {
        id: this.form.value.id,
        dsg: this.form.value.dsg,
        dsc: this.form.value.dsc,
        rnk: this.form.value.rnk,
        act: this.form.value.act,
        shw: this.form.value.shw,
      };
      this.submitAccountGroup.emit(accountGroup);
    } else {
      this.form.markAllAsTouched();
    }
  }

  // ----- E V E N T B E A R B E I T U N G -----
  ngAfterViewInit(): void {
    const modalEl = document.getElementById("accountGroupModal");

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
    this.accountGroup = undefined;
    this.newAccountGroupId = undefined;

    // Touch-Status entfernen (sonst bleibt is-invalid sichtbar)
    Object.keys(this.form.controls).forEach((key) =>
      this.form.get(key)?.markAsUntouched(),
    );
  }

  // ----- H I L F S F U N K T I O N E N -----
  private getNewAccountGroupId(): Observable<number> {
    return this.accSrv.findAllAccountGroups().pipe(
      map((groups) => {
        const usedIds = groups.map((group) => Number(group.id));

        let newId = 1;
        while (usedIds.includes(newId)) {
          newId++;
        }

        if (newId > 9) {
          throw new Error("Maximal 9 Kontengruppen erlaubt");
        }

        return newId;
      }),
    );
  }
}
