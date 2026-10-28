import { Transaction, SavingsGoal, DEFAULT_CATEGORIES } from '../types/finance';

const getISODateOffset = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const DEMO_TRANSACTIONS: Transaction[] = [
  // Ingresos del mes actual
  {
    id: 'tx-inc-01',
    type: 'income',
    amount: 3850,
    category: 'Salario Principal',
    description: 'Nómina Quincenal + Bono Empresa Tech',
    date: getISODateOffset(2),
    notes: 'Ingreso neto depositado en cuenta bancaria principal',
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    id: 'tx-inc-02',
    type: 'income',
    amount: 920,
    category: 'Freelance & Consultoría',
    description: 'Diseño UX/UI Sistema Financiero',
    date: getISODateOffset(7),
    notes: 'Pago de hito 2 del cliente internacional',
    createdAt: Date.now() - 7 * 86400000,
  },
  {
    id: 'tx-inc-03',
    type: 'income',
    amount: 340,
    category: 'Rendimientos / Inversiones',
    description: 'Dividendos Trimestrales ETF Global S&P 500',
    date: getISODateOffset(12),
    notes: 'Reinvertir parte en cartera indexada',
    createdAt: Date.now() - 12 * 86400000,
  },
  {
    id: 'tx-inc-04',
    type: 'income',
    amount: 3850,
    category: 'Salario Principal',
    description: 'Nómina Primer Quincena del Mes Anterior',
    date: getISODateOffset(32),
    createdAt: Date.now() - 32 * 86400000,
  },
  {
    id: 'tx-inc-05',
    type: 'income',
    amount: 650,
    category: 'Freelance & Consultoría',
    description: 'Auditoría Frontend Web & Accesibilidad',
    date: getISODateOffset(38),
    createdAt: Date.now() - 38 * 86400000,
  },
  {
    id: 'tx-inc-06',
    type: 'income',
    amount: 4100,
    category: 'Salario Principal',
    description: 'Nómina Quincenal & Rendimiento Trimestre',
    date: getISODateOffset(64),
    createdAt: Date.now() - 64 * 86400000,
  },
  {
    id: 'tx-inc-07',
    type: 'income',
    amount: 3800,
    category: 'Salario Principal',
    description: 'Nómina Mensual Base',
    date: getISODateOffset(95),
    createdAt: Date.now() - 95 * 86400000,
  },
  {
    id: 'tx-inc-08',
    type: 'income',
    amount: 3800,
    category: 'Salario Principal',
    description: 'Nómina Mensual Base',
    date: getISODateOffset(125),
    createdAt: Date.now() - 125 * 86400000,
  },

  // Gastos del mes actual
  {
    id: 'tx-exp-01',
    type: 'expense',
    amount: 950,
    category: 'Vivienda',
    description: 'Renta Apartamento & Alquiler Residencial',
    date: getISODateOffset(1),
    notes: 'Transferencia realizada con éxito al propietario',
    createdAt: Date.now() - 1 * 86400000,
  },
  {
    id: 'tx-exp-02',
    type: 'expense',
    amount: 185.50,
    category: 'Alimentación',
    description: 'Compra Mercado Semanal Orgánico & Alimentos',
    date: getISODateOffset(3),
    notes: 'Supermercado local',
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    id: 'tx-exp-03',
    type: 'expense',
    amount: 600,
    category: 'Inversiones & Ahorro',
    description: 'Aporte Automático Fondo Indexado MSCI World',
    date: getISODateOffset(4),
    notes: 'Estrategia Dollar-Cost Averaging mensual',
    createdAt: Date.now() - 4 * 86400000,
  },
  {
    id: 'tx-exp-04',
    type: 'expense',
    amount: 65,
    category: 'Transporte',
    description: 'Carga de Gasolina & Pase Transporte Público',
    date: getISODateOffset(6),
    createdAt: Date.now() - 6 * 86400000,
  },
  {
    id: 'tx-exp-05',
    type: 'expense',
    amount: 94.20,
    category: 'Servicios & Luz',
    description: 'Servicio Fibra Óptica Alta Velocidad + Energía',
    date: getISODateOffset(9),
    createdAt: Date.now() - 9 * 86400000,
  },
  {
    id: 'tx-exp-06',
    type: 'expense',
    amount: 72,
    category: 'Ocio & Cultura',
    description: 'Cena Restaurante Japonés & Noche de Cine',
    date: getISODateOffset(10),
    createdAt: Date.now() - 10 * 86400000,
  },
  {
    id: 'tx-exp-07',
    type: 'expense',
    amount: 55,
    category: 'Salud & Bienestar',
    description: 'Membresía Mensual Gimnasio & Yoga',
    date: getISODateOffset(14),
    createdAt: Date.now() - 14 * 86400000,
  },
  {
    id: 'tx-exp-08',
    type: 'expense',
    amount: 45,
    category: 'Educación & Cursos',
    description: 'Suscripción Plataforma Aprendizaje Desarrollo',
    date: getISODateOffset(18),
    createdAt: Date.now() - 18 * 86400000,
  },
  {
    id: 'tx-exp-09',
    type: 'expense',
    amount: 142.80,
    category: 'Alimentación',
    description: 'Supermercado y Despensa Familiar',
    date: getISODateOffset(21),
    createdAt: Date.now() - 21 * 86400000,
  },

  // Gastos de meses anteriores para alimentar gráficas históricas
  {
    id: 'tx-exp-10',
    type: 'expense',
    amount: 950,
    category: 'Vivienda',
    description: 'Renta Apartamento Mes Anterior',
    date: getISODateOffset(33),
    createdAt: Date.now() - 33 * 86400000,
  },
  {
    id: 'tx-exp-11',
    type: 'expense',
    amount: 480,
    category: 'Alimentación',
    description: 'Compras del Mes Anterior',
    date: getISODateOffset(37),
    createdAt: Date.now() - 37 * 86400000,
  },
  {
    id: 'tx-exp-12',
    type: 'expense',
    amount: 750,
    category: 'Inversiones & Ahorro',
    description: 'Aporte Mensual Inversión',
    date: getISODateOffset(40),
    createdAt: Date.now() - 40 * 86400000,
  },
  {
    id: 'tx-exp-13',
    type: 'expense',
    amount: 190,
    category: 'Transporte',
    description: 'Mantenimiento Preventivo Vehicular',
    date: getISODateOffset(45),
    createdAt: Date.now() - 45 * 86400000,
  },
  {
    id: 'tx-exp-14',
    type: 'expense',
    amount: 2100,
    category: 'Vivienda',
    description: 'Renta y Gastos Habituales (Mes -2)',
    date: getISODateOffset(68),
    createdAt: Date.now() - 68 * 86400000,
  },
  {
    id: 'tx-exp-15',
    type: 'expense',
    amount: 1950,
    category: 'Vivienda',
    description: 'Renta y Gastos Habituales (Mes -3)',
    date: getISODateOffset(98),
    createdAt: Date.now() - 98 * 86400000,
  },
  {
    id: 'tx-exp-16',
    type: 'expense',
    amount: 1880,
    category: 'Vivienda',
    description: 'Renta y Gastos Habituales (Mes -4)',
    date: getISODateOffset(128),
    createdAt: Date.now() - 128 * 86400000,
  },
];

