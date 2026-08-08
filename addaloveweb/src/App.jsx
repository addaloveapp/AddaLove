import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import AddaLoveLandingPage from './pages/Home'
import CertificateVerify from './pages/CertificateVerify'
import PrivacyPolicy from './pages/PricacyAndPolicy'
import CommunityGuidelines from './pages/CommunityGuidelines'

function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<AddaLoveLandingPage/>}/>
      <Route path='/officalverification/:id' element={<CertificateVerify/>}/>
      <Route path='/privacypolicy' element={<PrivacyPolicy/>}/>
      <Route path='/communityguidelines' element={<CommunityGuidelines/>}/>
    </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
