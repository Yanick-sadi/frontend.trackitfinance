import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import store from './redux/store.js';

import './index.css';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster />
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
