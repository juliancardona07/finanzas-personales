
import React, { useState, useEffect, useRef } from 'react';
import { AppData, View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExpenseManager from './components/ExpenseManager';
import AccountManager from './components/AccountManager';
import InvestmentManager from './components/InvestmentManager';
import AIInsights from './components/AIInsights';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('finance_data');
    if (saved) return JSON.parse(saved);
    return {
      expenses: [],
      balances: [],
      investments: []
    };
  });

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('finance_data', JSON.stringify(data));
  }, [data]);

  const updateData = (newData: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const exportFullBackup = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `financeflow_backup_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importFullBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = event.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        if (importedData.expenses && importedData.balances && importedData.investments) {
          setData(importedData);
          alert('Copia de seguridad restaurada con éxito.');
        } else {
          alert('El archivo no tiene el formato correcto.');
        }
      } catch (err) {
        alert('Error al leer el archivo.');
      }
    };
    fileReader.readAsText(files[0]);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard data={data} month={currentMonth} year={currentYear} />;
      case 'expenses':
        return <ExpenseManager data={data} updateData={updateData} month={currentMonth} year={currentYear} />;
      case 'wealth':
        return <AccountManager data={data} updateData={updateData} month={currentMonth} year={currentYear} />;
      case 'investments':
        return <InvestmentManager data={data} updateData={updateData} month={currentMonth} year={currentYear} />;
      case 'ai':
        return <AIInsights data={data} />;
      default:
        return <Dashboard data={data} month={currentMonth} year={currentYear} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar currentView={view} setView={setView} />
      {/* Añadido pb-20 en móvil para que el menú inferior no tape el contenido */}
      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto max-h-screen pb-20 md:pb-8">
        <header className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">FinanceFlow</h1>
            <p className="text-slate-500 text-sm font-medium">Gestión Inteligente de Finanzas</p>
            <div className="flex gap-4 mt-2">
              <button 
                onClick={exportFullBackup}
                className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                title="Descarga toda tu base de datos para respaldo"
              >
                💾 Exportar Backup (JSON)
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-700 flex items-center gap-1"
                title="Restaura una base de datos previa"
              >
                📂 Importar Backup
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={importFullBackup} 
                className="hidden" 
                accept=".json"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 px-2 border-r border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase">Mes:</span>
              <select 
                value={currentMonth} 
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                className="bg-white border-none text-sm font-bold text-slate-800 focus:ring-0 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 px-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Año:</span>
              <input 
                type="number" 
                value={currentYear} 
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="w-16 bg-white border-none text-sm font-bold text-slate-800 focus:ring-0 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
              />
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
