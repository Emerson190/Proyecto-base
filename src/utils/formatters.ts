import confetti from 'canvas-confetti';
import { Transaction, SUPPORTED_CURRENCIES } from '../types/finance';

export const formatMoney = (amount: number, currencyCode: string = 'USD'): string => {
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  
  // Format with high typographic clarity
  const formattedNumber = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  const sign = amount < 0 ? '-' : '';
  return `${sign}${currency.symbol} ${formattedNumber}`;
};

export const formatDateSpanish = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    // Check if today or yesterday
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) return 'Hoy';
    if (isYesterday) return 'Ayer';

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export interface FinancialMetrics {
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  monthNet: number;
  savingsRate: number;
  monthlyProjection: number;
  allTimeIncome: number;
  allTimeExpense: number;
  currentMonthName: string;
}

export const computeFinancialMetrics = (transactions: Transaction[]): FinancialMetrics => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const currentDay = now.getDate();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let allTimeIncome = 0;
  let allTimeExpense = 0;
  let monthIncome = 0;
  let monthExpense = 0;

  transactions.forEach((tx) => {
    const [y, m] = tx.date.split('-').map(Number);
    const isCurrentMonth = y === currentYear && m === currentMonth + 1;

    if (tx.type === 'income') {
      allTimeIncome += tx.amount;
      if (isCurrentMonth) monthIncome += tx.amount;
    } else {
      allTimeExpense += tx.amount;
      if (isCurrentMonth) monthExpense += tx.amount;
    }
  });

  const totalBalance = allTimeIncome - allTimeExpense;
  const monthNet = monthIncome - monthExpense;
  
  // Savings rate based on current month (if no income, fallback to all time or 0)
  let savingsRate = 0;
  if (monthIncome > 0) {
    savingsRate = Math.max(0, Math.round(((monthIncome - monthExpense) / monthIncome) * 100));
  } else if (allTimeIncome > 0) {
    savingsRate = Math.max(0, Math.round(((allTimeIncome - allTimeExpense) / allTimeIncome) * 100));
  }

  // Monthly projection: pace of current savings/net by the end of the month
  // E.g., if day 15 has net +1500, projection is (1500 / 15) * 30 = 3000
  const dailyPaceNet = currentDay > 0 ? monthNet / currentDay : 0;
  const monthlyProjection = Math.round(dailyPaceNet * daysInCurrentMonth);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return {
    totalBalance,
    monthIncome,
    monthExpense,
    monthNet,
    savingsRate,
    monthlyProjection,
    allTimeIncome,
    allTimeExpense,
    currentMonthName: `${monthNames[currentMonth]} ${currentYear}`,
  };
};

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  count: number;
}

export const getCategoryExpenseBreakdown = (
  transactions: Transaction[],
  onlyCurrentMonth: boolean = false
): CategoryBreakdown[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const categoryMap = new Map<string, { amount: number; count: number }>();
  let totalExpenses = 0;

  transactions
    .filter((tx) => tx.type === 'expense')
    .filter((tx) => {
      if (!onlyCurrentMonth) return true;
      const [y, m] = tx.date.split('-').map(Number);
      return y === currentYear && m === currentMonth;
    })
    .forEach((tx) => {
      totalExpenses += tx.amount;
      const current = categoryMap.get(tx.category) || { amount: 0, count: 0 };
      categoryMap.set(tx.category, {
        amount: current.amount + tx.amount,
        count: current.count + 1,
      });
    });

  const categoryColors: Record<string, string> = {
    'Vivienda': '#0ea5e9',
    'Alimentación': '#10b981',
    'Transporte': '#f59e0b',
    'Servicios & Luz': '#6366f1',
    'Ocio & Cultura': '#ec4899',
    'Salud & Bienestar': '#14b8a6',
    'Educación & Cursos': '#8b5cf6',
    'Inversiones & Ahorro': '#059669',
    'Otros Gastos': '#64748b',
  };

  const result: CategoryBreakdown[] = [];
  categoryMap.forEach((val, cat) => {
    result.push({
      category: cat,
      amount: val.amount,
      percentage: totalExpenses > 0 ? Math.round((val.amount / totalExpenses) * 100) : 0,
      color: categoryColors[cat] || '#38bdf8',
      count: val.count,
    });
  });

  return result.sort((a, b) => b.amount - a.amount);
};

export interface MonthlyHistoryPoint {
  key: string; // YYYY-MM
  label: string; // 'Oct 26'
  income: number;
  expense: number;
  net: number;
}

export const getMonthlyHistory = (transactions: Transaction[], monthsBack: number = 6): MonthlyHistoryPoint[] => {
  const months: MonthlyHistoryPoint[] = [];
  const now = new Date();

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const key = `${y}-${m}`;
    const label = d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
    months.push({ key, label, income: 0, expense: 0, net: 0 });
  }

  transactions.forEach((tx) => {
    const monthKey = tx.date.substring(0, 7);
    const target = months.find((m) => m.key === monthKey);
    if (target) {
      if (tx.type === 'income') {
        target.income += tx.amount;
      } else {
        target.expense += tx.amount;
      }
      target.net = target.income - target.expense;
    }
  });

  return months;
};

export const fireGoalCelebration = () => {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6'],
  });
};
