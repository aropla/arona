import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'virtual:uno.css'
import '@unocss/reset/normalize.css'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './routes'
import { SeeleProvider } from '@app/seele-react'
import { arona } from '@arona'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <SeeleProvider seele={arona}>
    <RouterProvider router={router} />
  </SeeleProvider>
  // </StrictMode>
)
