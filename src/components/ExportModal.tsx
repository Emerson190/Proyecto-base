import React, { useState } from 'react';
import { Transaction, SavingsGoal } from '../types/finance';
import { generateSingleFileHtml } from '../utils/singleFileGenerator';
import { Download, Copy, Check, FileCode, Database, Upload, X } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  goals: SavingsGoal[];
  currency: string;
  onImportData: (imported: { transactions: Transaction[]; goals: SavingsGoal[] }) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  goals,
  currency,
  onImportData,
}) => {
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const htmlContent = generateSingleFileHtml(transactions, goals, currency);

  const handleDownloadHtml = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AuraWealth_index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      transactions,
      goals,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AuraWealth_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.transactions)) {
          onImportData({
            transactions: parsed.transactions,
            goals: Array.isArray(parsed.goals) ? parsed.goals : goals,
          });
          setImportStatus('¡Datos restaurados con éxito!');
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1500);
        } else {
          setImportStatus('El formato del archivo JSON no es válido.');
        }
      } catch (err) {
        setImportStatus('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Exportar & Respaldar AuraWealth
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Single-File App autocontenida y respaldo de tus datos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* 1. Single File HTML Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-emerald-500" />
                  Archivo HTML Único (Single File App)
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Autocontenido
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Genera un único archivo <code className="font-mono text-emerald-600 dark:text-emerald-400">index.html</code> con todo el código integrado (Tailwind CDN, React/JS, iconos y tus datos actuales). Listo para abrir con doble clic en cualquier navegador.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadHtml}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar index.html</span>
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                className="py-2 px-3 rounded-xl text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* 2. JSON Backup & Restore Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-500" />
              Respaldo & Restauración de Datos (JSON)
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Guarda tus transacciones y metas de ahorro en formato JSON para transferirlas entre dispositivos.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadJson}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar JSON</span>
              </button>

              <label className="flex-1 py-2 px-3 rounded-xl text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5" />
                <span>Importar JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 text-center">
                {importStatus}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
