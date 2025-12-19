
import React, { useState, useEffect } from 'react';
import { AppData, ETFInvestment } from '../types';
import { ETF_NAMES } from '../constants';

interface Props {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  month: number;
  year: number;
}

const InvestmentManager: React.FC<Props> = ({ data, updateData, month, year }) => {
  // Create missing default ETF records for the selected month/year
  useEffect(() => {
    const existing = new Set(
      data.investments.filter(i => i.month === month && i.year === year).map(i => i.etfName)
    );

    const missing = ETF_NAMES.filter(n => !existing.has(n));
    if (missing.length === 0) return;

    const defaults: ETFInvestment[] = missing.map(name => ({
      id: crypto.randomUUID(),
      etfName: name,
      amountUsd: 0,
      exchangeRate: 4000,
      amountCop: 0,
      month,
      year,
      date: new Date().toISOString().split('T')[0]
    }));

    updateData({ investments: [...data.investments, ...defaults] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const handleUpdate = (id: string, changes: Partial<ETFInvestment>) => {
    const updated = data.investments.map(i => {
      if (i.id !== id) return i;
      const merged = { ...i, ...changes } as ETFInvestment;
      // recalculate COP if usd or rate changed
      if (typeof changes.amountUsd !== 'undefined' || typeof changes.exchangeRate !== 'undefined') {
        const usd = Number(merged.amountUsd) || 0;
        const rate = Number(merged.exchangeRate) || 0;
        merged.amountCop = usd * rate;
      }
      return merged;
    });
    updateData({ investments: updated });
  };

  const exportToCSV = () => {
    const headers = ['ETF', 'Fecha', 'Valor USD', 'TRM', 'Valor COP', 'Mes', 'Año'];
    const rows = data.investments.map(i => [
      i.etfName,
      i.date,
      i.amountUsd,
      i.exchangeRate,
      i.amountCop,
      i.month + 1,
      i.year
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inversiones_financeflow_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentInvestments = data.investments.filter(i => i.month === month && i.year === year);
  const totalInvestedMonth = currentInvestments.reduce((sum, i) => sum + i.amountCop, 0);

  const inputClasses = "p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm w-full";

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Aportes del Periodo</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const record: ETFInvestment = {
                  id: crypto.randomUUID(),
                  etfName: '',
                  amountUsd: 0,
                  exchangeRate: 4000,
                  amountCop: 0,
                  month,
                  year,
                  date: new Date().toISOString().split('T')[0]
                };
                updateData({ investments: [...data.investments, record] });
              }}
              className="text-indigo-600 text-sm font-semibold hover:text-indigo-800 hover:underline transition-colors"
            >
              + Nuevo ETF
            </button>
            <button 
              onClick={exportToCSV}
              className="text-slate-500 text-sm font-medium hover:text-indigo-600 transition-colors"
            >
              📥 Exportar Inversiones
            </button>
            <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
              Total Invertido: ${totalInvestedMonth.toLocaleString()} COP
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-xs font-bold uppercase">
                <th className="py-4 px-2">ETF</th>
                <th className="py-4 px-2">Fecha</th>
                <th className="py-4 px-2">Inversión USD</th>
                <th className="py-4 px-2">Tasa Cambio</th>
                <th className="py-4 px-2">Equivalente COP</th>
                <th className="py-4 px-2">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentInvestments.map(i => (
                <tr key={i.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-2 font-bold text-indigo-900">
                    <input
                      list={`etf-names-${month}-${year}`}
                      className="p-1 text-sm rounded-md border border-slate-200 w-28"
                      value={i.etfName}
                      onChange={(ev) => handleUpdate(i.id, { etfName: ev.target.value.toUpperCase() })}
                    />
                    <datalist id={`etf-names-${month}-${year}`}>
                      {ETF_NAMES.map(n => <option key={n} value={n} />)}
                    </datalist>
                  </td>
                  <td className="py-4 px-2 text-slate-500">
                    <input
                      type="date"
                      className="p-1 text-sm rounded-md border border-slate-200"
                      value={i.date}
                      onChange={(ev) => handleUpdate(i.id, { date: ev.target.value })}
                    />
                  </td>
                  <td className="py-4 px-2 font-medium text-slate-700">
                    <input
                      type="number"
                      className="p-1 text-sm rounded-md border border-slate-200 w-24"
                      value={Number(i.amountUsd)}
                      onChange={(ev) => handleUpdate(i.id, { amountUsd: Number(ev.target.value) })}
                    /> USD
                  </td>
                  <td className="py-4 px-2 text-slate-400 font-mono text-xs">
                    <input
                      type="number"
                      className="p-1 text-sm rounded-md border border-slate-200 w-28"
                      value={Number(i.exchangeRate)}
                      onChange={(ev) => handleUpdate(i.id, { exchangeRate: Number(ev.target.value) })}
                    />
                  </td>
                  <td className="py-4 px-2 font-bold text-emerald-600">${Number(i.amountCop).toLocaleString()}</td>
                  <td className="py-4 px-2">
                    <button onClick={() => updateData({ investments: data.investments.filter(x => x.id !== i.id)})} className="text-red-400 hover:text-red-600 font-medium">Eliminar</button>
                  </td>
                </tr>
              ))}
              {currentInvestments.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 italic">No hay aportes registrados este mes.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvestmentManager;
