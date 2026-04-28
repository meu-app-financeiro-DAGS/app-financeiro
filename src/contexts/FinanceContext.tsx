import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Transaction, CreditCard, Debt } from '../types';

interface FinanceState {
  transactions: Transaction[];
  cards: CreditCard[];
  debts: Debt[];
  totalBalance: number;
  monthlyEarnings: number;
  monthlySpending: number;
  dailyLimit: number;
  dailySpent: number;
}

type FinanceAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'REMOVE_TRANSACTION'; payload: string }
  | { type: 'ADD_CARD'; payload: CreditCard }
  | { type: 'UPDATE_CARD'; payload: CreditCard }
  | { type: 'REMOVE_CARD'; payload: string }
  | { type: 'ADD_DEBT'; payload: Debt }
  | { type: 'UPDATE_DEBT'; payload: Debt }
  | { type: 'REMOVE_DEBT'; payload: string }
  | { type: 'SET_DAILY_LIMIT'; payload: number }
  | { type: 'UPDATE_BALANCE'; payload: { totalBalance: number; monthlyEarnings: number; monthlySpending: number } }
  | { type: 'LOAD_STATE'; payload: FinanceState };

const BANK_CARD_PRESETS: Record<string, { color: string; gradient: string }> = {
  nubank: { color: '#8B5CF6', gradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%)' },
  inter: { color: '#FF6B00', gradient: 'linear-gradient(135deg, #EA580C 0%, #FF6B00 50%, #FB923C 100%)' },
  itau: { color: '#003399', gradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #60A5FA 100%)' },
  itaú: { color: '#003399', gradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #60A5FA 100%)' },
  bradesco: { color: '#CC092F', gradient: 'linear-gradient(135deg, #991B1B 0%, #DC2626 50%, #F87171 100%)' },
  santander: { color: '#EC0000', gradient: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 50%, #FCA5A5 100%)' },
  'banco do brasil': { color: '#FFCC00', gradient: 'linear-gradient(135deg, #CA8A04 0%, #EAB308 50%, #FDE047 100%)' },
  bb: { color: '#FFCC00', gradient: 'linear-gradient(135deg, #CA8A04 0%, #EAB308 50%, #FDE047 100%)' },
  caixa: { color: '#005CA9', gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #93C5FD 100%)' },
  c6: { color: '#1A1A2E', gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)' },
  'c6 bank': { color: '#1A1A2E', gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)' },
  neon: { color: '#00D4AA', gradient: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)' },
  picpay: { color: '#21C25E', gradient: 'linear-gradient(135deg, #15803D 0%, #22C55E 50%, #86EFAC 100%)' },
  next: { color: '#00E676', gradient: 'linear-gradient(135deg, #047857 0%, #10B981 50%, #6EE7B7 100%)' },
  xp: { color: '#1A1A2E', gradient: 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #374151 100%)' },
  btg: { color: '#003366', gradient: 'linear-gradient(135deg, #0C4A6E 0%, #0284C7 50%, #38BDF8 100%)' },
  original: { color: '#00A651', gradient: 'linear-gradient(135deg, #166534 0%, #22C55E 50%, #86EFAC 100%)' },
  pan: { color: '#00ADEF', gradient: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 50%, #7DD3FC 100%)' },
  will: { color: '#FFD700', gradient: 'linear-gradient(135deg, #B45309 0%, #F59E0B 50%, #FDE68A 100%)' },
  default: { color: '#3B82F6', gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #93C5FD 100%)' },
};

export function getCardPreset(name: string): { color: string; gradient: string } {
  const key = name.toLowerCase().trim();
  return BANK_CARD_PRESETS[key] || BANK_CARD_PRESETS.default;
}

const sampleTransactions: Transaction[] = [
  { id: '1', description: 'Supermercado Extra', category: 'Alimentação', amount: -287.45, type: 'expense', date: '2026-04-27', time: '14:32' },
  { id: '2', description: 'Salário', category: 'Renda', amount: 8500.00, type: 'income', date: '2026-04-25', time: '08:00' },
  { id: '3', description: 'Netflix', category: 'Entretenimento', amount: -55.90, type: 'expense', date: '2026-04-24', time: '00:00' },
  { id: '4', description: 'Uber', category: 'Transporte', amount: -32.50, type: 'expense', date: '2026-04-24', time: '19:45' },
  { id: '5', description: 'Freelance Design', category: 'Renda Extra', amount: 2200.00, type: 'income', date: '2026-04-23', time: '16:00' },
  { id: '6', description: 'Farmácia', category: 'Saúde', amount: -89.90, type: 'expense', date: '2026-04-22', time: '10:15' },
  { id: '7', description: 'Restaurante Outback', category: 'Alimentação', amount: -156.80, type: 'expense', date: '2026-04-21', time: '20:30' },
  { id: '8', description: 'Amazon - Livros', category: 'Educação', amount: -124.90, type: 'expense', date: '2026-04-20', time: '11:00' },
  { id: '9', description: 'Posto de Gasolina', category: 'Transporte', amount: -250.00, type: 'expense', date: '2026-04-19', time: '07:30' },
  { id: '10', description: 'Rendimento Poupança', category: 'Investimentos', amount: 145.32, type: 'income', date: '2026-04-18', time: '00:00' },
];

const sampleCards: CreditCard[] = [
  {
    id: '1', name: 'Nubank', number: '5412 •••• •••• 7890', brand: 'mastercard',
    invoiceAmount: 2847.50, limit: 12000, dueDate: 10,
    color: '#8B5CF6', gradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%)',
  },
  {
    id: '2', name: 'Inter', number: '4539 •••• •••• 3456', brand: 'visa',
    invoiceAmount: 1523.80, limit: 8000, dueDate: 15,
    color: '#FF6B00', gradient: 'linear-gradient(135deg, #EA580C 0%, #FF6B00 50%, #FB923C 100%)',
  },
  {
    id: '3', name: 'Itaú', number: '3782 •••• •••• 1234', brand: 'visa',
    invoiceAmount: 4210.00, limit: 15000, dueDate: 5,
    color: '#003399', gradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #60A5FA 100%)',
  },
];

const sampleDebts: Debt[] = [
  {
    id: '1', name: 'Financiamento Carro', type: 'financiamento',
    totalAmount: 45000, paidAmount: 18000, totalInstallments: 48,
    paidInstallments: 19, monthlyPayment: 1250.00, interestRate: 1.29,
    dueDay: 10, startDate: '2024-09-10',
  },
  {
    id: '2', name: 'Empréstimo Pessoal', type: 'emprestimo',
    totalAmount: 15000, paidAmount: 7500, totalInstallments: 24,
    paidInstallments: 12, monthlyPayment: 750.00, interestRate: 2.1,
    dueDay: 20, startDate: '2025-04-20',
  },
  {
    id: '3', name: 'Parcelamento iPhone', type: 'outro',
    totalAmount: 6999, paidAmount: 3499.50, totalInstallments: 12,
    paidInstallments: 6, monthlyPayment: 583.25, interestRate: 0,
    dueDay: 15, startDate: '2025-10-15',
  },
];

const initialState: FinanceState = {
  transactions: sampleTransactions,
  cards: sampleCards,
  debts: sampleDebts,
  totalBalance: 24850.32,
  monthlyEarnings: 10845.32,
  monthlySpending: 997.45,
  dailyLimit: 500,
  dailySpent: 287.45,
};

function recalculate(state: FinanceState): FinanceState {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const today = now.toISOString().split('T')[0];

  const monthTransactions = state.transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthlyEarnings = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlySpending = Math.abs(
    monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const dailySpent = Math.abs(
    state.transactions
      .filter(t => t.date === today && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  return {
    ...state,
    monthlyEarnings,
    monthlySpending,
    dailySpent,
    totalBalance: state.totalBalance,
  };
}

function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  let newState: FinanceState;

  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const tx = action.payload;
      const balanceChange = tx.type === 'income' ? tx.amount : tx.amount;
      newState = {
        ...state,
        transactions: [tx, ...state.transactions],
        totalBalance: state.totalBalance + balanceChange,
      };
      return recalculate(newState);
    }
    case 'REMOVE_TRANSACTION': {
      const tx = state.transactions.find(t => t.id === action.payload);
      if (!tx) return state;
      const reversal = tx.type === 'income' ? -tx.amount : -tx.amount;
      newState = {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
        totalBalance: state.totalBalance + reversal,
      };
      return recalculate(newState);
    }
    case 'ADD_CARD':
      return { ...state, cards: [...state.cards, action.payload] };
    case 'UPDATE_CARD':
      return {
        ...state,
        cards: state.cards.map(c => c.id === action.payload.id ? action.payload : c),
      };
    case 'REMOVE_CARD':
      return { ...state, cards: state.cards.filter(c => c.id !== action.payload) };
    case 'ADD_DEBT':
      return { ...state, debts: [...state.debts, action.payload] };
    case 'UPDATE_DEBT':
      return {
        ...state,
        debts: state.debts.map(d => d.id === action.payload.id ? action.payload : d),
      };
    case 'REMOVE_DEBT':
      return { ...state, debts: state.debts.filter(d => d.id !== action.payload) };
    case 'SET_DAILY_LIMIT':
      return { ...state, dailyLimit: action.payload };
    case 'UPDATE_BALANCE':
      return { ...state, ...action.payload };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

interface FinanceContextType {
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
  getCardPreset: (name: string) => { color: string; gradient: string };
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, initialState, (initial) => {
    try {
      const saved = localStorage.getItem('finance-data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return recalculate({ ...initial, ...parsed });
      }
    } catch (e) {
      console.error('Error loading saved data:', e);
    }
    return recalculate(initial);
  });

  useEffect(() => {
    localStorage.setItem('finance-data', JSON.stringify(state));
  }, [state]);

  return (
    <FinanceContext.Provider value={{ state, dispatch, getCardPreset }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}
