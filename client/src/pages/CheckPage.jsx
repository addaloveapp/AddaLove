import React from 'react'
import { AlertTriangle, Download, ShieldCheck } from 'lucide-react'
import logo from '../assets/logo2.png'

const CheckPage = ({ data }) => {
  const playStoreUrl = data?.url

  return (
    <main className="min-h-screen w-full bg-[#0c1014] px-5 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A] shadow-2xl shadow-black/30">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF4D8D] via-[#ff4d6d] to-[#6C3BFF]" />

          <div className="px-6 py-10 text-center sm:px-12 sm:py-14">
            <img src={logo} alt="AddaLove" className="mx-auto mb-7 h-14 w-auto" />

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff4d6d]/10 text-[#FF4D8D]">
              <AlertTriangle size={32} strokeWidth={1.8} aria-hidden="true" />
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#FF4D8D]">
              Important update
            </p>
            <h1 className="font-display text-3xl leading-tight text-white sm:text-4xl">
              Our old APK is no longer available
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
              We have moved AddaLove to the Play Store for a safer and better
              experience. Please download the latest app and sign in with the
              same account credentials you already use.
            </p>

            <div className="mx-auto mt-8 flex max-w-md items-start gap-3 rounded-2xl border border-[#6C3BFF]/30 bg-[#6C3BFF]/10 px-4 py-4 text-left">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#9b83ff]" size={21} aria-hidden="true" />
              <p className="text-sm leading-6 text-slate-200">
                Your existing profile and account remain the same. No new
                registration is required.
              </p>
            </div>

            {playStoreUrl ? (
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto mt-8 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-[#FF4D8D] px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-[#FF4D8D]/20 transition-colors hover:bg-[#ff326f] focus:outline-none focus:ring-2 focus:ring-[#FF4D8D] focus:ring-offset-2 focus:ring-offset-[#0F172A]"
              >
                <Download size={21} aria-hidden="true" />
                Download from Play Store
              </a>
            ) : (
              <p className="mx-auto mt-8 max-w-md rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 py-3 text-sm text-amber-200">
                The Play Store download link is temporarily unavailable.
                Please try again later.
              </p>
            )}

            <p className="mt-6 text-xs text-slate-500">
              Please do not use or install the discontinued APK.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default CheckPage