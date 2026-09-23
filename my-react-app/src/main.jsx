import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
<StrictMode>
    <HelmetProvider>
      <AuthProvider><App /></AuthProvider>
    </HelmetProvider>
</StrictMode>)
