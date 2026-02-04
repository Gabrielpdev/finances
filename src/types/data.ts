export interface IData {
  Data: string;
  Estabelecimento: string;
  Parcela: string;
  Portador: string;
  Valor: string;
  Tipo: string;
  Identificador: string;
}
export interface IFormattedData {
  Data: string;
  Estabelecimento: string;
  Parcela: string;
  Portador: string;
  Categoria: {
    name: string;
    icon: string;
  };
  Valor: string;
  Tipo: string;
  Identificador: string;
}
export interface ICategory {
  icon: string;
  id: string;
  list: string[];
  name: string;
}

export interface IShowedData {
  [key: string]: IFormattedData[];
}

export interface IUpdateData {
  date: string;
  product: string;
  divided: number;
}

export interface IUserContext {
  isUserAllowed: boolean;
  user: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface ICurrencyContext {
  value: {
    in: string;
    out: string;
  };
  setValue: (value: { in: string; out: string }) => void;
}

export interface ITransactionsContext {
  categories: ICategory[];
  setCategories: (categories: ICategory[]) => void;
  transactions: IFormattedData[];
  setTransactions: (transactions: IFormattedData[]) => void;
}
