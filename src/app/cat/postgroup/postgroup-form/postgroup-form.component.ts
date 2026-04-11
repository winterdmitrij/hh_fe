import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PostGroupModel } from "../../cat.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PostService } from "../../services/post.service";

@Component({
  selector: "app-postgroup-form",
  templateUrl: "./postgroup-form.component.html",
  styleUrl: "./postgroup-form.component.css",
})
export class PostgroupFormComponent implements OnInit {
  @Input() postGroup?: PostGroupModel;
  @Output() submitPostGroup = new EventEmitter<any>();

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
  });

  constructor(private pstSrv: PostService) {}

  ngOnInit(): void {
    this.patchForm();
  }

  patchForm(): void {
    // Für neue Postgruppe
    if (!this.postGroup) {
      this.form.patchValue({
        /*
        id: this.postGroup!.id ?? null,
        dsg: this.postGroup!.dsg,
        dsc: this.postGroup!.dsc ?? "",
        rnk: this.postGroup!.rnk,
        act: this.postGroup!.act ?? true,
*/
      });
    } else {
      this.form.patchValue({
        id: this.postGroup!.id,
        dsg: this.postGroup!.dsg,
        dsc: this.postGroup!.dsc ?? "",
        rnk: this.postGroup!.rnk,
        act: this.postGroup!.act ?? true,
      });
    }
    console.log("PostGruppe: ", this.postGroup?.id ?? "keine");
  }

  onSubmit() {
    if (this.form.valid) {
      const postGroup = {
        id: this.form.value.id,
        dsg: this.form.value.dsg,
        dsc: this.form.value.dsc,
        rnk: this.form.value.rnk,
        act: this.form.value.act,
      };

      this.submitPostGroup.emit(postGroup);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
