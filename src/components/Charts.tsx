import React, { useState } from 'react';
import { Transaction } from '../types/finance';
import { getCategoryExpenseBreakdown, getMonthlyHistory, formatMoney } from '../utils/formatters';
import { PieChart, BarChart3, TrendingUp, Sparkles } from 'lucide-react';

interface ChartsProps {
  transactions: Transaction[];
  currency: string;
}

export const Charts: React.FC<ChartsProps> = ({ transactions, currency }) => {
  const [donutScope, setDonutScope] = useState<'month' | 'all'>('month');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  const breakdown = getCategoryExpenseBreakdown(transactions, donutScope === 'month');
  const totalExpenseInScope = breakdown.reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyData = getMonthlyHistory(transactions, 6);
  const maxMonthlyVal = Math.max(
    ...monthlyData.map((d) => Math.max(d.income, d.expense)),
    1000
  );

  // Calculate SVG Pie/Donut slices
  let accumulatedAngle = 0;
  const radius = 68;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;

  const donutSlices = breakdown.map((item) => {
    const fraction = totalExpenseInScope > 0 ? item.amount / totalExpenseInScope : 0;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedAngle * circumference;
    accumulatedAngle += fraction;

    const isHovered = hoveredCategory === item.category;

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      isHovered,
    };
  });

  const activeCategoryDetail = breakdown.find((b) => b.category === hoveredCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Desglose de Gastos por Categoría (Donut Chart) */}
      <div className="lg:col-span-5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                  Desglose de Gastos
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Distribución por categorías
                </p>
              </div>
            </div>

            {/* Segmented Filter Control */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setDonutScope('month')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  donutScope === 'month'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Este Mes
              </button>
              <button
                type="button"
                onClick={() => setDonutScope('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  donutScope === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Histórico
              </button>
            </div>
          </div>

          {/* Donut Graphic Visualizer */}
          <div className="py-6 flex flex-col items-center justify-center relative">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-slate-100 dark:text-slate-800"
                />
                {totalExpenseInScope > 0 &&
                  donutSlices.map((slice) => (
                    <circle
                      key={slice.category}
                      cx="90"
                      cy="90"
                      r={radius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={slice.isHovered ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      className="transition-all duration-300 cursor-pointer opacity-90 hover:opacity-100"
                      onMouseEnter={() => setHoveredCategory(slice.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    />
                  ))}
              </svg>

              {/* Center Donut Info Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                {activeCategoryDetail ? (
                  <>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                      {activeCategoryDetail.category}
                    </span>
                    <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {formatMoney(activeCategoryDetail.amount, currency)}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                      {activeCategoryDetail.percentage}% del total
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Total Gastos
                    </span>
                    <span className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {formatMoney(totalExpenseInScope, currency)}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {donutScope === 'month' ? 'Periodo actual' : 'Total registrado'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Legend / Breakdown List */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {breakdown.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No hay gastos registrados en este periodo.
            </div>
          ) : (
            breakdown.map((item) => (
              <div
                key={item.category}
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`group flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  hoveredCategory === item.category
                    ? 'bg-slate-100 dark:bg-slate-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                    {item.category}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono tabular-nums">
                    ({item.percentage}%)
                  </span>
                </div>
                <span className="font-semibold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  {formatMoney(item.amount, currency)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Comparativa de Ingresos vs. Gastos (Monthly Bar Trend) */}
      <div className="lg:col-span-7 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                  Flujo de Efectivo Mensual
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comparativa de Ingresos vs. Gastos (Últimos 6 meses)
                </p>
              </div>
            </div>

            {/* Visual Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                <span>Ingresos</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/90"></span>
                <span>Gastos</span>
              </div>
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="pt-8 pb-4">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {monthlyData.map((item) => {
                const incomeHeightPct = maxMonthlyVal > 0 ? (item.income / maxMonthlyVal) * 100 : 0;
                const expenseHeightPct = maxMonthlyVal > 0 ? (item.expense / maxMonthlyVal) * 100 : 0;
                const isHovered = hoveredMonth === item.key;
                const isPositive = item.net >= 0;

                return (
                  <div
                    key={item.key}
                    onMouseEnter={() => setHoveredMonth(item.key)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  >
                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 bg-slate-900 dark:bg-slate-800 text-white rounded-lg px-2.5 py-1.5 shadow-xl text-[11px] whitespace-nowrap border border-slate-700 pointer-events-none">
                        <div className="font-semibold text-center pb-0.5 border-b border-slate-700/60 mb-1">
                          {item.label}
                        </div>
                        <div className="flex justify-between gap-3 text-emerald-400 font-mono">
                          <span>+ {formatMoney(item.income, currency)}</span>
                        </div>
                        <div className="flex justify-between gap-3 text-rose-400 font-mono">
                          <span>- {formatMoney(item.expense, currency)}</span>
                        </div>
                        <div className={`pt-0.5 font-mono font-bold ${isPositive ? 'text-emerald-300' : 'text-rose-300'}`}>
                          Neto: {isPositive ? '+' : ''}{formatMoney(item.net, currency)}
                        </div>
                      </div>
                    )}

                    {/* Bars Container */}
                    <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full pb-2">
                      {/* Income Bar */}
                      <div
                        className="w-1/2 max-w-[28px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all duration-300 group-hover:brightness-110 shadow-xs"
                        style={{ height: `${Math.max(incomeHeightPct, 4)}%` }}
                      />
                      {/* Expense Bar */}
                      <div
                        className="w-1/2 max-w-[28px] bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md transition-all duration-300 group-hover:brightness-110 shadow-xs"
                        style={{ height: `${Math.max(expenseHeightPct, 4)}%` }}
                      />
                    </div>

                    {/* Month Label */}
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider capitalize">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Metrics Banner */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 text-[11px]">Promedio Ingresos</span>
            <p className="font-semibold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
              {formatMoney(
                monthlyData.reduce((acc, m) => acc + m.income, 0) / (monthlyData.length || 1),
                currency
              )}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 text-[11px]">Promedio Gastos</span>
            <p className="font-semibold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
              {formatMoney(
                monthlyData.reduce((acc, m) => acc + m.expense, 0) / (monthlyData.length || 1),
                currency
              )}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 col-span-2 sm:col-span-1">
            <span className="text-slate-400 text-[11px]">Ahorro Semestral</span>
            <p className="font-semibold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
              +{formatMoney(
                monthlyData.reduce((acc, m) => acc + m.net, 0),
                currency
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
