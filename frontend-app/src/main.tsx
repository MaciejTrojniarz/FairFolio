import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store';
// Register service worker in dev environments that use module script too (vite preview/build handles index.html inline script in prod)
if ('serviceWorker' in navigator && import.meta.env.PROD === false) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
          <App />
    </Provider>
  </React.StrictMode>,
);