import React, { useMemo } from 'react'
import { useUserData } from '../context/UserdataContext'
import { useNavigate } from 'react-router';
import useUserStore from '../store/userStore';
import logo from '../assets/logo2.png'
export default function TopNavbar() {
    const naviget = useNavigate();
    const { user: useralldata , userRole} = useUserStore();
    const handlecoinclick = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
        naviget('/wallet')
    }
    const isBoy = useMemo(() => userRole === 'boy', [userRole]);
    const isGirl = useMemo(() => userRole === 'girl', [userRole]);
    return (
        <div>
            <header className="fixed top-0 w-full bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 z-30 px-4 md:px-8 py-4 flex justify-between items-center select-none">

                {/* Left section: Web title on widescreen or close button on small screens */}
                <div className="flex items-center gap-1">

                    <img src={logo} alt="" className='h-8' />
                    {/* Logo specifically for Mobile Viewport header */}
                    <div className="flex md:hidden items-center gap-1.5">
                        <div className="relative flex items-center">
                            <span className="text-lg font-black italic text-transparent bg-clip-text bg-linear-to-r from-[#FF4D8D] to-[#6C3BFF]">Adda</span>
                            <span className="text-lg font-black italic text-[#FF4D8D] ml-px">Love</span>
                        </div>
                    </div>
                </div>

                {/* Right Header Controls (Search & Wallet) */}
                <div className="flex items-center gap-3">
                    {/* Wallet button specifically on Mobile Viewport */}
                    <button
                        onClick={handlecoinclick}
                        disabled={isGirl}
                        className="md:hidden bg-slate-800/80 hover:bg-slate-700/80 px-5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold border border-[#6C3BFF]/30"
                    >
                        <span className="text-yellow-400 text-[18px]">🪙</span>
                        <span className="text-slate-200">{useralldata?.walletBlance}</span>
                    </button>

                    
                </div>
            </header>
        </div>
    )
}
