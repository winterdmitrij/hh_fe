declare var bootstrap: any;
import { Component, OnInit } from "@angular/core";
import { PeriodService } from "../services/period.service";
import { DocumentModel, MonthDocumentModel, PeriodModel } from "../doc.model";
import { DocumentService } from "../services/document.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { catchError, EMPTY, switchMap, tap } from "rxjs";

@Component({
  selector: "app-document",
  templateUrl: "./document.component.html",
  styleUrl: "./document.component.css",
})
export class DocumentComponent implements OnInit {
  periods: PeriodModel[] = [];
  curPeriod?: string;

  documents: MonthDocumentModel[] = [];

  isModalOpen: boolean = false;
  rlsDocument?: DocumentModel;

  constructor(
    private prdSrv: PeriodService,
    private docSrv: DocumentService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const prd = params["prd"];

      if (prd) {
        this.loadData(prd);
      } else {
        this.redirectToCurrentPeriod();
      }
    });
  }

  private loadData(prd: string) {
    this.curPeriod = prd;

    this.prdSrv
      .findAllPeriods()
      .pipe(
        tap((periods) => (this.periods = periods)),
        switchMap(() => this.docSrv.findAllDocumentsBy(prd)),
      )
      .subscribe((documents) => (this.documents = documents));
  }

  // ----- C L I C K E V E N T S -----
  onChangeSelectPeriod(prd: string): void {
    this.redirectTo(prd);
  }

  //ToDo: testen
  onClickModalRelease(docId: string): void {
    this.docSrv
      .findOneDocument(docId)
      .pipe(
        tap((document) => {
          this.rlsDocument = document;

          this.showModal("rlsDocumentModal");
        }),
      )
      .subscribe();
  }

  onClickCloseModal(modalId: string): void {
    this.hideModal(modalId);
  }

  // ------ M O D A L E V E N T S -----
  handleDocumentRelease(document: DocumentModel): void {
    this.docSrv
      .updateDocument(document.id, { rls: !document.rls })
      .pipe(
        catchError((err) => {
          console.error("Fehler: ", err);
          return EMPTY; //! wichtig: stoppt next()
        }),
      )
      .subscribe((res) => {
        console.log("Erfolg: ", res);

        this.hideModal("rlsDocumentModal");
      });
  }

  // ----- M O D A L S -----
  private showModal(modalId: string): void {
    const modalEl = document.getElementById(modalId);

    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      this.isModalOpen = true;
      modal.show();
    }
  }

  private hideModal(modalId: string): void {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    this.rlsDocument = undefined;
    this.isModalOpen = false;
    modal.hide();

    if (this.curPeriod) {
      this.loadData(this.curPeriod);
    } else {
      this.redirectToCurrentPeriod();
    }
  }

  // ----- N A V I G A T I O N -----
  private redirectToCurrentPeriod(): void {
    this.prdSrv
      .findCurrentPeriod()
      .pipe(
        tap((period) => {
          if (!period) return;

          this.redirectTo(String(period.prd));
        }),
      )
      .subscribe();
  }

  private redirectTo(prd: string): void {
    this.router.navigate(["/doc", "periods", prd, "documents"]);
  }
}
