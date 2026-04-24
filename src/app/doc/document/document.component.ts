import { Component, OnInit } from "@angular/core";
import { PeriodService } from "../services/period.service";
import { DocumentModel, MonthDocumentModel, PeriodModel } from "../doc.model";
import { DocumentService } from "./document.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { MonthDocumentService } from "../services/month-document.service";

@Component({
  selector: "app-document",
  templateUrl: "./document.component.html",
  styleUrl: "./document.component.css",
})
export class DocumentComponent implements OnInit {
  periods: PeriodModel[] = [];
  curPrd?: string;

  documents: MonthDocumentModel[] = [];
  rlsDocument?: DocumentModel;

  constructor(
    private prdSrv: PeriodService,
    private mntDocSrv: MonthDocumentService,
    private docSrv: DocumentService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDropdowns();
  }

  // Select-List befüllen, und den letzten aktiven Period als aktuell setzen
  async loadDropdowns(): Promise<void> {
    this.prdSrv.findAll().subscribe((data) => {
      this.periods = data;

      // Pfad-Parameter ablesen und Dokument laden oder verlinken
      this.route.params.subscribe((params: Params) => {
        const prd = params["prd"];

        if (prd) {
          this.curPrd = prd;
          this.loadDocuments(prd);
        } else {
          this.prdSrv.findCurPrd().subscribe((period) => {
            if (period) {
              this.router.navigate(["/doc/periods", period.prd, "documents"]);
            }
          });
        }
      });
    });
  }

  loadDocuments(prd: string): void {
    this.mntDocSrv.findAllBy(prd).subscribe((data) => {
      this.documents = data;
    });
  }

  // Wenn Auswahl geändert → neue Route
  onSelectChange(newPrd: string): void {
    this.router.navigate(["/doc/periods", String(newPrd), "documents"]);
  }

  // Freigabe/Stornierung des Dokuments
  onRlsClick(docId: string): void {
    this.docSrv.findOne(docId).subscribe((data) => {
      if (data) {
        this.rlsDocument = data;
      }
    });
  }

  onDocumentRelease(document: DocumentModel): void {
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
}
