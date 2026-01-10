export interface IData {
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
  [key: string]: IData[];
}

export interface IUpdateData {
  date: string;
  product: string;
  divided: number;
}

export interface IUserContext {
  user: any;
}

export interface ICurrencyContext {
  value: {
    in: string;
    out: string;
  };
  setValue: (value: { in: string; out: string }) => void;
}
