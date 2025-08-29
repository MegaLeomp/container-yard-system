import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'
import './index.css'

// Detecta atualizações automaticamente
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      console.log('📦 Nova versão disponível!')
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          // Atualiza automaticamente
          newWorker.postMessage({ type: 'SKIP_WAITING' })
        }
      })
    })
  })

  // Ouvinte para recarregar quando atualizar
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🔄 Controller changed, recarregando...')
    window.location.reload()
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)