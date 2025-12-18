
import React, { useState } from 'react';
import { AppData, AccountBalance } from '../types';
import { ACCOUNT_NAMES } from '../constants';

interface Props {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  month: number;
  year: number;
}

const AccountManager: React.FC<Props> = ({ data, updateData, month, year }) => {
  const currentBalances = data.balances.filter(b => b.month === month && b.year === year);
  const [editing, setEditing] = useState<Record<string, string>>({});

  const handleUpdateBalance = (accountName: string, value: string) => {
    const existing = data.balances.findIndex(b => b.accountName === accountName && b.month === month && b.year === year);
    
    const newBalances = [...data.balances];
    if (existing !== -1) {
      newBalances[existing] = { ...newBalances[existing], balance: parseFloat(value) || 0 };
    } else {
      newBalances.push({
        id: crypto.randomUUID(),
        accountName,
        balance: parseFloat(value) || 0,
        month,
        year
      });
    }
    updateData({ balances: newBalances });
  };

  const exportToCSV = () => {
    const headers = ['Cuenta', 'Saldo', 'Mes', 'Año'];
    const rows = data.balances.map(b => [
      b.accountName,
      b.balance,
      b.month + 1,
      b.year
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `patrimonio_financeflow_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Saldos Mensuales por Cuenta</h3>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors"
          >
            📥 Exportar Historial
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACCOUNT_NAMES.map(acc => {
            const current = currentBalances.find(b => b.accountName === acc);
            return (
              <div key={acc} className="p-5 border border-slate-200 rounded-xl bg-white flex items-center justify-between shadow-sm hover:border-indigo-200 transition-colors">
                <div>
                  <p className="font-bold text-slate-800">{acc}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Saldo actual</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    className="w-36 p-2 bg-slate-50 border border-slate-300 rounded-lg text-right font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-slate-900"
                    placeholder="0"
                    value={editing[acc] ?? current?.balance ?? ''}
                    onChange={(e) => setEditing({...editing, [acc]: e.target.value})}
                    onBlur={(e) => {
                      handleUpdateBalance(acc, e.target.value);
                      const newEdit = {...editing};
                      delete newEdit[acc];
                      setEditing(newEdit);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 p-8 rounded-2xl shadow-xl text-white">
        <h4 className="text-indigo-200 text-sm font-medium uppercase tracking-wider mb-2">Resumen de Patrimonio Total</h4>
        <p className="text-4xl font-black mb-4">
          ${currentBalances.reduce((sum, b) => sum + b.balance, 0).toLocaleString()} <span className="text-lg font-normal opacity-80 uppercase ml-2">cop</span>
        </p>
        <div className="grid grid-cols-2 gap-4 mt-8 border-t border-white/10 pt-8">
          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-indigo-300 text-xs font-bold uppercase mb-1">Cuentas Locales</p>
            <p className="text-xl font-bold">
              ${currentBalances.filter(b => b.accountName !== 'eToro').reduce((s, b) => s + b.balance, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-indigo-300 text-xs font-bold uppercase mb-1">Inversión Extranjera (eToro)</p>
            <p className="text-xl font-bold">
              ${currentBalances.filter(b => b.accountName === 'eToro').reduce((s, b) => s + b.balance, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManager;
