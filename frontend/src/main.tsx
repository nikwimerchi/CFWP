// frontend/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './css/style.css'; 
import { BrowserRouter } from 'react-router-dom'; // 1. Import the BrowserRouter

// Find the root element where the app should mount
const rootElement = document.getElementById('root');

if (rootElement) {
  // 2. Wrap the <App /> component with <BrowserRouter> to provide the routing context
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* This wrapper is the final piece to resolve the blank screen crash. */}
      <BrowserRouter>
        <App /> 
      </BrowserRouter>
    </React.StrictMode>,
  );
} else {
    console.error("Root element with ID 'root' not found in the document.");
}