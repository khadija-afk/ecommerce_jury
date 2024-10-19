// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';
import { PanierProvider } from './utils/PanierContext';


//STRIPE333333


import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// FAVORIE
import { FavorisProvider } from './utils/FavorieContext';

const stripePromise = loadStripe("pk_test_51Phom3EnHYhhKmcInexE46fzy9I8IPWmwGNlN3LWEAoZjTLCYtKelEVVuAr0Lf1dPc316bGFmxHZRdOevjfK4rT300mcydSb7T")

const root = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
     
      <PanierProvider>
        <FavorisProvider>
          <Elements stripe={stripePromise}>
              <App />
          </Elements>
        </FavorisProvider>
      </PanierProvider>
      
    </Provider>
  </React.StrictMode>
);