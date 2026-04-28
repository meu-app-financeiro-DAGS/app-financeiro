export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  time: string;
  cardId?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  number: string;
  brand: 'visa' | 'mastercard' | 'elo' | 'amex' | 'hipercard' | 'other';
  invoiceAmount: number;
  limit: number;
  dueDate: number;
  color: string;
  gradient: string;
  customImage?: string;
}

export interface Debt {
  id: string;
  name: string;
  type: 'cartao' | 'emprestimo' | 'financiamento' | 'outro';
  totalAmount: number;
  paidAmount: number;
  totalInstallments: number;
  paidInstallments: number;
  monthlyPayment: number;
  interestRate: number;
  dueDay: number;
  startDate: string;
}

export interface DailySpending {
  day: string;
  amount: number;
}

export interface MonthlyData {
  month: string;
  earnings: number;
  spending: number;
}
