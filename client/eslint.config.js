import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
 globalIgnores(['dist']),
  
  // ----------------------------------------------------
  // FIX: Add this block to define Node.js globals for your config files 
  // (like tailwind.config.js and postcss.config.js)
  // ----------------------------------------------------
  {
    files: ['**/*.js'], // Target all JS files, including configs
    languageOptions: {
      globals: globals.node, 
    },
    // We explicitly exclude the files that will use the browser config later
    ignores: ['**/*.jsx'], 
  },
  // ----------------------------------------------------
  
 {
 files: ['**/*.{js,jsx}'],
 extends: [
 js.configs.recommended,
 reactHooks.configs.flat.recommended,
 reactRefresh.configs.vite,
 ],
 languageOptions: {
 ecmaVersion: 2020,
 globals: globals.browser, // This is correct for your application files
 parserOptions: {
 ecmaVersion: 'latest',
 ecmaFeatures: { jsx: true },
 sourceType: 'module',
 },
 },
 rules: {
 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
 },
},
])