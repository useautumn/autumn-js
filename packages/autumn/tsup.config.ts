import { defineConfig, Options } from "tsup";

const reactConfigs: Options[] = [
  // Backend
  {
    entry: ["src/libraries/backend/**/*.{ts,tsx}"],
    format: ["cjs", "esm"],
    dts: true,
    clean: false, // Don't clean on subsequent builds
    outDir: "./dist/libraries/backend",
    external: ["react", "react/jsx-runtime", "react-dom"],
    bundle: true,
  },

  // React
  {
    entry: ["src/libraries/react/**/*.{ts,tsx}"],
    format: ["cjs", "esm"],
    dts: true,
    clean: false,
    outDir: "./dist/libraries/react",
    external: [
      "react",
      "react/jsx-runtime",
      "react-dom",
      "@tanstack/react-query",
    ],
    bundle: true,
    banner: {
      js: '"use client";\n',
    },
    // esbuildOptions(options) {
    //   options.platform = "browser";
    //   options.format = "esm";
    // },
  },
];

export default defineConfig([
  {
    format: ["cjs", "esm"],
    entry: ["./src/sdk/index.ts"],
    skipNodeModulesBundle: true,
    // dts: true,
    shims: true,
    clean: false,
    outDir: "./dist/sdk",

    treeshake: true,
    target: "es2020",

    dts: {
      entry: {
        general: "src/sdk/general/genTypes.ts",
        check: "src/sdk/general/checkTypes.ts",

        customers: "src/sdk/customers/cusTypes.ts",
        entities: "src/sdk/customers/entities/entTypes.ts",
        products: "src/sdk/products/prodTypes.ts",
        referrals: "src/sdk/referrals/referralTypes.ts",
        index: "src/sdk/index.ts", // Main types will go to index.d.ts
      },
      // This ensures .d.ts files are generated separately
      resolve: true,
    },
  },

  // GLOBAL
  {
    entry: ["src/utils/*.{ts,tsx}"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    bundle: true,
    outDir: "./dist/utils", // Fixed wildcard path to specific directory
    external: ["react", "react/jsx-runtime", "react-dom"],
  },

  // SDK
  {
    entry: ["src/next/*.{ts,tsx}"],
    format: ["cjs", "esm"],
    dts: {
      entry: "src/next/index.ts",
    },
    clean: false, // Don't clean on subsequent builds
    outDir: "./dist/next",
    external: ["react", "react/jsx-runtime", "react-dom"],
    bundle: false,
  },
  ...reactConfigs,

  // React client components
  {
    entry: ["src/next/client/**/*.ts", "src/next/client/**/*.tsx"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    outDir: "./dist/next/client",
    external: ["react", "react/jsx-runtime", "react-dom"],
    bundle: false,
    banner: {
      js: '"use client";\n',
    },
    esbuildOptions(options) {
      options.platform = "browser";
      options.format = "esm";
    },
  },

  // React server components
  {
    entry: ["src/next/server/**/*.{ts,tsx}"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    outDir: "./dist/next/server",
    external: [
      "react",
      "react/jsx-runtime",
      "react-dom",
      "@clerk/backend",
      "better-auth",
      "@supabase/ssr",
    ],
    bundle: false,
    banner: {
      js: '"use server";',
    },
    esbuildOptions(options) {
      options.banner = {
        js: '"use server";',
      };
      options.platform = "node";
      options.format = "esm";
    },
  },
]);
