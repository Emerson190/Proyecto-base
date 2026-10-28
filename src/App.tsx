import React, { useState, useEffect } from 'react';
import {
  Transaction,
  SavingsGoal,
  SUPPORTED_CURRENCIES,
  ThemeMode,
} from './types/finance';
import {
  getStoredTransactions,
  saveTransactionsToStorage,
  getStoredGoals,
  saveGoalsToStorage,
  getStoredCurrency,
  saveCurrencyToStorage,
  getStoredTheme,
  saveThemeToStorage,
  DEMO_TRANSACTIONS,
  DEMO_SAVINGS_GOALS,
} from './data/initialData';
import { computeFinancialMetrics, formatMoney, fireGoalCelebration } from './utils/formatters';
import { Charts } from './components/Charts';
import { SavingsGoals } from './components/SavingsGoals';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { ExportModal } from './components/ExportModal';
import {
  Sparkles,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  Moon,
  Sun,
  Palette,
  FileCode,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function App() {
  // Main states
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions);
  const [goals, setGoals] = useState<SavingsGoal[]>(getStoredGoals);
  const [currency, setCurrency] = useState<string>(getStoredCurrency);
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'goals' | 'analytics'>('dashboard');

  // Modals
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  // Sync theme to <html> class
  useEffect(() => {
    saveThemeToStorage(theme);
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'theme-aura');
    if (theme === 'aura') {
      root.classList.add('dark', 'theme-aura');
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }, [theme]);

  // Save changes to localStorage
  useEffect(() => {
    saveTransactionsToStorage(transactions);
  }, [transactions]);

  useEffect(() => {
    saveGoalsToStorage(goals);
  }, [goals]);

  useEffect(() => {
    saveCurrencyToStorage(currency);
  }, [currency]);

  // Financial calculations
  const metrics = computeFinancialMetrics(transactions);

  // Handlers for Transactions
  const handleSaveTransaction = (tx: Transaction) => {
    if (editingTx) {
      setTransactions((prev) => prev.map((item) => (item.id === tx.id ? tx : item)));
      showToast('Transacción actualizada con éxito');
    } else {
      setTransactions((prev) => [tx, ...prev]);
      showToast('Nueva transacción registrada');
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
    showToast('Transacción eliminada');
  };

  // Handlers for Savings Goals
  const handleAddGoal = (goal: SavingsGoal) => {
    setGoals((prev) => [...prev, goal]);
    showToast('Meta de ahorro creada');
  };

  const handleUpdateGoal = (goal: SavingsGoal) => {
    setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
    showToast('Meta de ahorro actualizada');
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Meta eliminada');
  };

  // Demo Data Reset
  const handleLoadDemoData = () => {
    setTransactions(DEMO_TRANSACTIONS);
    setGoals(DEMO_SAVINGS_GOALS);
    saveTransactionsToStorage(DEMO_TRANSACTIONS);
    saveGoalsToStorage(DEMO_SAVINGS_GOALS);
    fireGoalCelebration();
    showToast('¡Datos de prueba cargados con éxito!');
  };

  const showToast = (msg: string) => {
    setBannerMessage(msg);
    setTimeout(() => setBannerMessage(null), 3000);
  };

  // Theme styling configurations
  const getThemeBackground = () => {
    if (theme === 'aura') {
      return 'bg-[#061118] text-slate-100';
    }
    if (theme === 'dark') {
      return 'bg-slate-950 text-slate-100';
    }
    return 'bg-slate-50 text-slate-900';
  };

  return (
    <div className={`min-h-screen ${getThemeBackground()} transition-colors duration-300 antialiased`}>
      {/* Toast Notification */}
      {bannerMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-emerald-500/40 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{bannerMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Brand Wordmark with Isotype */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-emerald-400 bg-clip-text text-transparent">
                AuraWealth
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Vista General
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('transactions')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'transactions'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Movimientos ({transactions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('goals')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'goals'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Metas & Presupuestos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'analytics'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Análisis Gráfico
            </button>
          </nav>

          {/* Zone 3: Actions & Settings */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-mono bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-emerald-500"
              title="Cambiar Moneda"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={() => {
                if (theme === 'aura') setTheme('dark');
                else if (theme === 'dark') setTheme('light');
                else setTheme('aura');
              }}
              title={`Tema actual: ${theme}. Haz clic para alternar (Aura / Oscuro / Claro)`}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'aura' ? (
                <Palette className="w-4 h-4 text-emerald-400" />
              ) : theme === 'dark' ? (
                <Moon className="w-4 h-4 text-cyan-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {/* Demo Data Button */}
            <button
              type="button"
              onClick={handleLoadDemoData}
              title="Recargar datos de prueba realistas"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Datos Demo</span>
            </button>

            {/* Single File Export Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              title="Exportar index.html autocontenido o respaldo JSON"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-500" />
              <span>index.html</span>
            </button>

            {/* Primary Action: New Transaction */}
            <button
              type="button"
              onClick={() => {
                setEditingTx(null);
                setIsAddTxOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Registro</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs Strip */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`py-1 px-2 rounded-lg ${
              activeTab === 'dashboard' ? 'bg-slate-200 dark:bg-slate-800 text-emerald-500 font-bold' : 'text-slate-500'
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={`py-1 px-2 rounded-lg ${
              activeTab === 'transactions' ? 'bg-slate-200 dark:bg-slate-800 text-emerald-500 font-bold' : 'text-slate-500'
            }`}
          >
            Movimientos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('goals')}
            className={`py-1 px-2 rounded-lg ${
              activeTab === 'goals' ? 'bg-slate-200 dark:bg-slate-800 text-emerald-500 font-bold' : 'text-slate-500'
            }`}
          >
            Metas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`py-1 px-2 rounded-lg ${
              activeTab === 'analytics' ? 'bg-slate-200 dark:bg-slate-800 text-emerald-500 font-bold' : 'text-slate-500'
            }`}
          >
            Análisis
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Header & Resumen Principal: Balance & Key Metrics */}
        <section className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all aura-glow-subtle">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                <span>Resumen Patrimonial</span>
                <span aria-hidden="true">·</span>
                <span>{metrics.currentMonthName}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono tabular-nums tracking-tight text-slate-900 dark:text-white">
                {formatMoney(metrics.totalBalance, currency)}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>Balance Neto General disponible en cuentas y fondos</span>
              </p>
            </div>

            {/* Quick Actions & Status */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setEditingTx(null);
                  setIsAddTxOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Movimiento</span>
              </button>
              <button
                type="button"
                onClick={handleLoadDemoData}
                className="px-3 py-2 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                <span>Datos de Prueba</span>
              </button>
            </div>
          </div>

          {/* 4 Key Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            {/* 1. Ingresos Totales */}
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Ingresos del Mes</span>
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                +{formatMoney(metrics.monthIncome, currency)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Total acumulado: {formatMoney(metrics.allTimeIncome, currency)}
              </p>
            </div>

            {/* 2. Gastos Totales */}
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Gastos del Mes</span>
                <div className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                -{formatMoney(metrics.monthExpense, currency)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Total salidas: {formatMoney(metrics.allTimeExpense, currency)}
              </p>
            </div>

            {/* 3. Tasa de Ahorro (%) */}
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Tasa de Ahorro</span>
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Percent className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-cyan-600 dark:text-cyan-400">
                {metrics.savingsRate}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {metrics.savingsRate >= 20 ? 'Excelente margen' : metrics.savingsRate >= 10 ? 'Margen moderado' : 'Margen ajustado'}
              </p>
            </div>

            {/* 4. Proyección Mensual */}
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Proyección Mensual</span>
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {metrics.monthlyProjection >= 0 ? '+' : ''}{formatMoney(metrics.monthlyProjection, currency)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Neto estimado al cierre de mes
              </p>
            </div>
          </div>
        </section>

        {/* 2. Visual Charts (Ingresos vs Gastos & Desglose Donut) */}
        {(activeTab === 'dashboard' || activeTab === 'analytics') && (
          <section className="space-y-4">
            <Charts transactions={transactions} currency={currency} />
          </section>
        )}

        {/* 3. Módulo de Objetivos de Ahorro & Presupuesto */}
        {(activeTab === 'dashboard' || activeTab === 'goals') && (
          <section>
            <SavingsGoals
              goals={goals}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
              transactions={transactions}
              currency={currency}
            />
          </section>
        )}

        {/* 4. Registro e Historial de Transacciones */}
        {(activeTab === 'dashboard' || activeTab === 'transactions') && (
          <section>
            <TransactionList
              transactions={transactions}
              onOpenAddModal={() => {
                setEditingTx(null);
                setIsAddTxOpen(true);
              }}
              onEditTransaction={(tx) => {
                setEditingTx(tx);
                setIsAddTxOpen(true);
              }}
              onDeleteTransaction={handleDeleteTransaction}
              currency={currency}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200/80 dark:border-slate-800/80 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">AuraWealth</span>
            <span>· Claridad Financiera & Control Patrimonial</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="hover:text-emerald-500 transition-colors"
            >
              Exportar index.html
            </button>
            <button
              type="button"
              onClick={handleLoadDemoData}
              className="hover:text-emerald-500 transition-colors"
            >
              Restaurar Datos
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TransactionModal
        isOpen={isAddTxOpen}
        onClose={() => {
          setIsAddTxOpen(false);
          setEditingTx(null);
        }}
        onSave={handleSaveTransaction}
        initialData={editingTx}
        currency={currency}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        transactions={transactions}
        goals={goals}
        currency={currency}
        onImportData={({ transactions: impTxs, goals: impGoals }) => {
          setTransactions(impTxs);
          setGoals(impGoals);
          showToast('Datos importados con éxito');
        }}
      />
    </div>
  );
}
