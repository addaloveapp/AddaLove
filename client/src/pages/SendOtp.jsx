import React, { useEffect } from 'react'

export default function SendOtp() {
  useEffect(() => {
    const sendotp= async()=>{
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/v1/send-sms-otp`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data= await response.json()
      console.log(data)
    }
    sendotp()

  }, [])
  return (
    <div>

    </div>
  )
}
