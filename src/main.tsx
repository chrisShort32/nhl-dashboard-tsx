import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Providers } from '@/app/providers'
import { router } from '@/app/router'
import './index.css'

// App bootstrap: mount React, wire global providers, and start routing.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router}></RouterProvider>
    </Providers>
    
  </StrictMode>,
)
