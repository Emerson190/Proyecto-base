import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, DEFAULT_CATEGORIES } from '../types/finance';
import { formatMoney, formatDateSpanish } from '../utils/formatters';
import {
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Trash2,
  Download,
  Home,
  Utensils,
  Car,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  TrendingUp,
  Briefcase,
  Laptop,
  Coins,
  Wallet,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  currency: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
  currency,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Icon mapping for categories
  const getCategoryIcon = (categoryName: string, type: TransactionType) => {
    switch (categoryName) {
      case 'Vivienda':
        return <Home className="w-4 h-4 text-sky-500" />;
      case 'Alimentación':
        return <Utensils className="w-4 h-4 text-emerald-500" />;
      case 'Transporte':
        return <Car className="w-4 h-4 text-amber-500" />;
      case 'Servicios & Luz':
        return <Zap className="w-4 h-4 text-indigo-500" />;
      case 'Ocio & Cultura':
        return <Film className="w-4 h-4 text-pink-500" />;
      case 'Salud & Bienestar':
        return <HeartPulse className="w-4 h-4 text-teal-500" />;
      case 'Educación & Cursos':
        return <GraduationCap className="w-4 h-4 text-purple-500" />;
      case 'Inversiones & Ahorro':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'Salario Principal':
        return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case 'Freelance & Consultoría':
        return <Laptop className="w-4 h-4 text-cyan-500" />;
      case 'Rendimientos / Inversiones':
        return <Coins className="w-4 h-4 text-amber-500" />;
      default:
        return type === 'income' ? (
          <Wallet className="w-4 h-4 text-emerald-500" />
        ) : (
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        );
    }
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type match
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

      // Category match
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesCat = tx.category.toLowerCase().includes(query);
        const matchesNotes = tx.notes ? tx.notes.toLowerCase().includes(query) : false;
        const matchesDate = tx.date.includes(query);
        if (!matchesDesc && !matchesCat && !matchesNotes && !matchesDate) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, typeFilter, categoryFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Export filtered transactions to CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ['ID', 'Tipo', 'Monto', 'Categoría', 'Descripción', 'Fecha', 'Notas'];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.type,
      tx.amount,
      `"${tx.category}"`,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.date,
      `"${(tx.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AuraWealth_Transacciones_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6">
      {/* Title & Primary Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Historial de Movimientos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Registro cronológico detallado de todos tus ingresos y gastos
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            title="Exportar a archivo CSV"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Transacción</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="pt-4 pb-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por concepto, categoría o nota..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Segmented Type Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium shrink-0">
            <button
              type="button"
              onClick={() => {
                setTypeFilter('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg transition-all ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => {
                setTypeFilter('income');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg transition-all ${
                typeFilter === 'income'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Ingresos
            </button>
            <button
              type="button"
              onClick={() => {
                setTypeFilter('expense');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg transition-all ${
                typeFilter === 'expense'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Gastos
            </button>
          </div>

          {/* Category Dropdown Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 shrink-0 font-medium cursor-pointer"
          >
            <option value="all">Todas las Categorías</option>
            {DEFAULT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction Records List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {paginatedTransactions.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No se encontraron movimientos
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Prueba cambiando los filtros de búsqueda o agrega un nuevo movimiento financiero.
            </p>
          </div>
        ) : (
          paginatedTransactions.map((tx) => {
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="py-3 px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-xl flex items-center justify-between gap-3 group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Left: Category Icon & Description */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {getCategoryIcon(tx.category, tx.type)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {tx.description}
                      </p>
                    </div>
                    {/* Unboxed metadata separated by typographic dots */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>{tx.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{formatDateSpanish(tx.date)}</span>
                      {tx.notes && (
                        <>
                          <span aria-hidden="true" className="hidden sm:inline">·</span>
                          <span className="hidden sm:inline truncate max-w-[200px] text-slate-400 italic">
                            {tx.notes}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-xs sm:text-sm font-bold font-mono tabular-nums ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatMoney(tx.amount, currency)}
                    </span>
                  </div>

                  {/* Edit / Delete Buttons */}
                  <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onEditTransaction(tx)}
                      title="Editar transacción"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTransaction(tx.id)}
                      title="Eliminar transacción"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination & Count */}
      {filteredTransactions.length > itemsPerPage && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Mostrando {paginatedTransactions.length} de {filteredTransactions.length} registros
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
