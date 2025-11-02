export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  registrationDate: string;
}

export interface Account {
  id: number;
  userId: number;
  accountName: string;
  type: "Bank" | "Wallet" | "Credit";
  balance: number;
  createdAt: string;
}

export interface Category {
  id: number;
  userId: number;
  name: string;
  type: "Income" | "Expense";
  description?: string;
}

export interface Budget {
  id: number;
  userId: number;
  name: string;
  totalAmount: number;
  startDate: string;
  endDate: string;
}

export interface Transaction {
  id: number;
  accountId: number;
  categoryId: number;
  paymentMethodId: number;
  amount: number;
  transactionType: "Income" | "Expense";
  date: string;
  description?: string;
}
export interface PaymentMethod {
  id: number;
  methodName: string;
}

