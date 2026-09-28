import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
export default [{
  files: ['src/**/*.{js,jsx}'],
  plugins: { react, 'react-hooks': hooks },
  languageOptions: {
    parserOptions: { ecmaFeatures: { jsx: true } },
    globals: Object.fromEntries(['fetch', 'window', 'document', 'localStorage', 'sessionStorage', 'console', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'URL', 'URLSearchParams', 'Blob', 'FileReader', 'FormData', 'navigator', 'alert', 'confirm', 'crypto'].map(name => [name, 'readonly'])),
  },
  rules: { 'no-undef': 'error', 'react/jsx-no-undef': 'error', 'react-hooks/rules-of-hooks': 'error' },
}];

