import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://haugogdatter.no',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
