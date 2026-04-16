import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { PostModel } from "../../cat.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PostService } from "../../services/post.service";
import { map, Observable } from "rxjs";

@Component({
  selector: "app-post-form",
  templateUrl: "./post-form.component.html",
  styleUrl: "./post-form.component.css",
})
export class PostFormComponent implements OnInit, AfterViewInit {
  @Input() post?: PostModel;
  @Input() postGroupId?: string;
  @Output() submitPost = new EventEmitter<any>();

  newPostId?: number;

  form = new FormGroup({
    id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(5),
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
    trf: new FormControl<boolean>(false, [Validators.required]),
    csh: new FormControl<boolean>(true, [Validators.required]),
    pg_id: new FormControl<number | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3),
    ]),
  });

  constructor(private pstSrv: PostService) {}

  ngOnInit(): void {
    this.patchForm();
  }

  patchForm() {
    if (!this.post) {
      this.getNewPostId().subscribe((id) => {
        this.newPostId = id;
        this.form.patchValue({
          id: this.newPostId,
          act: true,
          trf: false,
          csh: true,
          pg_id: Number(this.postGroupId),
        });
      });
    } else {
      this.form.patchValue({
        id: this.post.id,
        dsg: this.post.dsg,
        dsc: this.post.dsc ?? "",
        rnk: this.post.rnk,
        act: this.post.act ?? true,
        trf: this.post.trf ?? false,
        csh: this.post.csh ?? true,
        pg_id: Number(this.postGroupId),
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const post = {
        id: this.form.value.id,
        dsg: this.form.value.dsg,
        dsc: this.form.value.dsc,
        rnk: this.form.value.rnk,
        act: this.form.value.act,
        trf: this.form.value.trf,
        csh: this.form.value.csh,
        postgroup: { id: this.form.value.pg_id },
      };

      this.submitPost.emit(post);
    } else {
      this.form.markAllAsTouched();
    }
  }

  // ----- E V E N T B E A R B E I T U N G -----
  ngAfterViewInit(): void {
    const modalEl = document.getElementById("postModal");

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
    this.post = undefined;
    this.newPostId = undefined;

    // Touch-Status entfernen (sonst bleibt is-invalid sichtbar)
    Object.keys(this.form.controls).forEach((key) =>
      this.form.get(key)?.markAsUntouched(),
    );
  }

  // ----- H I L F S F U N K T I O N E N -----
  private getNewPostId(): Observable<number> {
    return this.pstSrv.findOnePostGroup(this.postGroupId!).pipe(
      map((data) => {
        const count = data.posts?.length || 0;
        const newId = +this.postGroupId! * 100 + count + 1;
        return newId;
      }),
    );
  }
}
