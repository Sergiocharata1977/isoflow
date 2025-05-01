import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configHorizonsViteErrorHandler = `
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const addedNode of mutation.addedNodes) {
      if (
        addedNode.nodeType === Node.ELEMENT_NODE &&
        (
          addedNode.tagName?.toLowerCase() === 'vite-error-overlay' ||
          addedNode.classList?.contains('backdrop')
        )
      ) {
        handleViteOverlay(addedNode);
      }
    }
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

function handleViteOverlay(node) {
  if (!node.shadowRoot) {
    return;
  }

  const backdrop = node.shadowRoot.querySelector('.backdrop');

  if (backdrop) {
    const overlayHtml = backdrop.outerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(overlayHtml, 'text/html');
    const messageBodyElement = doc.querySelector('.message-body');
    const fileElement = doc.querySelector('.file');
    const messageText = messageBodyElement ? messageBodyElement.textContent.trim() : '';
    const fileText = fileElement ? fileElement.textContent.trim() : '';
    const error = messageText + (fileText ? ' File:' + fileText : '');

    window.parent.postMessage({
      type: 'horizons-vite-error',
      error,
    }, '*');
  }
}
`;

const configHorizonsRuntimeErrorHandler = `
window.onerror = (message, source, lineno, colno, errorObj) => {
  window.parent.postMessage({
    type: 'horizons-runtime-error',
    message,
    source,
    lineno,
    colno,
    error: errorObj && errorObj.stack
  }, '*');
};
`;

const configHorizonsConsoleErrroHandler = `
const originalConsoleError = console.error;
console.error = function(...args) {
  originalConsoleError.apply(console, args);

  const errorString = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ').toLowerCase();

  window.parent.postMessage({
    type: 'horizons-console-error',
    error: errorString
  }, '*');
};
`;

const configWindowFetchMonkeyPatch = `
const originalFetch = window.fetch;

window.fetch = async function(...args) {
  return originalFetch.apply(this, args)
    .then(async response => {
      if(!response.ok) {
        const errorFromRes = await response.text();
        console.error(errorFromRes);
      }

      return response;
    })
    .catch(error => {
      console.error(error);

    throw error;
  });
};
`;

const addTransformIndexHtml = {
  name: "add-transform-index-html",
  transformIndexHtml(html) {
    return {
      html,
      tags: [
        {
          tag: "script",
          attrs: { type: "module" },
          children: configHorizonsRuntimeErrorHandler,
          injectTo: "head",
        },
        {
          tag: "script",
          attrs: { type: "module" },
          children: configHorizonsViteErrorHandler,
          injectTo: "head",
        },
        {
          tag: "script",
          attrs: { type: "module" },
          children: configHorizonsConsoleErrroHandler,
          injectTo: "head",
        },
        {
          tag: "script",
          attrs: { type: "module" },
          children: configWindowFetchMonkeyPatch,
          injectTo: "head",
        },
      ],
    };
  },
};

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 3002,
    host: true,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            if (id.includes("framer-motion")) {
              return "vendor-framer";
            }
            return "vendor";
          }
          if (id.includes("components/ui")) {
            return "ui";
          }
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    extensions: [".jsx", ".js", ".tsx", ".ts", ".json", ".scss"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables";',
      },
    },
  },
  define: {
    "process.env": {},
    global: {},
  },
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion", "@radix-ui/react-dialog"],
    exclude: ["path"],
    esbuildOptions: {
      target: "es2020",
      define: {
        global: "globalThis",
      },
    },
  },
  addTransformIndexHtml,
});
