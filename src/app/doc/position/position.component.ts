declare var bootstrap: any;
import { Component } from "@angular/core";
//import { Modal } from "bootstrap";
import {
  DocumentModel,
  PositionDetailModel,
  PositionModel,
} from "../doc.model";
import { PositionService } from "./position.service";
import { ActivatedRoute } from "@angular/router";
import { DocumentService } from "../document/document.service";
import { catchError, Observable, of } from "rxjs";
import { log } from "console";
import { PositionDetailService } from "../position-detail/position-detail.service";

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
  docTyp?: string;

  // Variablen für Modalformen: Update und Delete
  isEditMode: boolean = false;
  modalOpen: boolean = false;
  updPosition?: PositionModel;
  delPosition?: PositionModel;
  dtlPosition?: PositionModel;

  constructor(
    private docSrv: DocumentService,
    private posSrv: PositionService,
    private posDtlSrv: PositionDetailService,
    private route: ActivatedRoute
  ) {
    // Pfad-Parameter ablesen und Dokument laden
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");

      if (id) {
        this.docId = id;
        this.docTyp = id.substring(5, 8);
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
    this.showModal("positionModal");
  }

  openDtlModal(pos: PositionModel) {
    console.log("Position-Detail geöffnen!", pos.id);
    this.dtlPosition = pos;
    this.modalOpen = true;
    this.showModal("detailModal");
  }

  openUpdModal(pos: PositionModel) {
    this.updPosition = pos;
    this.modalOpen = true;
    this.showModal("positionModal");
  }

  openDelModal(pos: PositionModel) {
    this.delPosition = pos;
    this.showModal("delPosition");
  }

  private showModal(modalId: string) {
    const modalEl = document.getElementById(modalId);

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
      this.handleRequest(this.posSrv.update(pos), "positionModal");
    } else {
      this.handleRequest(this.posSrv.create(pos), "positionModal");
    }
    console.log("Position erfolgreich gespeichert.", pos);
  }

  // Upd Position-Detail
  handleDetailSave(dtl: PositionDetailModel) {
    this.handleRequest(this.posDtlSrv.update(dtl), "detailModal");
    console.log("Position-Detail erfolgreich gespeichert.", dtl);
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
