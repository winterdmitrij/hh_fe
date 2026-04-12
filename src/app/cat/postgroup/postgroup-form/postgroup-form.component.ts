import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { PostGroupModel } from "../../cat.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PostService } from "../../services/post.service";
import { map, Observable } from "rxjs";

@Component({
  selector: "app-postgroup-form",
  templateUrl: "./postgroup-form.component.html",
  styleUrl: "./postgroup-form.component.css",
})
export class PostgroupFormComponent implements OnInit, AfterViewInit {
  @Input() postGroup?: PostGroupModel;
  @Input() transactionId?: string;
  @Output() submitPostGroup = new EventEmitter<any>();

  newPostGroupId?: number;

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
    ta_id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1),
    ]),
  });

  constructor(private pstSrv: PostService) {}

  ngOnInit(): void {
    this.patchForm();
  }

  patchForm(): void {
    if (!this.postGroup) {
      this.getNewPostGroupId().subscribe((id) => {
        this.newPostGroupId = id;
        this.form.patchValue({
          id: this.newPostGroupId,
          ta_id: Number(this.transactionId),
        });
      });
    } else {
      this.form.patchValue({
        id: this.postGroup.id,
        dsg: this.postGroup.dsg,
        dsc: this.postGroup.dsc ?? "",
        rnk: this.postGroup.rnk,
        act: this.postGroup.act ?? true,
        ta_id: Number(this.transactionId),
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const postGroup = {
        id: this.form.value.id,
        dsg: this.form.value.dsg,
        dsc: this.form.value.dsc,
        rnk: this.form.value.rnk,
        act: this.form.value.act,
        transaction: { id: this.form.value.ta_id },
      };

      this.submitPostGroup.emit(postGroup);
    } else {
      this.form.markAllAsTouched();
    }
  }

  // ----- E V E N T B E A R B E I T U N G -----
  ngAfterViewInit(): void {
    const modalEl = document.getElementById("postGroupModal");

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
    this.postGroup = undefined;
    this.newPostGroupId = undefined;

    // Touch-Status entfernen (sonst bleibt is-invalid sichtbar)
    Object.keys(this.form.controls).forEach((key) =>
      this.form.get(key)?.markAsUntouched(),
    );
  }

  // ----- H I L F S F U N K T I O N E N -----
  private getNewPostGroupId(): Observable<number> {
    return this.pstSrv.findOneTransaction(this.transactionId!).pipe(
      map((data) => {
        const count = data.postgroups?.length || 0;
        const newId = +this.transactionId! * 100 + count + 1;
        return newId;
      }),
    );
  }
}