export const DEMO_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-01',
    name: 'Fondo de Emergencia (6 Meses)',
    targetAmount: 12000,
    currentAmount: 9600,
    targetDate: '2026-12-31',
    category: 'Seguridad',
    color: '#10b981',
    icon: 'ShieldCheck',
    notes: 'Equivalente a 6 meses de gastos esenciales de supervivencia y vivienda.',
    createdAt: Date.now() - 90 * 86400000,
  },
  {
    id: 'goal-02',
    name: 'Viaje Cultural a Japón & Kioto',
    targetAmount: 4500,
    currentAmount: 3150,
    targetDate: '2027-04-15',
    category: 'Viajes',
    color: '#06b6d4',
    icon: 'Plane',
    notes: 'Boletos aéreos, pases de tren Shinkansen y hospedaje tradicional Ryokan.',
    createdAt: Date.now() - 60 * 86400000,
  },
  {
    id: 'goal-03',
    name: 'Cartera de Inversión Indexada',
    targetAmount: 20000,
    currentAmount: 15400,
    targetDate: '2028-01-01',
    category: 'Patrimonio',
    color: '#f59e0b',
    icon: 'TrendingUp',
    notes: 'Crecimiento compuesto a largo plazo con aportes mensuales automáticos.',
    createdAt: Date.now() - 120 * 86400000,
  },
  {
    id: 'goal-04',
    name: 'Renovación Estación de Trabajo M4',
    targetAmount: 2400,
    currentAmount: 2400,
    targetDate: '2026-11-30',
    category: 'Tecnología',
    color: '#8b5cf6',
    icon: 'Laptop',
    notes: '¡Meta alcanzada al 100%! Monitor calibrado 4K y equipo de alto rendimiento.',
    createdAt: Date.now() - 45 * 86400000,
  },
];

const STORAGE_KEYS = {
  TRANSACTIONS: 'aurawealth_transactions_v2',
  GOALS: 'aurawealth_goals_v2',
  CURRENCY: 'aurawealth_currency_v2',
  THEME: 'aurawealth_theme_v2',
};

export const getStoredTransactions = (): Transaction[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return DEMO_TRANSACTIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEMO_TRANSACTIONS;
  } catch (err) {
    console.error('Error loading transactions from localStorage:', err);
    return DEMO_TRANSACTIONS;
  }
};

export const saveTransactionsToStorage = (txs: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
  } catch (err) {
    console.error('Error saving transactions:', err);
  }
};

export const getStoredGoals = (): SavingsGoal[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) return DEMO_SAVINGS_GOALS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEMO_SAVINGS_GOALS;
  } catch (err) {
    console.error('Error loading goals:', err);
    return DEMO_SAVINGS_GOALS;
  }
};

export const saveGoalsToStorage = (goals: SavingsGoal[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (err) {
    console.error('Error saving goals:', err);
  }
};

export const getStoredCurrency = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENCY) || 'USD';
  } catch {
    return 'USD';
  }
};

export const saveCurrencyToStorage = (code: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, code);
  } catch {}
};

export const getStoredTheme = (): 'aura' | 'dark' | 'light' => {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.THEME);
    if (val === 'aura' || val === 'dark' || val === 'light') return val;
    return 'aura'; // default serene theme
  } catch {
    return 'aura';
  }
};

export const saveThemeToStorage = (theme: 'aura' | 'dark' | 'light'): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch {}
};
