import { useEffect } from 'react'

export function ServiceWorkerUpdater() {
  useEffect(() => {
    let refreshing = false

    // Detecta quando nova versão está pronta
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true
          window.location.reload()
        }
      })
    }

    // Verifica atualizações a cada 5 minutos
    const interval = setInterval(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.update()
        })
      }
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return null
}
