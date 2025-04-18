import { Component, OnInit } from "@angular/core";
import { DocumentModel, PositionModel } from "../doc.model";
import { PositionService } from "./position.service";
import { ActivatedRoute } from "@angular/router";
import { DocumentService } from "../document/document.service";
import { catchError, of } from "rxjs";

@Component({
  selector: "app-position",
  templateUrl: "./position.component.html",
  styleUrl: "./position.component.css",
})
export class PositionComponent implements OnInit {
  /* ToDo:
- Siehbarkeit der Detail-Taste bei Exp-Dokument
- Unnötige Sachen löschen
*/

  document?: DocumentModel;
  docId?: string;

  updPosition?: PositionModel;
  delPosition?: PositionModel;

  constructor(
    private docSrv: DocumentService,
    private posSrv: PositionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.readPath();
  }

  // liest Pfadparameter ab
  readPath(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");

      if (id) {
        this.docId = id;
        this.loadDocument(this.docId);
      }
    });
  }

  // lädt das Dokument
  loadDocument(id: string) {
    this.docSrv.findOne(id).subscribe((data) => {
      this.document = data;
    });
  }

  onUpdClick(position: PositionModel) {
    this.updPosition = position;
  }

  onDelClick(position: PositionModel) {
    this.delPosition = position;
  }

  // --- Events-Behandlung ---
  // Add new Position
  handlePositionSave(position: PositionModel) {
    this.posSrv.create(position).subscribe({
      next: (res) => {
        console.log("Gespeichert: ", res);

        this.readPath();
      },
      error: (err) => {
        console.log("Fehler beim Speichern: ", err);
      },
    });
  }

  // Update a Position
  handlePositionUpdate(position: PositionModel) {
    this.posSrv.update(position).subscribe({
      next: (res) => {
        console.log("Aktualisiert: ", res);

        this.readPath();
      },
      error: (err) => {
        console.log("Fehler beim Aktualisieren: ", err);
      },
    });
  }

  // Delete a Position
  handlePositionDelete(position: PositionModel) {
    this.posSrv
      .delete(position)
      .pipe(
        catchError((error) => {
          console.error("Fehler beim Löschen der Position:", error);
          alert("Position konnte nicht gelöscht werden.");
          return of(); // Leeres Observable zurückgeben, um die Kette fortzusetzen
        })
      )
      .subscribe(() => {
        console.log("Position erfolgreich gelöscht");

        this.readPath();
      });
  }
}
