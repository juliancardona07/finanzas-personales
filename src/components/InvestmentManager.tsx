
import React, { useState } from 'react';
import { AppData, ETFInvestment } from '../types';
import { ETF_NAMES } from '../constants';

interface Props {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  month: number;
  year: number;
}

const InvestmentManager: React.FC<Props> = ({ data, updateData, month, year }) => {
  const [newInv, setNewInv] = useState({
    etfName: ETF_NAMES[0],
    amountUsd: '',
    exchangeRate: '4000',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAdd = () => {
    if (!newInv.amountUsd || !newInv.etfName) return;
    
    const usd = parseFloat(newInv.amountUsd);
    const rate = parseFloat(newInv.exchangeRate);

    const investment: ETFInvestment = {
      id: crypto.randomUUID(),
      etfName: newInv.etfName.toUpperCase(),
      amountUsd: usd,
      amountCop: usd * rate,
      exchangeRate: rate,
      month,
      year,
      date: newInv.date
    };

    updateData({ investments: [...data.investments, investment] });
    setNewInv({ ...newInv, amountUsd: '' });
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Registrar Aporte ETF</h3>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors"
          >
            📥 Exportar Inversiones
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-6">Ingresa los datos del aporte. Los campos ahora tienen máxima visibilidad.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <input 
              list="etf-options"
              className={inputClasses}
              placeholder="Símbolo ETF (ej: VOO)"
              value={newInv.etfName}
              onChange={(e) => setNewInv({...newInv, etfName: e.target.value})}
            />
            <datalist id="etf-options">
              {ETF_NAMES.map(n => <option key={n} value={n} />)}
            </datalist>
          </div>
          
          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-1 px-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <span className="text-slate-500 text-xs font-black uppercase">$USD</span>
            <input 
              type="number" 
              className="w-full text-sm text-slate-900 bg-white border-none outline-none focus:ring-0 p-1.5"
              placeholder="0.00"
              value={newInv.amountUsd}
              onChange={(e) => setNewInv({...newInv, amountUsd: e.target.value})}
            />
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-1 px-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <span className="text-slate-500 text-xs font-black uppercase">TRM</span>
            <input 
              type="number" 
              className="w-full text-sm text-slate-900 bg-white border-none outline-none focus:ring-0 p-1.5"
              placeholder="4000"
              value={newInv.exchangeRate}
              onChange={(e) => setNewInv({...newInv, exchangeRate: e.target.value})}
            />
          </div>

          <input 
            type="date"
            className={inputClasses}
            value={newInv.date}
            onChange={(e) => setNewInv({...newInv, date: e.target.value})}
          />
          
          <button 
            onClick={handleAdd}
            className="bg-emerald-600 text-white p-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 shadow-md active:scale-95 transition-all"
          >
            Registrar Aporte
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Aportes del Periodo</h3>
          <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
            Total Invertido: ${totalInvestedMonth.toLocaleString()} COP
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
                  <td className="py-4 px-2 font-bold text-indigo-900">{i.etfName}</td>
                  <td className="py-4 px-2 text-slate-500">{i.date}</td>
                  <td className="py-4 px-2 font-medium text-slate-700">${i.amountUsd.toLocaleString()} USD</td>
                  <td className="py-4 px-2 text-slate-400 font-mono text-xs">{i.exchangeRate.toLocaleString()}</td>
                  <td className="py-4 px-2 font-bold text-emerald-600">${i.amountCop.toLocaleString()}</td>
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
