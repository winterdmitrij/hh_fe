export interface MonthBalanceModel {
  prd: string;
  acc_id: number;
  acc_dsg: string;
  beg_std: number;
  inc: number;
  exp: number;
  trf: number;
  sld: number;
  end_std: number;
}

export interface TransactionDetailModel {
  prd: string;
  acc_id: number;
  ta_dsg: string;
  acc_dsg: string;
  pg_dsg: string;
  pd_dsg: string;
  amt: number;
  cmt?: string;
  doc_id: string;
}
