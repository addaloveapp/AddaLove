import React, { useMemo, useState } from 'react';
import { useUserData } from '../context/UserdataContext';
import { useNavigate } from 'react-router';
import useUserStore from '../store/userStore';
import logo from '../assets/logo2.png';
import { Menu, X, ChevronRight } from 'lucide-react';

export default function TopNavbar() {
    const naviget = useNavigate();
    const { user: useralldata, userRole } = useUserStore();
    
    // State to handle sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handlecoinclick = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
        naviget('/wallet');
    };

    const isBoy = useMemo(() => userRole === 'boy', [userRole]);
    const isGirl = useMemo(() => userRole === 'girl', [userRole]);

    // Menu options for the sidebar
    const menuItems = [
        { name: 'Terms and Conditions', path: '/termsandconditions' },
        { name: 'Community Guidelines', path: '/communityguidelines' },
        { name: 'Privacy Policy', path: '/privacypolicy' },
        { name: 'Contact Us', path: '/contactus' },
    ];

    const handleMenuNavigation = (path) => {
        setIsSidebarOpen(false); // Close sidebar before navigating
        naviget(path);
    };

    return (
        <div>
            <header className="fixed top-0 w-full bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 z-30 px-4 md:px-8 py-4 flex justify-between items-center select-none">
                {/* Left section: Web title on widescreen or close button on small screens */}
                <div className="flex items-center gap-1">
                    <img src={logo} alt="" className="h-8" />
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
                        onClick={isGirl ? () => {
                            window.scrollTo({
                                top: 0,
                                left: 0,
                                behavior: 'smooth',
                            });
                            naviget("/earning");
                        } : handlecoinclick}
                        className="md:hidden bg-slate-800/80 hover:bg-slate-700/80 px-5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold border border-[#6C3BFF]/30 transition-colors"
                    >
                        <span className="text-yellow-400 text-[18px]">🪙</span>
                        <span className="text-slate-200">{useralldata?.walletBlance || '0'}</span>
                    </button>
                    
                    {/* Trigger for Sidebar */}
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-1 rounded-md hover:bg-slate-800 transition-colors"
                    >
                        <Menu className="text-pink-600" />
                    </button>
                </div>
            </header>

            {/* --- SIDEBAR OVERLAY --- */}
            {/* Hides the menu when clicking outside of it */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* --- RIGHT SIDEBAR MENU --- */}
            <div 
                className={`fixed top-0 right-0 h-full w-72 bg-[#0F172A] border-l border-slate-800 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
                    isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-5 flex justify-between items-center border-b border-slate-800/80">
                    <span className="text-slate-200 font-semibold text-lg tracking-wide">Menu</span>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex flex-col py-4">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleMenuNavigation(item.path)}
                            className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors group border-b border-slate-800/30 last:border-none"
                        >
                            <span>{item.name}</span>
                            <ChevronRight size={16} className="text-slate-500 group-hover:text-pink-500 transition-colors" />
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}