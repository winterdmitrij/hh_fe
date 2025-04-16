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
  periods: PeriodModel[] = [];
  curPrd?: string;

  documents: DocumentModel[] = [];

  constructor(private prdSrv: PeriodService, private docSrv: DocumentService) {}

  ngOnInit(): void {
    this.loadPeriods();
  }

  loadPeriods() {
    this.prdSrv.findAll().subscribe((data) => {
      this.periods = data;

      // selected suchen
      const actPeriods = this.periods
        .filter((p) => p.act)
        .sort((a, b) => b.prd.localeCompare(a.prd));

      if (actPeriods.length > 0) {
        this.curPrd = actPeriods[0].prd;
        this.loadDocuments();
      }
    });
  }

  loadDocuments() {
    this.docSrv.findAll().subscribe((data) => {
      const curDocuments = data.filter((d) => {
        const docDate = new Date(d.dat).toDateString();
        const prdDate = this.getDateByPrd(this.curPrd!).toDateString();

        return docDate === prdDate;
      });
      this.documents = curDocuments;
      console.log("Dokuments: ", this.documents.length);
    });
  }

  // Select list changed
  onSelectChange(prd: string) {
    this.curPrd = prd;
    this.loadDocuments();
  }

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
