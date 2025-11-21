export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  account_name: string;
  type: "Bank" | "Wallet" | "Credit";
  balance: number;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: "Income" | "Expense";
  description?: string;
  color?: string;
  icon?: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  total_amount: number;
  spent: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  payment_method_id: string;
  amount: number;
  transaction_type: "Income" | "Expense";
  date: string;
  description?: string;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  method_name: string;
}