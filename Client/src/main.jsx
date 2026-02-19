
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { PortalProvider } from './components/Context/PortalProvider.jsx'
import { SocketProvider } from './components/Context/SocketContext.jsx'
import { ThemeProvider } from './components/Context/ThemeProvider.jsx'


createRoot(document.getElementById('root')).render(

  <BrowserRouter future={{ v7_startTransition: true }}>
    <ThemeProvider>
      <PortalProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </PortalProvider>
    </ThemeProvider>
  </BrowserRouter>

  ,
)
