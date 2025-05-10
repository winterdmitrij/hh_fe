import { Component, OnInit } from "@angular/core";
import { PeriodService } from "../period/period.service";
import { DocumentModel, PeriodModel } from "../doc.model";
import { DocumentService } from "./document.service";
import { ActivatedRoute, Params, Router } from "@angular/router";

@Component({
  selector: "app-document",
  templateUrl: "./document.component.html",
  styleUrl: "./document.component.css",
})
export class DocumentComponent implements OnInit {
  periods: PeriodModel[] = [];
  curPrd?: string;
  maxActPrd?: PeriodModel;

  documents: DocumentModel[] = [];
  rlsDocument?: DocumentModel;

  constructor(
    private prdSrv: PeriodService,
    private docSrv: DocumentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDropdowns();
  }

  // Select-List befüllen, und den letzten aktiven Period als aktuell setzen
  async loadDropdowns() {
    this.prdSrv.findAll().subscribe((prdLst) => {
      this.periods = prdLst;

      // Pfad-Parameter ablesen und Dokument laden oder verlinken
      this.route.params.subscribe((params: Params) => {
        const prd = params["prd"];

        if (prd) {
          this.curPrd = prd;
          console.log("curPrd von Pfad: ", prd);

          this.loadDocuments(prd);
        } else {
          //const maxActPrd = this.getLatestActivePeriod(prdLst);
          this.prdSrv.findCurPrd().subscribe((p) => {
            this.maxActPrd = p;

            console.log("curPrd von DB: ", this.maxActPrd);
            if (this.maxActPrd) {
              this.router.navigate([
                "/periods",
                this.maxActPrd.prd,
                "documents",
              ]);
            }
          });
        }
      });
    });
  }

  loadDocuments(prd: string) {
    this.docSrv.findAll().subscribe((data) => {
      const curDocuments = data.filter((doc) => {
        const docDate = new Date(doc.dat).toDateString();
        const prdDate = this.getDateByPrd(prd).toDateString();

        return docDate === prdDate;
      });
      this.documents = curDocuments;
    });
  }

  // Wenn Auswahl geändert → neue Route
  onSelectChange(newPrd: string) {
    //const newPrd = (event.target as HTMLSelectElement).value;
    console.log("Neues ausgew. Period: ", newPrd);

    this.router.navigate(["/periods", String(newPrd), "documents"]);
  }

  // Freigabe/Stornierung des Dokuments
  onRlsClick(document: DocumentModel) {
    this.rlsDocument = document;
  }

  onDocumentRelease(document: DocumentModel) {
    this.docSrv.update(document.id, { rls: !document.rls }).subscribe({
      next: (res) => {
        console.log("Aktualisiert: ", res);

        this.loadDocuments(this.curPrd!);
      },
      error: (err) => {
        console.log("Fehler beim Aktualisieren: ", err);
      },
    });
  }

  // Umwandelt Period (zB: 2503) ins Datum (31.03.2025)
  private getDateByPrd(prd: string): Date {
    if (!/^\d{4}$/.test(prd)) {
      throw new Error('Ungültiges Format. Erwartet JJMM, z.B. "2503"');
    }

    const year = 2000 + parseInt(prd.substring(0, 2), 10);
    const month = parseInt(prd.substring(2, 4), 10);

    // JavaScript zählt Monate ab 0 (Januar = 0), daher month = month
    // Letzter Tag des Monats: nächster Monat minus 1 Tag
    return new Date(year, month, 0); // z. B. new Date(2025, 3, 0) → 31. März 2025
  }

  // ToDo: Löschen: prdSvc.getCurPrd()
  private getLatestActivePeriod(
    periods: PeriodModel[]
  ): PeriodModel | undefined {
    return periods
      .filter((p) => p.act)
      .sort((a, b) => b.prd.localeCompare(a.prd))[0];
  }
}
