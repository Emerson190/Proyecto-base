import React, { useState } from 'react';
import { SavingsGoal, Transaction, DEFAULT_CATEGORIES } from '../types/finance';
import { formatMoney, formatDateSpanish, fireGoalCelebration } from '../utils/formatters';
import { Target, Plus, CheckCircle2, TrendingUp, Sparkles, AlertCircle, Trash2, ArrowUpRight } from 'lucide-react';

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: SavingsGoal) => void;
  onUpdateGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (id: string) => void;
  transactions: Transaction[];
  currency: string;
}

export const SavingsGoals: React.FC<SavingsGoalsProps> = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  transactions,
  currency,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('');

  // Form states for new goal
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Seguridad');
  const [color, setColor] = useState('#10b981');
  const [notes, setNotes] = useState('');

  // Calculate current month's spending by category for budget monitoring
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const currentMonthExpensesByCategory: Record<string, number> = {};
  transactions
    .filter((tx) => tx.type === 'expense')
    .filter((tx) => {
      const [y, m] = tx.date.split('-').map(Number);
      return y === currentYear && m === currentMonth;
    })
    .forEach((tx) => {
      currentMonthExpensesByCategory[tx.category] =
        (currentMonthExpensesByCategory[tx.category] || 0) + tx.amount;
    });

  const budgetedCategories = DEFAULT_CATEGORIES.filter(
    (c) => c.type === 'expense' && c.budgetMonthly && c.budgetMonthly > 0
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return;

    const newGoal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      name: name.trim(),
      targetAmount: parseFloat(targetAmount) || 0,
      currentAmount: parseFloat(currentAmount) || 0,
      targetDate: targetDate || undefined,
      category,
      color,
      icon: 'Target',
      notes: notes.trim() || undefined,
      createdAt: Date.now(),
    };

    onAddGoal(newGoal);
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setTargetDate('');
    setNotes('');
    setIsCreateOpen(false);

    if (newGoal.currentAmount >= newGoal.targetAmount && newGoal.targetAmount > 0) {
      fireGoalCelebration();
    }
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalForDeposit) return;

    const amountToAdd = parseFloat(depositAmount);
    if (isNaN(amountToAdd) || amountToAdd <= 0) return;

    const updatedAmount = selectedGoalForDeposit.currentAmount + amountToAdd;
    const wasCompleted = selectedGoalForDeposit.currentAmount >= selectedGoalForDeposit.targetAmount;
    const isNowCompleted = updatedAmount >= selectedGoalForDeposit.targetAmount;

    onUpdateGoal({
      ...selectedGoalForDeposit,
      currentAmount: updatedAmount,
    });

    if (!wasCompleted && isNowCompleted) {
      fireGoalCelebration();
    }

    setDepositAmount('');
    setSelectedGoalForDeposit(null);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Metas de Ahorro & Patrimonio
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualiza el progreso hacia tus objetivos financieros y fondos de reserva
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nueva Meta de Ahorro
        </button>
      </div>

      {/* 2. Grid de Metas de Ahorro */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {goals.map((goal) => {
          const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
          const clampedProgress = Math.min(Math.round(progress), 100);
          const isCompleted = goal.currentAmount >= goal.targetAmount;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div
              key={goal.id}
              className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: goal.color }}
                    />
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {goal.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completada
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onDeleteGoal(goal.id)}
                      title="Eliminar meta"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {goal.name}
                </h3>
                {goal.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {goal.notes}
                  </p>
                )}

                {/* Amount Progress Metrics */}
                <div className="mt-4 flex items-baseline justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-400">Acumulado</span>
                    <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {formatMoney(goal.currentAmount, currency)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-slate-400">Objetivo</span>
                    <span className="text-xs font-semibold font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {formatMoney(goal.targetAmount, currency)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${clampedProgress}%`,
                      backgroundColor: goal.color,
                    }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-semibold font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {clampedProgress}% completado
                  </span>
                  <span className="text-slate-400 font-mono tabular-nums">
                    {remaining > 0 ? `Faltan ${formatMoney(remaining, currency)}` : '¡Completado!'}
                  </span>
                </div>
              </div>

              {/* Quick Deposit Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGoalForDeposit(goal);
                    setDepositAmount('100');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Abonar a esta meta</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Módulo de Presupuestos Mensuales por Categoría */}
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                Control de Presupuesto Mensual por Categoría
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Límites asignados para el mes en curso y margen disponible
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgetedCategories.map((cat) => {
            const spent = currentMonthExpensesByCategory[cat.name] || 0;
            const budget = cat.budgetMonthly || 1;
            const pct = Math.round((spent / budget) * 100);
            const isExceeded = spent > budget;
            const isWarning = pct >= 80 && !isExceeded;

            return (
              <div
                key={cat.id}
                className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {cat.name}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      isExceeded
                        ? 'text-rose-600 dark:text-rose-400'
                        : isWarning
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {pct}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs mb-2">
                  <span className="font-mono tabular-nums text-slate-900 dark:text-white font-medium">
                    {formatMoney(spent, currency)}
                  </span>
                  <span className="text-slate-400 font-mono tabular-nums text-[11px]">
                    de {formatMoney(budget, currency)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isExceeded
                        ? 'bg-rose-500'
                        : isWarning
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                {isExceeded && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    <span>Excedido por {formatMoney(spent - budget, currency)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal para Crear Nueva Meta */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Nueva Meta de Ahorro
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Define tu objetivo, monto deseado y asignación inicial
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Objetivo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Fondo para Maestría, Vacaciones..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monto Objetivo ({currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="5000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ahorro Inicial ({currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  >
                    <option value="Seguridad">Seguridad / Emergencia</option>
                    <option value="Viajes">Viajes & Experiencias</option>
                    <option value="Patrimonio">Patrimonio & Inversión</option>
                    <option value="Tecnología">Tecnología & Herramientas</option>
                    <option value="Vivienda">Vivienda & Reformas</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha Objetivo (Opcional)
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Acento Visual
                </label>
                <div className="flex items-center gap-2">
                  {['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notas adicionales
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre por qué es importante este objetivo..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-sm"
                >
                  Guardar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Abonar a una Meta */}
      {selectedGoalForDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Abonar a {selectedGoalForDeposit.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Añade fondos a tu meta para acelerar su cumplimiento
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Monto a Depositar ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  autoFocus
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900 dark:text-white"
                />
              </div>

              {/* Botones de Monto Rápido */}
              <div className="flex items-center gap-2">
                {[50, 100, 250, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt.toString())}
                    className="flex-1 py-1.5 text-xs font-mono rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    +{amt}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGoalForDeposit(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-sm"
                >
                  Confirmar Abono
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
