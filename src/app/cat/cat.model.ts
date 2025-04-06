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
}

export interface PostModel {
  id: number;
  dsg: string;
  dsc?: string;
  rnk?: string;
  act: boolean;
  shw: boolean;
  trf: boolean;
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
}
