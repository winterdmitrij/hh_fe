import { AccountModel, PostModel } from "../cat/cat.model";

export interface PeriodModel {
  prd: string;
  act: boolean;
  cls: boolean;
  year: number;
  mnt: number;
  mon: string;
  doc_dat: Date;
}

export interface MonthDocumentModel {
  doc_rnk: string;
  doc_id: string;
  doc_dat: Date;
  doc_amt: number;
  doc_rls: boolean;
  cnt_pos: number;
  prd: string;
  doc_typ: string;
}

export interface DocumentModel {
  id: string;
  dat: Date;
  amt?: number;
  rls: boolean;
  positions?: PositionModel[];
}

export interface PositionModel {
  id: string;
  amt?: number;
  cmt?: string;
  doc_id: string;
  account?: AccountModel;
  post?: PostModel;
}

export interface PositionDetailModel {
  pos_id: string;
  amt_dtl?: string;
}
