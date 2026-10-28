export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string YYYY-MM-DD
  notes?: string;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  budgetMonthly?: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  category: string;
  color: string;
  icon: string;
  notes?: string;
  createdAt: number;
}

export type ThemeMode = 'aura' | 'dark' | 'light';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'Dólar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'MXN', symbol: '$', name: 'Peso Mex (MXN)' },
  { code: 'COP', symbol: '$', name: 'Peso Col (COP)' },
  { code: 'ARS', symbol: '$', name: 'Peso Arg (ARS)' },
  { code: 'CLP', symbol: '$', name: 'Peso Chil (CLP)' },
  { code: 'PEN', symbol: 'S/', name: 'Sol Peruano (PEN)' },
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'vivienda', name: 'Vivienda', type: 'expense', color: '#0ea5e9', icon: 'Home', budgetMonthly: 1200 },
  { id: 'alimentacion', name: 'Alimentación', type: 'expense', color: '#10b981', icon: 'Utensils', budgetMonthly: 550 },
  { id: 'transporte', name: 'Transporte', type: 'expense', color: '#f59e0b', icon: 'Car', budgetMonthly: 220 },
  { id: 'servicios', name: 'Servicios & Luz', type: 'expense', color: '#6366f1', icon: 'Zap', budgetMonthly: 180 },
  { id: 'ocio', name: 'Ocio & Cultura', type: 'expense', color: '#ec4899', icon: 'Film', budgetMonthly: 250 },
  { id: 'salud', name: 'Salud & Bienestar', type: 'expense', color: '#14b8a6', icon: 'HeartPulse', budgetMonthly: 160 },
  { id: 'educacion', name: 'Educación & Cursos', type: 'expense', color: '#8b5cf6', icon: 'GraduationCap', budgetMonthly: 120 },
  { id: 'inversiones', name: 'Inversiones & Ahorro', type: 'expense', color: '#059669', icon: 'TrendingUp', budgetMonthly: 800 },
  { id: 'otros_gastos', name: 'Otros Gastos', type: 'expense', color: '#64748b', icon: 'MoreHorizontal', budgetMonthly: 150 },

  // Ingresos
  { id: 'salario', name: 'Salario Principal', type: 'income', color: '#10b981', icon: 'Briefcase' },
  { id: 'freelance', name: 'Freelance & Consultoría', type: 'income', color: '#06b6d4', icon: 'Laptop' },
  { id: 'dividendos', name: 'Rendimientos / Inversiones', type: 'income', color: '#eab308', icon: 'Coins' },
  { id: 'otros_ingresos', name: 'Otros Ingresos', type: 'income', color: '#84cc16', icon: 'Wallet' },
];
