
import React, { useState } from 'react';
import { AppData, Expense, ExpenseCategory, ExpenseType } from '../types';
import { EXPENSE_NAMES, SHARED_EXPENSE_NAMES } from '../constants';

interface Props {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  month: number;
  year: number;
}

const ExpenseManager: React.FC<Props> = ({ data, updateData, month, year }) => {
  const currentExpenses = data.expenses.filter(e => e.month === month && e.year === year);
  
  const [newExpense, setNewExpense] = useState<{
    name: string;
    amount: string;
    type: ExpenseType;
    category: ExpenseCategory;
  }>({
    name: EXPENSE_NAMES[0],
    amount: '',
    type: 'Fijo',
    category: SHARED_EXPENSE_NAMES.includes(EXPENSE_NAMES[0]) ? 'Compartido' : 'Individual',
  });

  const handleAdd = () => {
    if (!newExpense.name || !newExpense.amount) return;
    
    const expense: Expense = {
      id: crypto.randomUUID(),
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
      type: newExpense.type,
      category: newExpense.category,
      month,
      year
    };

    updateData({ expenses: [...data.expenses, expense] });
    setNewExpense({ ...newExpense, amount: '' });
  };

  const handleClone = () => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    
    const prevFixedExpenses = data.expenses.filter(e => e.month === prevMonth && e.year === prevYear && e.type === 'Fijo');
    
    const cloned = prevFixedExpenses.map(e => ({
      ...e,
      id: crypto.randomUUID(),
      month,
      year
    }));

    updateData({ expenses: [...data.expenses, ...cloned] });
  };

  const handleDelete = (id: string) => {
    updateData({ expenses: data.expenses.filter(e => e.id !== id) });
  };

  const exportToCSV = () => {
    const headers = ['Nombre', 'Tipo', 'Categoria', 'Valor Total', 'Mes', 'Año'];
    const rows = data.expenses.map(e => [
      e.name,
      e.type,
      e.category,
      e.amount,
      e.month + 1,
      e.year
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gastos_financeflow_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const inputClasses = "p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm";

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Agregar Gasto</h3>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors"
          >
            📥 Exportar Todo
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select 
            className={inputClasses}
            value={newExpense.name}
            onChange={(e) => {
              const name = e.target.value;
              setNewExpense({
                ...newExpense, 
                name,
                category: SHARED_EXPENSE_NAMES.includes(name) ? 'Compartido' : 'Individual'
              });
            }}
          >
            {EXPENSE_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <input 
            type="number" 
            placeholder="Valor COP"
            className={inputClasses}
            value={newExpense.amount}
            onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
          />
          <select 
            className={inputClasses}
            value={newExpense.type}
            onChange={(e) => setNewExpense({...newExpense, type: e.target.value as ExpenseType})}
          >
            <option value="Fijo">Fijo</option>
            <option value="Variable">Variable</option>
          </select>
          <select 
            className={inputClasses}
            value={newExpense.category}
            onChange={(e) => setNewExpense({...newExpense, category: e.target.value as ExpenseCategory})}
          >
            <option value="Individual">Individual</option>
            <option value="Compartido">Compartido</option>
          </select>
          <button 
            onClick={handleAdd}
            className="bg-indigo-600 text-white p-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
          >
            Agregar Gasto
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Listado de Gastos</h3>
          <button 
            onClick={handleClone}
            className="text-indigo-600 text-sm font-semibold hover:text-indigo-800 hover:underline transition-colors"
          >
            + Clonar fijos del mes anterior
          </button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500 text-xs font-bold uppercase">
              <th className="py-3 px-2">Nombre</th>
              <th className="py-3 px-2">Tipo</th>
              <th className="py-3 px-2">Categoría</th>
              <th className="py-3 px-2">Valor Total</th>
              <th className="py-3 px-2">Mi Parte</th>
              <th className="py-3 px-2">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentExpenses.map(e => (
              <tr key={e.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-2 font-medium text-slate-800">{e.name}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${e.type === 'Fijo' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                    {e.type}
                  </span>
                </td>
                <td className="py-3 px-2 text-slate-500">{e.category}</td>
                <td className="py-3 px-2 font-semibold text-slate-700">${e.amount.toLocaleString()}</td>
                <td className="py-3 px-2 text-indigo-600 font-bold">
                  ${(e.category === 'Compartido' ? e.amount / 2 : e.amount).toLocaleString()}
                </td>
                <td className="py-3 px-2">
                  <button onClick={() => handleDelete(e.id)} className="text-red-400 hover:text-red-600 font-medium transition-colors">Eliminar</button>
                </td>
              </tr>
            ))}
            {currentExpenses.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-slate-400 italic">No hay gastos registrados para este periodo.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseManager;
