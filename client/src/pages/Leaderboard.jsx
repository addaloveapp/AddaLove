import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  MessageCircleHeart,
  Mic,
  Home,
  Crown,
  CircleDollarSign,
  User,
  Star
} from 'lucide-react';
import useUserStore from '../store/userStore';
import useLeaderboardStore from '../store/leaderbordStore.js';
import ladday from "../assets/ladday.png";
import respact from "../assets/respectpointlogo.png"

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('boy');
  const { leaderboard, isLoading, fetchLeaderboard } = useLeaderboardStore();
  const { userRole } = useUserStore();


  const isBoy = useMemo(() => userRole === 'boy', [userRole]);
  const isGirl = useMemo(() => userRole === 'girl', [userRole]);
  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab, fetchLeaderboard]);

  const topThree = leaderboard?.slice(0, 3) || [];
  const restList = leaderboard?.slice(3) || [];

  // Rearrange top 3 for podium display (2nd, 1st, 3rd)
  const podiumOrder = [
    topThree[1] || { _id: '2', fullName: 'AKASH JANA', ratingScore: 9, imageUrl: '/api/placeholder/150/150' },
    topThree[0] || { _id: '1', fullName: 'SONU MAITY', ratingScore: 9, imageUrl: '/api/placeholder/150/150' },
    topThree[2] || { _id: '3', fullName: 'YESMIN', ratingScore: 8, imageUrl: '/api/placeholder/150/150' },
  ];

  // Helper for Diamond Icon
  const Diamond = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L22 12L12 22L2 12L12 2Z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#05000a] text-white font-sans relative pb-24 overflow-x-hidden">
      {/* Background Starry effect (simulated with radial gradient & absolute dots if needed) */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_#1a0b2e_0%,_#05000a_100%)] pointer-events-none z-0" />

      {/* Sparkle background elements */}
      <div className="absolute top-20 left-10 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-pink-400 rounded-full shadow-[0_0_5px_#f472b6]"></div>
      <div className="absolute top-80 left-1/4 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_5px_#60a5fa]"></div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4 pt-6 flex flex-col items-center">

        {/* Top Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="w-8 h-8 text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
            <span className="text-xl font-bold italic bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              AddaLove
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#1a1130] border border-purple-900/50 rounded-full px-3 py-1 shadow-[0_0_10px_rgba(147,51,234,0.2)]">
              <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                <span className="text-black text-xs font-bold">$</span>
              </div>
              <span className="text-sm font-semibold">0</span>
            </div>
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-400" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('boy')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold italic flex items-center justify-center gap-2 transition-all ${activeTab === 'boy'
                ? 'bg-transparent text-white border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5),inset_0_0_10px_rgba(59,130,246,0.3)]'
                : 'text-gray-500 border border-gray-800'
              }`}
          >
            <span className="text-lg leading-none not-italic text-blue-400">♂</span> BOYS LEADERBOARD
          </button>
          <button
            onClick={() => setActiveTab('girl')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold italic flex items-center justify-center gap-2 transition-all ${activeTab === 'girl'
                ? 'bg-transparent text-white border-2 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5),inset_0_0_10px_rgba(236,72,153,0.3)]'
                : 'text-gray-500 border border-gray-800'
              }`}
          >
            <span className="text-lg leading-none not-italic text-pink-400">♀</span> GIRLS LEADERBOARD
          </button>
        </div>

        {/* Title Section with Ladday (hidden or decorative integration) */}
        <div className="relative flex flex-col items-center mb-12">
          {/* Added Ladday image subtly behind the crown as a decorative element if requested, or just overlaying */}
          <div className=" ">
            <img src={ladday} className='h-35 object-contain' alt="" />
          </div>

          {/* <Crown className="w-8 h-8 text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)] mb-1" /> */}
          <h1 className="text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
            TOP {activeTab === 'boy' ? 'BOYS' : 'GIRLS'}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Diamond className="w-2 h-2 text-blue-500" />
            <p className="text-xs text-gray-300">Respected by AddaLove Community</p>
            <Diamond className="w-2 h-2 text-pink-500" />
          </div>
        </div>

        {/* Podium Section */}
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500"></div></div>
        ) : (
          <div className="flex items-end justify-center w-full gap-2 mb-10 h-72">
            {podiumOrder.map((user, index) => {
              if (!user) return <div key={index} className="w-[30%]"></div>;

              const rank = index === 0 ? 2 : index === 1 ? 1 : 3;

              const styles = {
                1: {
                  height: 'h-[140px]',
                  themeColor: '#eab308',
                  borderClass: 'border-yellow-500',
                  textClass: 'text-yellow-500',
                  shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.6),inset_0_0_15px_rgba(234,179,8,0.3)]',
                  avatarSize: 'w-24 h-24',
                  ringShadow: 'shadow-[0_0_20px_rgba(234,179,8,0.8)]'
                },
                2: {
                  height: 'h-[110px]',
                  themeColor: '#3b82f6',
                  borderClass: 'border-blue-500',
                  textClass: 'text-blue-500',
                  shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.6),inset_0_0_15px_rgba(59,130,246,0.3)]',
                  avatarSize: 'w-20 h-20',
                  ringShadow: 'shadow-[0_0_20px_rgba(59,130,246,0.8)]'
                },
                3: {
                  height: 'h-[110px]',
                  themeColor: '#ec4899',
                  borderClass: 'border-pink-500',
                  textClass: 'text-pink-500',
                  shadow: 'shadow-[0_0_15px_rgba(236,72,153,0.6),inset_0_0_15px_rgba(236,72,153,0.3)]',
                  avatarSize: 'w-20 h-20',
                  ringShadow: 'shadow-[0_0_20px_rgba(236,72,153,0.8)]'
                },
              }[rank];

              return (
                <div key={user._id} className={`flex flex-col items-center relative w-[32%] ${rank === 1 ? 'z-20 -mt-8' : 'z-10'}`}>

                  {/* Avatar Container with Laurels */}
                  <div className="relative flex flex-col items-center mb-4">
                    {rank === 1 && (
                      <Crown className={`absolute -top-6 w-8 h-8 ${styles.textClass} drop-shadow-[0_0_10px_rgba(234,179,8,1)] z-20`} />
                    )}

                    <div className="relative">
                      {/* Placeholder for SVG Laurel Wreaths */}
                      <svg viewBox="0 0 100 100" className={`absolute -inset-4 w-[130%] h-[130%] opacity-80 z-0 drop-shadow-[0_0_5px_${styles.themeColor}]`} style={{ color: styles.themeColor }}>
                        <path d="M 20 80 C 10 50, 20 20, 50 10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M 80 80 C 90 50, 80 20, 50 10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                      </svg>

                      <img
                        src={user.imageUrl || '/api/placeholder/150/150'}
                        alt={user.fullName}
                        className={`${styles.avatarSize} rounded-full object-cover border-2 ${styles.borderClass} ${styles.ringShadow} relative z-10 p-0.5 bg-black`}
                      />

                      {/* Rank / Icon badge overlapping avatar and pedestal */}
                      <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 ${styles.borderClass} bg-black flex items-center justify-center z-20 shadow-[0_0_10px_rgba(0,0,0,1)]`}>
                        {rank === 1 ? (
                          <span className="text-xl">✌️</span>
                        ) : (
                          <svg viewBox="0 0 24 24" className={`w-4 h-4 ${styles.textClass}`} fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pedestal Box */}
                  <div className={`w-full ${styles.height} rounded-2xl border-2 ${styles.borderClass} ${styles.shadow} bg-black/40 backdrop-blur-md flex flex-col items-center justify-end pb-3 pt-6 relative`}>
                    <span className="font-bold text-lg mb-1">{rank}</span>
                    <span className="font-bold italic text-[11px] uppercase tracking-wider text-center w-full truncate px-1">{user.fullName}</span>
                    <span className="text-[8px] text-gray-400 mt-1 mb-0.5 uppercase tracking-widest">{activeTab==="boy"?"Respect Points":"Rating"}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm">{user.ratingScore || 0}</span>
                      {activeTab==='boy'?<img src={respact} className='h-5' alt="" />:'⭐'}
                    </div>
                  </div>

                  {/* Glowing Base Ellipse */}
                  <div className={`w-[120%] h-6 -mt-3 rounded-[100%] border-b-2 border-x border-transparent ${styles.borderClass} shadow-[0_10px_20px_${styles.themeColor}] opacity-50`}></div>
                </div>
              );
            })}
          </div>
        )}

        {/* List Section */}
        <div className="w-full flex flex-col gap-3 z-10">
          {!isLoading && restList.map((user, index) => {
            const rank = index + 4;
            return (
              <div key={user._id} className="flex items-center justify-between bg-black/60 backdrop-blur-sm p-3 rounded-2xl border border-purple-900/50 shadow-[0_0_10px_rgba(147,51,234,0.15)] relative overflow-hidden">
                {/* Left gradient accent inside card */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600"></div>

                <div className="flex items-center gap-4 pl-2">
                  <span className="w-6 text-center text-xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-purple-600">
                    {rank}
                  </span>
                  <div className="relative">
                    <img
                      src={user.imageUrl || '/api/placeholder/150/150'}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-full object-cover border border-purple-500/50 shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                    />
                  </div>
                  <span className="font-bold italic uppercase text-sm tracking-wide">{user.fullName}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest">{activeTab==="boy"?"Respect Points":"Rating"}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{user.ratingScore || 0}</span>
                      {activeTab==="boy"?<img src={respact} className='h-5' alt="" />:"⭐"}
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-purple-700/50 bg-[#1a0b2e] flex items-center justify-center hover:bg-purple-900/50 transition-colors">
                    <Star className="w-5 h-5 text-purple-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}

    </div>
  );
};

export default Leaderboard;