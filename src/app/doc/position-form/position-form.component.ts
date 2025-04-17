import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AccountModel, PostModel } from "../../cat/cat.model";
import { AccountService } from "../../cat/account/account.service";
import { PostService } from "../../cat/post/post.service";
import { DocumentModel } from "../doc.model";

@Component({
  selector: "app-position-form",
  templateUrl: "./position-form.component.html",
  styleUrl: "./position-form.component.css",
})
export class PositionFormComponent implements OnInit {
  @Input() document?: DocumentModel;
  @Input() posId?: string;

  @Output() save = new EventEmitter<any>();

  posts: PostModel[] = [];
  accounts: AccountModel[] = [];

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accSrv: AccountService,
    private pstSrv: PostService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDropdowns();
  }

  // lädt die Konten und Posten
  loadDropdowns() {
    // ToDo: Nicht acc und pst sondern accGrp und pstGrp
    this.accSrv.findAll().subscribe((data) => (this.accounts = data));
    this.pstSrv.findAll().subscribe((data) => (this.posts = data));
  }

  initForm() {
    this.form = this.fb.group({
      id: ["", Validators.required],
      doc_id: ["", Validators.required],
      acc_id: ["", Validators.required],
      pst_id: ["", Validators.required],
      amt: [0, [Validators.required, Validators.min(0.01)]],
      cmt: ["", Validators.max(50)],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      console.log("Position absenden:", formData);
      this.save.emit(this.form.value);
      // this.form.reset();
    }
  }
}
