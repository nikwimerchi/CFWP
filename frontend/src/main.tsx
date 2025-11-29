import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';

const AppWithRedux = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#010101',
            color: '#fff',
          },
        }}
      />
    </PersistGate>
  </Provider>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <AppWithRedux />
    </Router>
  </React.StrictMode>,
);
