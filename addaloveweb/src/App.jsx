import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import AddaLoveLandingPage from './pages/Home'
import CertificateVerify from './pages/CertificateVerify'

function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<AddaLoveLandingPage/>}/>
      <Route path='/officalverification/:id' element={<CertificateVerify/>}/>
    </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
