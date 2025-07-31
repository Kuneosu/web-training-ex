import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// MSW 초기화
async function enableMocking() {
  // 데모 목적으로 모든 환경에서 MSW 활성화
  // 실제 프로덕션에서는 개발 환경에서만 사용하는 것이 권장됩니다
  const { worker } = await import('./mocks/browser')
  
  // Service Worker 시작
  return worker.start({
    onUnhandledRequest: 'bypass', // 핸들링되지 않은 요청은 그대로 통과
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
