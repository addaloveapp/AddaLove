import React, { useMemo } from 'react'
import useUserStore from '../store/userStore'
import { Phone, MessageCircle, Video, Clock, Calendar, ArrowDownRight, ArrowUpRight } from 'lucide-react'

export default function CallHistory() {
  const { history, userRole } = useUserStore();
  const isBoy = useMemo(() => userRole === 'boy', [userRole]);
  const isGirl = useMemo(() => userRole === 'girl', [userRole]);

  // Helper functions for formatting
  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoomIcon = (roomType) => {
    switch (roomType) {
      case 'voice':
        return <Phone size={16} className="text-green-400" />;
      case 'message':
        return <MessageCircle size={16} className="text-blue-400" />;
      case 'video':
        return <Video size={16} className="text-pink-400" />;
      default:
        return <Phone size={16} className="text-slate-400" />;
    }
  };

  // Fallback for avatar
  const getFallbackAvatar = (name = 'User') =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF4D8D&color=fff&bold=true`

  return (
    <div 
      className="min-h-screen bg-[#070b19] p-4 text-white sm:p-6"
      style={{ fontFamily: "'Baloo 2', cursive" }}
    >
      <div className="mx-auto mt-16.25 max-w-3xl">
        {/* Header Section */}
        <header className="mb-8 flex items-center justify-between rounded-[32px] border border-blue-500/20 bg-[#0a0f24] px-6 py-5 shadow-[0_0_25px_rgba(77,141,255,0.05)]">
          <div>
            <h1 
              className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-linear-to-r from-[#FF4D8D] to-[#4D8DFF]"
              style={{ fontFamily: "'DynaPuff', cursive" }}
            >
              History Log
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {isBoy ? "Track your connections and coins spent." : "Track your connections and coins earned."}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20">
            <Clock size={24} className="text-[#4D8DFF]" />
          </div>
        </header>

        {/* History List */}
        <div className="space-y-4 mb-17.5">
          {!history || history.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[32px] border border-white/5 bg-[#0a0f24] py-20 text-center">
              <div className="mb-4 rounded-full bg-slate-800 p-4 border border-slate-700">
                <Calendar size={32} className="text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-300">No History Found</h3>
              <p className="text-sm text-slate-500 mt-2">You haven't made any connections yet.</p>
            </div>
          ) : (
            history.map((record) => {
              const otherUser = record.otherUser || {};
              const coins = isBoy ? record.coinsSpent : record.coinsEarned;
              const isSpent = record.recordType === 'call_spend';
              const userName = otherUser.fullName || 'Unknown User';

              return (
                <div 
                  key={record._id}
                  className="group relative flex items-center justify-between rounded-[24px] border border-white/5 bg-[#0c122b]/80 p-4 transition-all hover:bg-[#121936] hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(77,141,255,0.1)] backdrop-blur-xl sm:p-5"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar with Neon Ring */}
                    <div className="relative shrink-0">
                      <div className="rounded-full p-0.5 bg-linear-to-br from-[#FF4D8D] to-[#4D8DFF] shadow-[0_0_15px_rgba(255,77,141,0.3)] group-hover:shadow-[0_0_20px_rgba(77,141,255,0.4)] transition-shadow duration-300">
                        <img
                          src={otherUser.imageUrl || getFallbackAvatar(userName)}
                          alt={userName}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getFallbackAvatar(userName);
                          }}
                          className="h-14 w-14 rounded-full border-2 border-[#0c122b] object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0c122b] bg-slate-800 shadow-md">
                        {getRoomIcon(record.roomType)}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-white tracking-wide">{userName}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-blue-400/70" />
                          {formatDate(record.createdAt)}
                        </span>
                        <span className="hidden sm:inline text-slate-600">•</span>
                        <span className="flex items-center gap-1 text-pink-300/80">
                          <Clock size={12} />
                          {formatDuration(record.durationSeconds)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Coin Transaction Data */}
                  <div className="flex shrink-0 flex-col items-end justify-center">
                    <div 
                      className={`flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-sm font-bold shadow-lg backdrop-blur-md ${
                        isBoy 
                          ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
                          : 'bg-green-500/10 border border-green-500/20 text-green-400'
                      }`}
                    >
                      {isBoy ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      <CoinIcon className={`w-4 h-4 ${isBoy ? 'text-yellow-400' : 'text-yellow-400'}`} />
                      <span style={{ fontFamily: "'DynaPuff', cursive" }}>
                        {isBoy ? '-' : '+'}{coins || 0}
                      </span>
                    </div>
                    <span className="mt-1.5 text-[10px] uppercase tracking-wider text-slate-500">
                      {isBoy ? 'Coins Spent' : 'Coins Earned'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  )
}

// Simple internal SVG for the coin
function CoinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.8" />
      <circle cx="12" cy="12" r="8" fill="currentColor" />
      <path d="M12 6V18M9 9H15M9 15H15" stroke="#0a0f24" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}