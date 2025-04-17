import { AccountModel, PostModel } from "../cat/cat.model";

export interface PeriodModel {
  prd: string;
  act: boolean;
  cls: boolean;
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
