import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer, Flip } from "react-toastify";
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <ToastContainer transition={Flip} />
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  )
}

export default App
