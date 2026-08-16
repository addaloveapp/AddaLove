import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import useUserStore from '../store/userStore';
import useRoomStore from '../store/roomStore';
import { handleError } from './ErrorMessage';
import random from "../assets/random.png"
export default function ButtomNavbar() {
    const [activeTab, setActiveTab] = useState('home'); // 'home', 'rooms', 'profile', 'wallet'
    const naviget = useNavigate()
    const { userRole} = useUserStore();
    const { joinRandomRoom, isLoading: isMatching } = useRoomStore();
    const isBoy = useMemo(() => userRole === 'boy', [userRole]);
    const isGirl = useMemo(() => userRole === 'girl', [userRole]);
    const location = useLocation();
    const handleprofilebtnclick = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth', // Optional: creates a smooth animation instead of an instant jump
        });
        naviget('/profile')
    }
    const handlehomeclick = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth', // Optional: creates a smooth animation instead of an instant jump
        });
        naviget('/')

    }
    const handelroom = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth', // Optional: creates a smooth animation instead of an instant jump
        });
        naviget('/leaderboard')

    }

    const handelRechargeClick = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth', // Optional: creates a smooth animation instead of an instant jump
        });
        naviget('/wallet')

    }
    const handelEarningClick=()=>{
         window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth', // Optional: creates a smooth animation instead of an instant jump
        });
        naviget('/earning')

    }

    const handleRandomMatch = async () => {
        if (!isBoy || isMatching) return;

        try {
            const joinedRoom = await joinRandomRoom();
            naviget(joinedRoom.roomType === 'voice'
                ? `/voiceRoom/${joinedRoom.roomId}`
                : `/messageRoom/${joinedRoom.roomId}`);
        } catch (error) {
            handleError(error.response?.data?.message || 'Could not find an open room. Please try again.');
        }
    };

    return (
        <div>
            <div className="fixed bottom-0 left-0 right-0 h-20 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex md:hidden justify-between items-center px-4 z-40 select-none">

                <button
                    onClick={handlehomeclick}
                    className={`flex flex-col items-center justify-center flex-1 transition-all ${location.pathname === '/' ? 'text-[#FF4D8D]' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                    <span className="text-[10px] font-black mt-1">Home</span>
                </button>

                <button
                 onClick={handelroom}
                    className={`flex flex-col items-center justify-center flex-1 transition-all ${location.pathname === '/leaderboard' ? 'text-[#6C3BFF]' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-[10px] font-black mt-1">Leaderboard</span>
                </button>

                {/* Floating Quick Connection center button */}
                <div className="flex-1 flex justify-center -mt-6">
                    <button
                        onClick={handleRandomMatch}
                        disabled={!isBoy || isMatching}
                        title={isBoy ? 'Randomly join an open message or voice room' : 'Random matching is available for boys only'}
                        aria-label="Random room match"
                        className={`w-14 h-14 rounded-full bg-linear-to-r from-[#FF4D8D] to-[#6C3BFF] flex items-center justify-center shadow-[0_4px_20px_rgba(255,77,141,0.6)] border-4 border-slate-950 transform transition-all ${isBoy && !isMatching ? 'active:scale-95 group animate-pulse-glow' : 'cursor-not-allowed opacity-50'}`}
                    >
                        <img src={random} className="w-full h-full" alt="Random Icon" />
                    </button>
                </div>

                <button
                    onClick={isGirl?handelEarningClick:handelRechargeClick}
                    className={`flex flex-col items-center justify-center flex-1 ${location.pathname === '/wallet' || location.pathname === '/earning'  ? 'text-[#FF4D8D]' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] font-black mt-1">{isGirl?'Earning':'Recharge'}</span>
                </button>

                <button
                    onClick={handleprofilebtnclick}
                    className={`flex flex-col items-center justify-center flex-1 ${location.pathname === '/profile' ? 'text-[#FF4D8D]' : 'text-slate-400 hover:text-slate-200'} `}
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span className="text-[10px] font-black mt-1">Profile</span>
                </button>
            </div>
        </div>
    )
}
