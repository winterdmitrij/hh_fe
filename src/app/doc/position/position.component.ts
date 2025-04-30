declare var bootstrap: any;
import { Component } from "@angular/core";
//import { Modal } from "bootstrap";
import { DocumentModel, PositionModel } from "../doc.model";
import { PositionService } from "./position.service";
import { ActivatedRoute } from "@angular/router";
import { DocumentService } from "../document/document.service";
import { catchError, Observable, of } from "rxjs";

@Component({
  selector: "app-position",
  templateUrl: "./position.component.html",
  styleUrl: "./position.component.css",
})
export class PositionComponent {
  /**
   * Hier werden alle Positionen des Dokuments angezeigt.
   */

  // Dokument und Id (werden von Parameter abgelesen)
  document?: DocumentModel;
  docId?: string;

  // Variablen für Modalformen: Update und Delete
  addMdlOpn: boolean = false;
  updMdlOpn: boolean = false;
  updPosition?: PositionModel;
  delPosition?: PositionModel;

  constructor(
    private docSrv: DocumentService,
    private posSrv: PositionService,
    private route: ActivatedRoute
  ) {
    // Pfad-Parameter ablesen und Dokument laden
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");

      if (id) {
        this.docId = id;
        this.loadDocument(id);
      }
    });
  }

  private loadDocument(id: string): void {
    this.docSrv.findOne(id).subscribe((data) => (this.document = data));
  }

  private refreshData(): void {
    if (this.docId) this.loadDocument(this.docId);
  }

  // Modal-Schaltflächen sind gedrückt
  onAddClick() {
    this.addMdlOpn = true;
  }

  onUpdClick(position: PositionModel) {
    this.updMdlOpn = true;
    this.updPosition = position;
  }

  onDelClick(position: PositionModel) {
    this.delPosition = position;
  }

  // --- Events-Behandlung ---
  // Add new Position
  handlePositionSave(position: PositionModel) {
    this.handleRequest(this.posSrv.create(position), "addPosition");
  }

  // Update a Position
  handlePositionUpdate(position: PositionModel) {
    this.handleRequest(this.posSrv.update(position), "updPosition");
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

        this.modalHide("delPosition");

        this.refreshData();
      });
  }

  private handleRequest(obs$: Observable<any>, modalId: string) {
    obs$.subscribe({
      next: (res) => {
        console.log("Erfolg: ", res);

        this.modalHide(modalId);
        this.refreshData();
      },
      error: (err) => {
        console.error("Fehler: ", err);
      },
    });
  }

  // Schließt Modal Dialog
  private modalHide(modalId: string) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    this.updMdlOpn = false;
    this.addMdlOpn = false;
    modal.hide();
  }

  // --- Für Template ---
  // Gibt absteigent sortierte Positionen zurück
  get sortedPositions(): PositionModel[] {
    return [...(this.document?.positions || [])].sort((a, b) =>
      b.id.localeCompare(a.id)
    );
  }

  // Gibt TRUE, wenn Positionen vorhanden sind.
  get hasPositions(): boolean {
    return (
      Array.isArray(this.document?.positions) &&
      this.document.positions.length > 0
    );
  }
}
