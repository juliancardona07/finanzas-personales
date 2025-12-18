
import React, { useState, useEffect } from 'react';
import { AppData } from '../types';
import { getFinancialInsights } from '../services/geminiService';

interface Props {
  data: AppData;
}

const AIInsights: React.FC<Props> = ({ data }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const result = await getFinancialInsights(data);
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Asistente Financiero Inteligente</h2>
          <p className="text-indigo-200 max-w-lg mb-6">
            Basado en tus gastos de este mes, saldos bancarios e inversiones en ETFs, FinanceFlow AI ha preparado un análisis personalizado para ti.
          </p>
          <button 
            disabled={loading}
            onClick={fetchInsights}
            className="bg-white text-indigo-900 px-6 py-2 rounded-xl font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
          >
            {loading ? 'Analizando...' : 'Refrescar Análisis'}
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 blur-3xl -mr-20 -mt-20 rounded-full"></div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Consultando a los expertos...</p>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none">
            {insight ? (
              <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                {insight.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('#') ? 'font-bold text-slate-900 mt-4 text-xl' : 'mb-2'}>
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400 italic">No hay datos suficientes para generar un análisis. Registra algunos gastos e inversiones primero.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
