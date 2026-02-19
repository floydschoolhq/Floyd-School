
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { PortalProvider } from './components/Context/PortalProvider.jsx'
import { SocketProvider } from './components/Context/SocketContext.jsx'
import { ThemeProvider } from './components/Context/ThemeProvider.jsx'
import { ToastProvider } from './components/Context/ToastProvider.jsx'

createRoot(document.getElementById('root')).render(

  <BrowserRouter future={{ v7_startTransition: true }}>
    <ThemeProvider>
      <ToastProvider>
        <PortalProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </PortalProvider>
      </ToastProvider>
    </ThemeProvider>
  </BrowserRouter>

  ,
)
