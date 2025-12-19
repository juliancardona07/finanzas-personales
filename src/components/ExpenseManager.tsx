
import React, { useState, useEffect } from 'react';
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

  // Ensure default expense list exists for the selected month/year
  useEffect(() => {
    const existingNames = new Set(
      data.expenses.filter(e => e.month === month && e.year === year).map(e => e.name)
    );

    const missingNames = EXPENSE_NAMES.filter(n => !existingNames.has(n));
    if (missingNames.length === 0) return;

    const defaults = missingNames.map(name => ({
      id: crypto.randomUUID(),
      name,
      amount: 0,
      type: 'Fijo' as ExpenseType,
      category: SHARED_EXPENSE_NAMES.includes(name) ? 'Compartido' : 'Individual',
      month,
      year
    }));

    updateData({ expenses: [...data.expenses, ...defaults] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

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

  const handleUpdate = (id: string, changes: Partial<Expense>) => {
    const updated = data.expenses.map(e => e.id === id ? { ...e, ...changes } : e);
    updateData({ expenses: updated });
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
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Listado de Gastos</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const newExpenseRecord: Expense = {
                  id: crypto.randomUUID(),
                  name: '',
                  amount: 0,
                  type: 'Fijo',
                  category: 'Individual',
                  month,
                  year
                };
                updateData({ expenses: [...data.expenses, newExpenseRecord] });
              }}
              className="text-indigo-600 text-sm font-semibold hover:text-indigo-800 hover:underline transition-colors"
            >
              + Nuevo registro
            </button>
            <button 
              onClick={handleClone}
              className="text-indigo-600 text-sm font-semibold hover:text-indigo-800 hover:underline transition-colors"
            >
              + Clonar fijos del mes anterior
            </button>
            <button 
              onClick={exportToCSV}
              className="text-slate-500 text-sm font-medium hover:text-indigo-600 transition-colors"
            >
              📥 Exportar Todo
            </button>
          </div>
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
                <td className="py-3 px-2 font-medium text-slate-800">
                  <input
                    list={`expense-names-${month}-${year}`}
                    placeholder="Nombre del gasto"
                    className="p-1 text-sm rounded-md border border-slate-200 w-40"
                    value={e.name}
                    onChange={(ev) => {
                      const val = ev.target.value;
                      const cat = SHARED_EXPENSE_NAMES.includes(val) ? 'Compartido' : 'Individual';
                      handleUpdate(e.id, { name: val, category: cat });
                    }}
                  />
                  <datalist id={`expense-names-${month}-${year}`}>
                    {EXPENSE_NAMES.map(n => <option key={n} value={n} />)}
                  </datalist>
                </td>
                <td className="py-3 px-2">
                  <select
                    value={e.type}
                    onChange={(ev) => handleUpdate(e.id, { type: ev.target.value as ExpenseType })}
                    className="p-1 text-sm rounded-md border border-slate-200"
                  >
                    <option value="Fijo">Fijo</option>
                    <option value="Variable">Variable</option>
                  </select>
                </td>
                <td className="py-3 px-2 text-slate-500">
                  <select
                    value={e.category}
                    onChange={(ev) => handleUpdate(e.id, { category: ev.target.value as ExpenseCategory })}
                    className="p-1 text-sm rounded-md border border-slate-200"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Compartido">Compartido</option>
                  </select>
                </td>
                <td className="py-3 px-2 font-semibold text-slate-700">
                  <input
                    type="number"
                    className="w-28 p-1 text-sm rounded-md border border-slate-200"
                    value={Number(e.amount)}
                    onChange={(ev) => handleUpdate(e.id, { amount: Number(ev.target.value) })}
                  />
                </td>
                <td className="py-3 px-2 text-indigo-600 font-bold">
                  ${(e.category === 'Compartido' ? (e.amount / 2) : e.amount).toLocaleString()}
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
