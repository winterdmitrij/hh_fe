export interface AccountBalanceModel {
  year: number;
  acc_id: number;
  acc_dsg: string;
  jan: number;
  feb: number;
  mrz: number;
  apr: number;
  mai: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  okt: number;
  nov: number;
  dez: number;
}

export interface PostBalanceModel {
  year: number;
  pst_id: number;
  pst_dsg: string;
  jan: number;
  feb: number;
  mrz: number;
  apr: number;
  mai: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  okt: number;
  nov: number;
  dez: number;
  pro_year: number;
  pro_mnt: number;
}
