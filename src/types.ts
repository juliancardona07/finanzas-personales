
export type ExpenseType = 'Fijo' | 'Variable';
export type ExpenseCategory = 'Individual' | 'Compartido';

export interface Expense {
  id: string;
  name: string;
  type: ExpenseType;
  category: ExpenseCategory;
  amount: number;
  month: number;
  year: number;
}

export interface AccountBalance {
  id: string;
  accountName: string;
  balance: number;
  month: number;
  year: number;
}

export interface ETFInvestment {
  id: string;
  etfName: string;
  amountUsd: number;
  amountCop: number;
  exchangeRate: number;
  month: number;
  year: number;
  date: string;
}

export interface AppData {
  expenses: Expense[];
  balances: AccountBalance[];
  investments: ETFInvestment[];
}

export type View = 'dashboard' | 'expenses' | 'wealth' | 'investments' | 'ai';
