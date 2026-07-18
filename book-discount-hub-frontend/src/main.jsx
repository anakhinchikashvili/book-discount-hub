import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
    </AuthProvider>
  </StrictMode>,
)