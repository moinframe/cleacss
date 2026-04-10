import { defineConfig } from 'vite';
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import handlebars from "vite-plugin-handlebars";


const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    outDir: resolve(__dirname, '../dist/playground'),
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        overview: resolve(__dirname, 'overview/index.html'),
        colors: resolve(__dirname, 'colors/index.html'),
        figma: resolve(__dirname, 'figma/index.html'),
      },
    },
  },
  css: {
    transformer: "lightningcss",
    lightningcss: {
      drafts: {
        customMedia: true,
      },
      targets: browserslistToTargets(browserslist(">= 0.25%")),
    },
  },
  plugins: [
    handlebars({
      helpers: {
        ifEquals: function (arg1: string, arg2: string, options: any) {
          if (arg1 === arg2) {
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        },
        ifNotEquals: function (arg1: string, arg2: string, options: any) {
          if (arg1 !== arg2) {
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        },
      },
      context: {
        version: "v" + require("../package.json").version,
      },
      partialDirectory: [
        resolve(__dirname, "./layouts/"),
        resolve(__dirname, "./partials/"),
      ],
    }),
  ],
  resolve: {
    alias: [
      {
        find: '/@src',
        replacement: resolve(__dirname, 'src')
      }
    ]
  }
});
