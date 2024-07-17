/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".vue", ".ts", ".tsx"],
        "moduleDirectory": ["node_modules", "src/"]
      },
      "alias": {
        "map": [
          ["@src", "./src"],
          ["@assets", "./src/assets"]
        ],
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    },

  },
}
