// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';
import { PanierProvider } from './utils/PanierContext';

//STRIPE

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51Phom3EnHYhhKmcInexE46fzy9I8IPWmwGNlN3LWEAoZjTLCYtKelEVVuAr0Lf1dPc316bGFmxHZRdOevjfK4rT300mcydSb7T")



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
     
      <PanierProvider>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
      </PanierProvider>
      
    </Provider>
  </React.StrictMode>
);
