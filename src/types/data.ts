import { DateRange } from "react-day-picker";

export interface IData {
  date: string;
  description: string;
  installment: string;
  holder: string;
  amount: number;
  type: string;
  id: string;
  timestamp: number;
  categoryId: string;
}
export interface IFormattedData extends IData {
  category: ICategory;
}
export interface ICategoryListItem {
  key: string;
  alias: string;
}

export interface ICategory {
  icon: string;
  id: string;
  list: ICategoryListItem[];
  name: string;
  color: string;
  goal: number;
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
  futureTransactions: IFormattedData[];
  transactions: IFormattedData[];
  setTransactions: (transactions: IFormattedData[]) => void;
  filterDate: DateRange | undefined;
  setFilterDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  refreshTransactions: (startDate?: number, endDate?: number) => Promise<void>;
  refreshCategories: () => Promise<void>;
  updateLocalData: ({
    savedData,
    savedCategories,
  }: {
    savedData?: IData[] | IFormattedData[];
    savedCategories?: ICategory[];
  }) => void;
  returnTransactionWithCategories: (
    savedData: IData[] | IFormattedData[],
    savedCategories: ICategory[],
  ) => IFormattedData[];
  getFutureTransactions: () => Promise<void>;
  updateOneTransaction: (updatedData: IData) => void;
}
