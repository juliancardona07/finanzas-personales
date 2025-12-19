# 🤖 Agentes y Componentes de FinanceFlow

Este documento describe la arquitectura de agentes, componentes y servicios que hacen funcionar FinanceFlow.

## 📋 Tabla de Contenidos

- [Agentes Principales](#agentes-principales)
- [Componentes React](#componentes-react)
- [Servicios](#servicios)
- [Flujo de Datos](#flujo-de-datos)
- [Integraciones Externas](#integraciones-externas)

---

## 🎯 Agentes Principales

### 1. **Agente de Dashboard Inteligente**
**Ubicación:** [`src/components/Dashboard.tsx`](src/components/Dashboard.tsx)

**Responsabilidad:** Visualización y análisis de datos financieros en tiempo real.

**Funciones:**
- Calcula patrimonio total agregando todos los saldos de cuentas
- Analiza distribución de gastos (Individual vs Compartido)
- Genera gráficos interactivos con Recharts (Pie, Bar, Line)
- Rastrea inversiones por ETF
- Muestra historial de 6 meses de patrimonio neto

**Datos que Consume:**
```typescript
- expenses: Gastos individuales y compartidos
- balances: Saldos bancarios por mes
- investments: Inversiones en ETF
```

**Gráficos Generados:**
- 📊 Distribución de gastos (Pie Chart)
- 📈 Patrimonio histórico (Line Chart)
- 📊 Distribución de ETFs (Pie Chart)
- 📉 Saldos de cuentas (Bar Chart)

---

### 2. **Agente de IA Financiera**
**Ubicación:** [`src/components/AIInsights.tsx`](src/components/AIInsights.tsx)

**Responsabilidad:** Análisis inteligente mediante Google Gemini API.

**Funciones:**
- Consulta la IA para análisis personalizados de finanzas
- Genera recomendaciones basadas en patrones de gasto
- Proporciona consejos para optimizar ahorro
- Evalúa salud del patrimonio neto

**Capacidades:**
1. ✅ Análisis de distribución de gastos
2. ✅ Evaluación de patrimonio neto
3. ✅ Recomendaciones de inversión en ETFs
4. ✅ 3+ consejos accionables personalizados

**Modelo IA Usado:** `gemini-3-flash-preview`

**Entrada:** Todos los datos financieros del usuario
**Salida:** Análisis en formato Markdown

---

### 3. **Agente de Gestor de Gastos**
**Ubicación:** [`src/components/ExpenseManager.tsx`](src/components/ExpenseManager.tsx)

**Responsabilidad:** CRUD de gastos con categorización.

**Funciones:**
- Crear, editar, eliminar gastos
- Clasificar como Fijo o Variable
- Categorizar como Individual o Compartido
- Filtrar por mes y año
- Validación de datos

**Tipos Soportados:**
```typescript
ExpenseType: 'Fijo' | 'Variable'
ExpenseCategory: 'Individual' | 'Compartido'
```

---

### 4. **Agente de Gestor de Cuentas**
**Ubicación:** [`src/components/AccountManager.tsx`](src/components/AccountManager.tsx)

**Responsabilidad:** Administración de cuentas bancarias y saldos.

**Funciones:**
- Registrar nuevas cuentas bancarias
- Actualizar saldos mensuales
- Rastrear histórico de balances
- Calcular patrimonio total
- Editar y eliminar cuentas

**Datos Registrados:**
```typescript
{
  accountName: string,
  balance: number,
  month: number,
  year: number
}
```

---

### 5. **Agente de Gestor de Inversiones**
**Ubicación:** [`src/components/InvestmentManager.tsx`](src/components/InvestmentManager.tsx)

**Responsabilidad:** Seguimiento de inversiones en ETF.

**Funciones:**
- Registrar inversiones en ETF
- Conversión automática USD → COP
- Rastrear tasa de cambio
- Historial de inversiones
- Análisis de distribución por ETF

**Datos Registrados:**
```typescript
{
  etfName: string,
  amountUsd: number,
  amountCop: number,
  exchangeRate: number,
  month: number,
  year: number,
  date: string
}
```

**Funcionalidades:**
- 💱 Conversión en tiempo real USD/COP
- 📊 Historial de inversiones
- 📈 Seguimiento por ETF

---

### 6. **Agente de Navegación (Sidebar)**
**Ubicación:** [`src/components/Sidebar.tsx`](src/components/Sidebar.tsx)

**Responsabilidad:** Navegación principal y opciones globales.

**Funciones:**
- Cambio de vistas entre módulos
- Selección de mes y año
- Exportación de datos (JSON Backup)
- Importación de respaldos
- Menú de navegación principal

**Vistas Disponibles:**
```typescript
'dashboard' | 'expenses' | 'wealth' | 'investments' | 'ai'
```

---

## ⚙️ Componentes React

### Jerarquía de Componentes

```
App (Contenedor Principal)
├── Sidebar (Navegación)
│   ├── Month/Year Selector
│   ├── Export Button
│   └── Import Button
└── Vista Activa
    ├── Dashboard
    │   ├── Metrics Cards
    │   ├── Pie Charts
    │   ├── Line Charts
    │   └── Bar Charts
    ├── ExpenseManager
    │   ├── Expense Form
    │   ├── Expense List
    │   └── Expense Filters
    ├── AccountManager
    │   ├── Account Form
    │   ├── Account List
    │   └── Net Worth Calculator
    ├── InvestmentManager
    │   ├── Investment Form
    │   ├── ETF List
    │   ├── Currency Converter
    │   └── Investment Charts
    └── AIInsights
        ├── IA Analysis Card
        ├── Loading State
        └── Refresh Button
```

---

## 🔧 Servicios

### **Servicio Gemini (IA)**
**Ubicación:** [`services/geminiService.ts`](services/geminiService.ts)

**Función Principal:** `getFinancialInsights(data: AppData): Promise<string>`

**¿Qué Hace?**
1. Inicializa cliente Google GenAI
2. Prepara prompt personalizado en español
3. Envía datos financieros a Gemini
4. Recibe análisis como respuesta

**Estructura del Prompt:**
```
1. Análisis de distribución de gastos
2. Salud del patrimonio neto
3. Recomendaciones de inversión en ETFs
4. 3+ consejos accionables
```

**Manejo de Errores:**
- Try/catch para fallos de API
- Mensaje de fallback amigable al usuario
- Logging en consola para debugging

**Configuración Requerida:**
```env
VITE_GEMINI_API_KEY=tu_clave_aqui
```

---

## 📊 Flujo de Datos

### Ciclo de Vida de los Datos

```
┌─────────────────────────────────────────┐
│         App.tsx (State Principal)       │
│  - expenses[]                           │
│  - balances[]                           │
│  - investments[]                        │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┬──────────┬────────┬─────────┐
        │             │          │        │         │
   Dashboard    ExpenseManager  AccountManager  InvestmentManager  AIInsights
        │             │          │        │         │
        └──────┬──────┴──────────┴────────┴─────────┘
               │
        ┌──────▼──────────────┐
        │  localStorage       │
        │  (JSON storage)     │
        └─────────────────────┘
```

### Persistencia de Datos

```typescript
// Guardar automáticamente en cada cambio
useEffect(() => {
  localStorage.setItem('finance_data', JSON.stringify(data));
}, [data]);

// Cargar al iniciar la app
const [data, setData] = useState<AppData>(() => {
  const saved = localStorage.getItem('finance_data');
  if (saved) return JSON.parse(saved);
  return { expenses: [], balances: [], investments: [] };
});
```

### Actualización de Datos

```typescript
const updateData = (newData: Partial<AppData>) => {
  setData(prev => ({ ...prev, ...newData }));
};
```

---

## 🌐 Integraciones Externas

### 1. **Google Gemini API**
- **Propósito:** Análisis inteligente de finanzas
- **Modelo:** gemini-3-flash-preview
- **Librería:** @google/genai
- **Configuración:** Variable de entorno `VITE_GEMINI_API_KEY`

### 2. **Recharts**
- **Propósito:** Visualización de gráficos
- **Gráficos Usados:**
  - PieChart (distribución de gastos, ETFs)
  - LineChart (histórico de patrimonio)
  - BarChart (saldos de cuentas)

### 3. **React + TypeScript**
- **Versión React:** 19.2.3
- **Tipado Completo:** Interfaz AppData con tipos específicos

### 4. **Tailwind CSS**
- **Propósito:** Estilos responsivos
- **Características:**
  - Grid responsivo
  - Animaciones suaves
  - Modo oscuro (preparado)
  - Componentes reutilizables

---

## 🔄 Patrones de Implementación

### Pattern 1: Custom Hook para Datos Filtrados
```typescript
const currentExpenses = useMemo(() => 
  data.expenses.filter(e => e.month === month && e.year === year), 
  [data.expenses, month, year]
);
```

### Pattern 2: Actualización Inmutable
```typescript
const updateData = (newData: Partial<AppData>) => {
  setData(prev => ({ ...prev, ...newData }));
};
```

### Pattern 3: Cálculos Memoizados
```typescript
const totalIndividual = useMemo(() => 
  currentExpenses
    .filter(e => e.category === 'Individual')
    .reduce((sum, e) => sum + e.amount, 0),
  [currentExpenses]
);
```

---

## 🚀 Extensibilidad

### Cómo Añadir un Nuevo Agente

1. **Crear componente React** en `src/components/`
2. **Definir interfaz de props**
3. **Recibir datos de App.tsx** vía props
4. **Llamar updateData()** para cambios
5. **Añadir ruta en Sidebar**
6. **Actualizar tipo View** en types.ts

### Ejemplo:
```typescript
// En types.ts
export type View = '...' | 'newAgent';

// En App.tsx
{view === 'newAgent' && <NewAgent data={data} updateData={updateData} />}

// En Sidebar.tsx
<button onClick={() => setView('newAgent')}>Nuevo Agente</button>
```

---

## 📈 Mejoras Futuras

- [ ] Soporte para múltiples usuarios (autenticación)
- [ ] Base de datos remota (Firebase, PostgreSQL)
- [ ] Predicción de gastos con IA
- [ ] Categorización automática con ML
- [ ] Alertas de gastos anormales
- [ ] Exportar a Excel/PDF
- [ ] Integración con bancos (API)
- [ ] Modo oscuro completo
- [ ] Gráficos más avanzados
- [ ] Análisis comparativo mes a mes

---

## 📞 Contacto y Soporte

Para reportar bugs en los agentes o sugerir mejoras, abre un issue en el repositorio.

**Última actualización:** Diciembre 2025
