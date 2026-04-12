import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { PortalProvider } from './contexts/PortalProvider.jsx'
import { SocketProvider } from './contexts/SocketProvider.jsx'
import { ThemeProvider } from './contexts/ThemeProvider.jsx'
import { ToastProvider } from './contexts/ToastProvider.jsx'
import { FirebaseAuthProvider } from './contexts/FirebaseAuthContext.jsx'

// Clear out stale service workers from previous projects on this port
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ v7_startTransition: true }}>
    <FirebaseAuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <PortalProvider>
            <SocketProvider>
              <App />
            </SocketProvider>
          </PortalProvider>
        </ToastProvider>
      </ThemeProvider>
    </FirebaseAuthProvider>
  </BrowserRouter>
)
