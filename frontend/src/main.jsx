import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { AuthProvider } from './contexts/AuthContext.jsx' // Importar o AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Envolver o App com AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
