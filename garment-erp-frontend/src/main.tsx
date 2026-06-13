import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1e2535',
              color: '#e2e8f0',
              border: '1px solid #2d3a52',
              borderRadius: '8px',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#14b8a6', secondary: '#1e2535' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#1e2535' } },
          }}
        />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
