import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Singup from './pages/Singup.jsx'
import Login from './pages/login.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <div>404 Not Found</div>,
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path:"/signup",
        element:<Singup/>
      },
      {
         path:"/login",
        element:<Login/>

      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
