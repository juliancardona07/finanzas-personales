<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# FinanceFlow - Gestión Financiera Inteligente

Una aplicación web moderna para gestionar tus finanzas personales de forma inteligente. FinanceFlow te permite rastrear gastos, administrar cuentas bancarias, seguir inversiones en ETF y obtener insights automáticos impulsados por IA.

**Ver tu app en AI Studio:** https://ai.studio/apps/drive/1vXeWpJvPKciqq2U3jFW_p7Hlk8dJyHhJ

## ✨ Características

- **Dashboard Inteligente**: Visualiza un resumen completo de tus finanzas en un solo lugar
- **Gestor de Gastos**: Registra y categoriza gastos como fijos o variables, individuales o compartidos
- **Gestor de Cuentas**: Monitorea el saldo de tus cuentas bancarias por mes
- **Gestor de Inversiones**: Registra inversiones en ETF con seguimiento de tasa de cambio USD/COP
- **Insights con IA**: Recibe análisis inteligentes basados en Gemini para optimizar tus finanzas
- **Respaldo y Restauración**: Exporta e importa tus datos en formato JSON para mantener backups seguros
- **Almacenamiento Local**: Tus datos se guardan localmente en el navegador

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Estilos**: Tailwind CSS
- **Visualización**: Recharts
- **IA**: Google Gemini API
- **Build Tool**: Vite
- **Postcss**: Autoprefixer para compatibilidad

## 📋 Requisitos Previos

- Node.js 16 o superior
- npm o yarn
- Una clave de API de Google Gemini (obtén una en [Google AI Studio](https://aistudio.google.com/))

## 🚀 Instalación y Ejecución Local

1. **Clonar o descargar el proyecto:**
   ```bash
   git clone <tu-repositorio>
   cd finanzas-personales
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar la clave de API:**
   - Crea un archivo `.env.local` en la raíz del proyecto
   - Añade tu clave de API de Gemini:
   ```
   VITE_GEMINI_API_KEY=tu_clave_aqui
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador** en la URL que proporciona Vite (generalmente `http://localhost:5173`)

## 📦 Compilación para Producción

```bash
npm run build
```

El proyecto compilado se encontrará en la carpeta `dist/`.

Para previsualizar la compilación:
```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
finanzas-personales/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Panel principal con resumen
│   │   ├── ExpenseManager.tsx     # Gestión de gastos
│   │   ├── AccountManager.tsx     # Gestión de cuentas
│   │   ├── InvestmentManager.tsx  # Gestión de inversiones
│   │   ├── AIInsights.tsx         # Análisis impulsado por IA
│   │   └── Sidebar.tsx            # Navegación lateral
│   ├── App.tsx                     # Componente principal
│   ├── types.ts                    # Tipos TypeScript
│   ├── constants.ts                # Constantes de la app
│   ├── main.tsx                    # Punto de entrada
│   └── index.css                   # Estilos globales
├── services/
│   └── geminiService.ts            # Integración con Gemini API
├── vite.config.ts                  # Configuración de Vite
├── tailwind.config.js              # Configuración de Tailwind
├── tsconfig.json                   # Configuración de TypeScript
└── package.json                    # Dependencias y scripts
```

## 💾 Gestión de Datos

### Tipos de Datos

- **Gastos**: Pueden ser Fijos o Variables, e Individuales o Compartidos
- **Cuentas**: Seguimiento de saldos bancarios por mes y año
- **Inversiones**: Registro de ETF con conversión USD/COP

### Exportar Datos

Tu app genera un backup automático descargable con la fecha actual en el formato:
```
financeflow_backup_YYYY-MM-DD.json
```

### Importar Datos

Carga un backup anterior para restaurar tus datos financieros.

## 🤖 Integración con IA

FinanceFlow utiliza la API de Google Gemini para proporcionar análisis inteligentes:

- Análisis automático de patrones de gasto
- Recomendaciones de ahorro
- Sugerencias de optimización financiera

Asegúrate de tener una clave API válida en `.env.local` para usar esta funcionalidad.

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia que especifiques.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras problemas o tienes sugerencias, abre un issue en el repositorio.

---

**Última actualización:** Diciembre 2025
