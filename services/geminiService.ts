
import { GoogleGenAI } from "@google/genai";
import { AppData } from "../types";

export const getFinancialInsights = async (data: AppData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Actúa como un experto asesor financiero personal. 
    Analiza los siguientes datos financieros de un usuario en Colombia:
    
    Gastos: ${JSON.stringify(data.expenses.map(e => ({ name: e.name, amount: e.amount, category: e.category })))}
    Saldos de Cuentas: ${JSON.stringify(data.balances)}
    Inversiones ETF: ${JSON.stringify(data.investments)}

    Proporciona un resumen ejecutivo en español que incluya:
    1. Un análisis de la distribución de gastos (individual vs compartido).
    2. Salud del patrimonio neto actual.
    3. Recomendaciones sobre la estrategia de inversión en ETFs basada en los montos aportados.
    4. 3 consejos accionables para optimizar el ahorro o reducir gastos.
    
    Mantén un tono profesional, motivador y claro. Usa Markdown para el formato.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No se pudo generar el análisis en este momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error al conectar con la inteligencia artificial.";
  }
};
