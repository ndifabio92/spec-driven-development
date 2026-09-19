import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Rutas relativas para que la carpeta dist/ funcione en cualquier alojamiento
// estatico, tambien en subcarpetas (GitHub Pages). La navegacion usa # (ver plan.md).
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    // Las unicas pruebas automaticas son las de la logica pura de dominio:
    // ahi esta el dinero (Decision 9 de research.md).
    include: ['src/dominio/*.test.ts'],
  },
})
