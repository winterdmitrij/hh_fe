declare var bootstrap: any;
import { Component, OnInit } from "@angular/core";
import {
  DocumentModel,
  PositionDetailModel,
  PositionModel,
} from "../doc.model";
import { PositionService } from "../services/position.service";
import { ActivatedRoute, Params } from "@angular/router";
import { DocumentService } from "../services/document.service";
import { catchError, EMPTY, Observable, of, tap } from "rxjs";
import { PositionDetailService } from "../services/position-detail.service";

export enum ModalId {
  ADD_UPD = "positionModal",
  DETAIL = "positionDetailModal",
  DELETE = "delPositionModal",
}

@Component({
  selector: "app-position",
  templateUrl: "./position.component.html",
  styleUrl: "./position.component.css",
})
export class PositionComponent implements OnInit {
  title: string = "Dokument Nr.";
  modalId = ModalId;

  document!: DocumentModel;
  positions: PositionModel[] = [];

  isEditMode: boolean = false;
  isModalOpen: boolean = false;
  //  isModalOpen: boolean = false;
  isExpendDocument: boolean = false;
  updPosition?: PositionModel;
  delPosition?: PositionModel;
  dtlPosition?: PositionModel;

  constructor(
    private docSrv: DocumentService,
    private posSrv: PositionService,
    private posDtlSrv: PositionDetailService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const docId = params["docid"];

      if (docId) {
        this.loadData(docId);
      }
    });
  }

  private loadData(docId: string): void {
    this.isExpendDocument = docId.substring(5, 8) === "Exp";

    this.docSrv
      .findOneDocument(docId)
      .pipe(
        tap((document) => {
          this.document = document;

          if (document.positions) {
            this.positions = document.positions;
          }
        }),
      )
      .subscribe();
  }

  //----- C L I C K - E V E N T S -----
  onClickModalCreate(): void {
    this.isEditMode = false;
    this.showModal(this.modalId.ADD_UPD);
  }

  onClickModalUpdate(position: PositionModel): void {
    this.updPosition = { ...position }; //! wichtig
    this.isEditMode = true;
    this.showModal(this.modalId.ADD_UPD);
  }

  onClickModalDetail(position: PositionModel): void {
    this.dtlPosition = position;
    this.showModal(this.modalId.DETAIL);
  }

  onClickModalDelete(position: PositionModel): void {
    this.delPosition = position;
    this.showModal(this.modalId.DELETE);
  }

  onClickCloseModal(modalId: string): void {
    this.hideModal(modalId);
  }

  // ----- M O D A L E V E N T S - B E H A N D L U N G -----
  handlePositionSave(position: PositionModel) {
    if (this.updPosition) {
      this.handleRequest(
        this.posSrv.updatePosition(position.id, position),
        this.modalId.ADD_UPD,
      );
    } else {
      this.handleRequest(
        this.posSrv.createPosition(position),
        this.modalId.ADD_UPD,
      );
    }
  }

  handlePositionDetailSave(event: {
    positionDetail: PositionDetailModel;
    mode: "create" | "update";
  }) {
    console.log("PositionDetail: ", event.positionDetail);
    if (event.mode === "update") {
      this.handleRequest(
        this.posDtlSrv.updatePositionDetail(
          event.positionDetail.pos_id,
          event.positionDetail,
        ),
        this.modalId.DETAIL,
      );
    } else {
      this.handleRequest(
        this.posDtlSrv.createNewPositionDetail(event.positionDetail),
        this.modalId.DETAIL,
      );
    }
  }

  handlePositionDelete(position: PositionModel) {
    this.handleRequest(
      this.posSrv.deletePosition(position),
      this.modalId.DELETE,
    );
  }

  private handleRequest(obs$: Observable<any>, modalId: string) {
    obs$
      .pipe(
        catchError((err) => {
          console.error("Fehler: ", err);
          return EMPTY; //! wichtig: stoppt next()
        }),
      )
      .subscribe((res) => {
        console.log("Erfolg: ", res);

        this.hideModal(modalId);
      });
  }

  // ----- M O D A L S -----
  private showModal(modalId: string) {
    const modalEl = document.getElementById(modalId);

    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      this.isModalOpen = true;
      modal.show();
    }
  }

  private hideModal(modalId: string) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    this.updPosition = undefined;
    this.delPosition = undefined;
    this.dtlPosition = undefined;
    this.isEditMode = false;
    this.isModalOpen = false;
    modal.hide();

    if (this.document) {
      this.loadData(this.document.id);
    }
  }
}
