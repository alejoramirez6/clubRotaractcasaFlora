// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://clubrotaractcasaflora.org',

  // Modo estático-híbrido: todo se pre-renderiza en el Edge por defecto.
  // Para una futura ruta de API (ej. procesar el formulario de contacto),
  // exporta `export const prerender = false;` en esa página/endpoint puntual.
  output: 'static',

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: true,
    },
  }),

  vite: {
    plugins: [tailwindcss()],
  },
});
