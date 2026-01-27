import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/antd.css' // Ant Design Reset - phải import trước
import './styles/main.scss' // Main SCSS (includes Tailwind, theme, components)
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
