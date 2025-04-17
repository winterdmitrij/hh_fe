import { Component, OnInit } from "@angular/core";
import { DocumentModel, PositionModel } from "../doc.model";
import { PositionService } from "./position.service";
import { ActivatedRoute } from "@angular/router";
import { AccountModel, PostModel } from "../../cat/cat.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PostService } from "../../cat/post/post.service";
import { AccountService } from "../../cat/account/account.service";

@Component({
  selector: "app-position",
  templateUrl: "./position.component.html",
  styleUrl: "./position.component.css",
})
export class PositionComponent implements OnInit {
  document?: DocumentModel;
  docId?: string;
  posId?: string;

  addPosition?: PositionModel;
  updPosition?: PositionModel;
  delPosition?: PositionModel;

  constructor(private posSrv: PositionService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.readPath();
  }

  // liest Pfadparameter ab
  readPath(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");

      if (id) {
        this.docId = id;
        //console.log("id: ", this.docId);
        this.loadDocument(this.docId);
      }
    });
  }

  // lädt das Dokument
  loadDocument(id: string) {
    this.posSrv.findDocBy(id).subscribe((data) => {
      this.document = data;
      //console.log("Dokument: ", this.document);
    });
  }

  //?
  onAddClick() {
    const posCnt = this.document?.positions?.length;

    this.posId = this.docId + "." + posCnt + 1;
    console.log("Neuer PositionsId: ", this.posId);
  }

  handlePositionSave(position: any) {
    console.log("Neue Position:", position);
    // Speichern, API aufrufen, etc.
  }
}
