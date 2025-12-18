
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { PortalProvider } from './components/Context/PortalProvider.jsx'


createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
    <PortalProvider>
         
      <App />
    
    </PortalProvider>
    
    </BrowserRouter>
   
,
)
