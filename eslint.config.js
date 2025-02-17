import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"

const OFF = 0
const WARN = 1
const ERROR = 2

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        1,
        { allowConstantExport: true },
      ],
      // 对象的最后一个可以增加【,】
      "@typescript-eslint/comma-dangle": OFF,
      // 单引号关闭
      "@typescript-eslint/quotes": OFF,
      // 需要分号
      "@typescript-eslint/semi": OFF,
      // 不允许使用var
      "no-var": ERROR,
      // 函数不需要ts标注返回类型
      "@typescript-eslint/explicit-function-return-type": OFF,
      "no-tabs": OFF,
      "@typescript-eslint/indent": OFF,
      "@typescript-eslint/no-explicit-any": OFF,
      "@typescript-eslint/no-unused-vars": OFF,
    },
  },
)
