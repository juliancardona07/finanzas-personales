
import React, { useMemo, useState } from 'react';
import { AppData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { MONTHS } from '../constants';

interface DashboardProps {
  data: AppData;
  month: number;
  year: number;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard: React.FC<DashboardProps> = ({ data, month, year }) => {
  const currentExpenses = useMemo(() => 
    data.expenses.filter(e => e.month === month && e.year === year), 
    [data.expenses, month, year]
  );

  const currentBalances = useMemo(() => 
    data.balances.filter(b => b.month === month && b.year === year),
    [data.balances, month, year]
  );

  const totalIndividual = currentExpenses
    .filter(e => e.category === 'Individual')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalShared = currentExpenses
    .filter(e => e.category === 'Compartido')
    .reduce((sum, e) => sum + e.amount, 0);

  const partnerShare = totalShared / 2;
  const userTotalMonthly = totalIndividual + (totalShared / 2);
  const totalNetWorth = currentBalances.reduce((sum, b) => sum + b.balance, 0);

  const expenseDist = useMemo(() => {
    return [
      { name: 'Individual', value: totalIndividual },
      { name: 'Compartido (Mi Parte)', value: totalShared / 2 }
    ];
  }, [totalIndividual, totalShared]);

  const [monthsRange, setMonthsRange] = useState<number>(6);

  const historyData = useMemo(() => {
    const months = Array.from({ length: monthsRange }, (_, i) => {
      const d = new Date(year, month - (monthsRange - 1) + i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();

      const monthlyNetWorth = data.balances
        .filter(b => b.month === m && b.year === y)
        .reduce((sum, b) => sum + b.balance, 0);

      return {
        name: MONTHS[m],
        patrimonio: monthlyNetWorth
      };
    });
    return months;
  }, [data.balances, month, year, monthsRange]);

  const comparativeData = useMemo(() => {
    const months = Array.from({ length: monthsRange }, (_, i) => {
      const d = new Date(year, month - (monthsRange - 1) + i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();

      const monthlyNetWorth = data.balances
        .filter(b => b.month === m && b.year === y)
        .reduce((sum, b) => sum + b.balance, 0);

      const monthlyExpenses = data.expenses
        .filter(e => e.month === m && e.year === y)
        .reduce((sum, e) => sum + e.amount, 0);

      const monthlyInvestments = data.investments
        .filter(inv => inv.month === m && inv.year === y)
        .reduce((sum, inv) => sum + inv.amountCop, 0);

      return {
        name: MONTHS[m],
        patrimonio: monthlyNetWorth,
        gastos: monthlyExpenses,
        inversiones: monthlyInvestments
      };
    });
    return months;
  }, [data.balances, data.expenses, data.investments, month, year, monthsRange]);

  const etfDist = useMemo(() => {
    const etfMap = new Map<string, number>();
    data.investments.forEach(inv => {
      etfMap.set(inv.etfName, (etfMap.get(inv.etfName) || 0) + inv.amountCop);
    });
    return Array.from(etfMap.entries()).map(([name, value]) => ({ name, value }));
  }, [data.investments]);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Patrimonio Total</p>
          <p className="text-2xl font-bold text-slate-900">${totalNetWorth.toLocaleString()} COP</p>
          <div className="mt-2 text-xs text-emerald-600 font-medium">Actualizado este mes</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Gasto Total Personal</p>
          <p className="text-2xl font-bold text-indigo-600">${userTotalMonthly.toLocaleString()} COP</p>
          <div className="mt-2 text-xs text-slate-400">Individual + 50% Compartido</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Deuda Pareja (Este mes)</p>
          <p className="text-2xl font-bold text-amber-600">${partnerShare.toLocaleString()} COP</p>
          <div className="mt-2 text-xs text-slate-400">Total compartido: ${totalShared.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Inversión este mes</p>
          <p className="text-2xl font-bold text-emerald-600">
            ${data.investments.filter(i => i.month === month && i.year === year).reduce((s, i) => s + i.amountCop, 0).toLocaleString()} COP
          </p>
          <div className="mt-2 text-xs text-slate-400">En activos financieros</div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <label className="text-sm text-slate-500">Rango meses:</label>
        <select
          value={monthsRange}
          onChange={(e) => setMonthsRange(Number(e.target.value))}
          className="p-1 text-sm rounded-md border border-slate-200"
        >
          <option value={6}>6 meses</option>
          <option value={12}>12 meses</option>
        </select>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="text-lg font-bold mb-4 text-slate-800">Distribución de Gastos</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={expenseDist}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="text-lg font-bold mb-4 text-slate-800">Evolución del Patrimonio</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} hide />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="patrimonio" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparative Chart: Gastos vs Patrimonio vs Inversiones */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[380px]">
        <h3 className="text-lg font-bold mb-4 text-slate-800">Comparativo Mensual: Gastos · Patrimonio · Inversiones</h3>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={comparativeData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()} COP`} />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="gastos" name="Gastos" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="patrimonio" name="Patrimonio" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="inversiones" name="Inversiones" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="text-lg font-bold mb-4 text-slate-800">Inversión por ETF (Cartera Total)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={etfDist}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {etfDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()} COP`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="text-lg font-bold mb-4 text-slate-800">Patrimonio por Cuenta</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={currentBalances.map(b => ({ name: b.accountName, saldo: b.balance }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} hide />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()} COP`} />
              <Bar dataKey="saldo" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
