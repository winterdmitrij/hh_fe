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
  document!: DocumentModel;
  docId?: string;

  // Variablen für Modalformen: Update und Delete
  isEditMode: boolean = false;
  modalOpen: boolean = false;
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
  openAddModal() {
    this.updPosition = undefined;
    this.modalOpen = true;
    this.showModal();
  }

  openUpdModal(pos: PositionModel) {
    this.updPosition = pos;
    this.modalOpen = true;
    this.showModal();
  }

  openDelModal(pos: PositionModel) {
    this.delPosition = pos;
  }

  private showModal() {
    const modalEl = document.getElementById("positionModal");

    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  onModalClosed(modalId: string) {
    this.modalHide(modalId);
  }

  // --- Events-Behandlung ---
  // Add or Upd Position
  handlePositionSave(pos: PositionModel) {
    if (this.updPosition) {
      this.handleRequest(this.posSrv.update(pos));
    } else {
      this.handleRequest(this.posSrv.create(pos));
    }
    console.log("Position erfolgreich gespeichert.");
  }

  // Delete a Position
  handlePositionDelete(pos: PositionModel) {
    this.posSrv
      .delete(pos)
      .pipe(
        catchError((error) => {
          console.error("Fehler beim Löschen der Position:", error);
          alert("Position konnte nicht gelöscht werden.");
          return of(); // Leeres Observable zurückgeben, um die Kette fortzusetzen
        })
      )
      .subscribe(() => {
        console.log("Position erfolgreich gelöscht.");

        this.modalHide("delPosition");

        this.refreshData();
      });
  }

  private handleRequest(obs$: Observable<any>) {
    obs$.subscribe({
      next: (res) => {
        console.log("Erfolg: ", res);

        this.modalHide("positionModal");
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
    this.updPosition = undefined;
    this.delPosition = undefined;
    this.modalOpen = false;
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
