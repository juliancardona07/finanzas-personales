import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    
    return {
      // Reemplaza 'tu-nombre-de-repo' por el nombre real de tu repositorio en GitHub
      base: mode === 'production' ? '/finanzas-personales/' : '/',
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // En Vite es preferible usar import.meta.env, 
        // pero esto mantiene compatibilidad con tu código actual
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'), // Ajustado a './src' que es el estándar
        }
      }
    };
});
