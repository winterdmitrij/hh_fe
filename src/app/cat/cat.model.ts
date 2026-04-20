export interface TransactionModel {
  id: number;
  dsg: string;
  rnk?: string;
  postgroups?: PostGroupModel[];
}

export interface PostGroupModel {
  id: number;
  dsg: string;
  dsc?: string;
  rnk?: string;
  act: boolean;
  posts?: PostModel[];
  transaction: TransactionModel;
}

export interface PostModel {
  id: number;
  dsg: string;
  dsc?: string;
  rnk?: string;
  act: boolean;
  trf: boolean;
  csh: boolean;
  postgroup: PostGroupModel;
}

export interface AccountGroupModel {
  id: number;
  dsg: string;
  dsc?: string;
  rnk?: string;
  act: boolean;
  shw: boolean;
  accounts?: AccountModel[];
}

export interface AccountModel {
  id: number;
  dsg: string;
  dsc?: string;
  rnk?: string;
  act: boolean;
  shw: boolean;
  sav: boolean;
  accountgroup: AccountGroupModel;
}

export interface InformationModel {
  typ: string;
  dsg: string;
  rnk: string;
  frq: number;
  account: AccountModel;
  transaction?: TransactionModel;
}
