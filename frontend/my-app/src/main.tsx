// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';
import { PanierProvider } from './utils/PanierContext';



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
     
      <PanierProvider>
      <App />
      </PanierProvider>
      
    </Provider>
  </React.StrictMode>
);
