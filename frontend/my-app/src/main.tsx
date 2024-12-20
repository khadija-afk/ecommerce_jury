// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';
import { PanierProvider } from './utils/PanierContext';
import { AuthProvider } from './utils/AuthCantext';



//STRIPE333333


import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// FAVORIE
import { FavorisProvider } from './utils/FavorieContext';

const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_KEY_STRIPE)

const root = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
    <AuthProvider> {/* AuthProvider doit envelopper tout */}
     
      <PanierProvider>
        <FavorisProvider>
          <Elements stripe={stripePromise}>
              <App />
          </Elements>
        </FavorisProvider>
      </PanierProvider>
      </AuthProvider>
      
    </Provider>
  </React.StrictMode>
);