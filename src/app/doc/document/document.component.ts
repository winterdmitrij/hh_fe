import { Component, OnInit } from "@angular/core";
import { PeriodService } from "../period/period.service";
import { DocumentModel, PeriodModel } from "../doc.model";
import { DocumentService } from "./document.service";

@Component({
  selector: "app-document",
  templateUrl: "./document.component.html",
  styleUrl: "./document.component.css",
})
export class DocumentComponent implements OnInit {
  /* ToDo:
- Period festhalten:
-- Wenn ich zu einem Dokument von einem geschloßenen Period navigiert wurde,
-- beim Zurückgehen wird es automatisch den letzten aktiven Period eingeschaltet.
*/

  periods: PeriodModel[] = [];
  curPrd?: string;

  documents: DocumentModel[] = [];
  rlsDocument?: DocumentModel;
  //  cncDocument?: DocumentModel;

  constructor(private prdSrv: PeriodService, private docSrv: DocumentService) {}

  ngOnInit(): void {
    this.loadDropdowns();
  }

  // Select-List befüllen, und den letzten aktiven Period als aktuell setzen
  loadDropdowns() {
    this.prdSrv.findAll().subscribe((data) => {
      this.periods = data;

      // Alle aktive Periode suchen und absteigend sortieren
      const actPeriods = this.periods
        .filter((p) => p.act)
        .sort((a, b) => b.prd.localeCompare(a.prd));

      if (actPeriods.length > 0) {
        // erste Element des Period-Arrays ist aktuell
        this.curPrd = actPeriods[0].prd;
        this.loadDocuments();
      }
    });
  }

  loadDocuments() {
    this.docSrv.findAll().subscribe((data) => {
      const curDocuments = data.filter((doc) => {
        const docDate = new Date(doc.dat).toDateString();
        const prdDate = this.getDateByPrd(this.curPrd!).toDateString();

        return docDate === prdDate;
      });
      this.documents = curDocuments;
    });
  }

  // wenn Wert der Select-Liste geändert ist
  onSelectChange(prd: string) {
    this.curPrd = prd;
    this.loadDocuments();
  }

  // Freigabe/Stornierung des Dokuments
  onRlsClick(document: DocumentModel) {
    this.rlsDocument = document;
  }

  onDocumentRelease(document: DocumentModel) {
    this.docSrv.update(document.id, { rls: !document.rls }).subscribe({
      next: (res) => {
        console.log("Aktualisiert: ", res);

        this.loadDocuments();
      },
      error: (err) => {
        console.log("Fehler beim Aktualisieren: ", err);
      },
    });
  }

  // Umwandelt Period (zB: 2503) ins Datum (31.03.2025)
  getDateByPrd(prd: string): Date {
    if (!/^\d{4}$/.test(prd)) {
      throw new Error('Ungültiges Format. Erwartet JJMM, z.B. "2503"');
    }

    const year = 2000 + parseInt(prd.substring(0, 2), 10);
    const month = parseInt(prd.substring(2, 4), 10);

    // JavaScript zählt Monate ab 0 (Januar = 0), daher month = month
    // Letzter Tag des Monats: nächster Monat minus 1 Tag
    return new Date(year, month, 0); // z. B. new Date(2025, 3, 0) → 31. März 2025
  }
}
