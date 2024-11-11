import baseConfig, { restrictEnvAccess } from "@mce/eslint-config/base";
import nextjsConfig from "@mce/eslint-config/nextjs";
import reactConfig from "@mce/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
