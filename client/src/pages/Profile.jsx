import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import useUserStore from '../store/userStore';
import { Camera, LogOut, Bell, ChevronLeft, CheckCircle2, Star, Trophy, Users, UserCheck, Wallet, Verified, Phone, MoveLeft, MoveRight } from 'lucide-react';
import { handleError } from '../components/ErrorMessage';
import respact from "../assets/respectpointlogo.png"
import homeAndProfileMusic from '../assets/musics/homeAndProfile.mpeg';
import PageMusicPlayer from '../components/PageMusicPlayer.jsx';
export default function Profile() {
  const { user: useralldata, userRole, userRate, userRank, fetchUser } = useUserStore();
  const [top, setTop] = useState(false)
  const [count, setCount] = useState(0)
  const naviget = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loder, setLoder] = useState(false);
  const [avatarMode, setAvatarMode] = useState('avatar');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState('');
  const [avatarLoading, setAvatarLoading] = useState(false);

  const isBoy = useMemo(() => userRole === 'boy', [userRole]);
  const isGirl = useMemo(() => userRole === 'girl', [userRole]);

  const avatarOptions = useMemo(() => {
    if (isBoy) {
      return [
        'https://ik.imagekit.io/vn9p5q5si/boy1.png',
        'https://ik.imagekit.io/vn9p5q5si/boy2.png',
        'https://ik.imagekit.io/vn9p5q5si/boy3.png',
        'https://ik.imagekit.io/vn9p5q5si/boy4.png',
        'https://ik.imagekit.io/vn9p5q5si/boy5.png',
        'https://ik.imagekit.io/vn9p5q5si/boy6.png',
        'https://ik.imagekit.io/vn9p5q5si/boy7.png',
        'https://ik.imagekit.io/vn9p5q5si/boy8.png',
        'https://ik.imagekit.io/vn9p5q5si/boy9.png',
        'https://ik.imagekit.io/vn9p5q5si/boy10.png',
      ];
    }
    return [
      'https://ik.imagekit.io/vn9p5q5si/girl1.png',
      'https://ik.imagekit.io/vn9p5q5si/girl2.png',
      'https://ik.imagekit.io/vn9p5q5si/girl3.png',
      'https://ik.imagekit.io/vn9p5q5si/girl4.png',
      'https://ik.imagekit.io/vn9p5q5si/girl5.png',
      'https://ik.imagekit.io/vn9p5q5si/girl6.png',
      'https://ik.imagekit.io/vn9p5q5si/girl7.png',
      'https://ik.imagekit.io/vn9p5q5si/girl8.png',
      'https://ik.imagekit.io/vn9p5q5si/girl9.png',
      'https://ik.imagekit.io/vn9p5q5si/girl10.png',
    ];
  }, [isBoy]);

  // Open modal and initialize avatar selection
  const handleOpenModal = () => {
    if (useralldata) {
      setAvatarMode('avatar');
      setSelectedAvatarUrl(useralldata.imageUrl || avatarOptions[0] || '');
      setIsModalOpen(true);
    }
  };

  const handleSelectAvatar = (url) => {
    setSelectedAvatarUrl(url);
  };

  const handleAvatarDone = async () => {
    if (!selectedAvatarUrl) {
      handleError('Please select an avatar image.');
      return;
    }

    setAvatarLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/v1/add-avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ url: selectedAvatarUrl }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        handleError(data.message || 'Failed to update avatar.');
        return;
      }

      await fetchUser();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      handleError('Network issue while updating avatar.');
    } finally {
      setAvatarLoading(false);
    }
  };


  const handelTopUp = () => {
    console.log("hello")
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    naviget('/wallet');
  };

  const handlewithdraw = () => {
    console.log("hello")
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    naviget('/earning');
  };

  // Handle Form Submission

  const handelLogout = async () => {
    try {
      setLoder(true);
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/v1/logout`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success) {
        handleError(data.message);
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
      handleError('Network issue!!');
    } finally {
      setLoder(false);
    }
  };

  // SKELETON LOADER
  if (!useralldata) {
    return (
      <div className="min-h-screen bg-[#090514] py-12 px-4 flex justify-center items-center">
        <PageMusicPlayer src={homeAndProfileMusic} />
        <div className="w-full max-w-2xl bg-[#130E29] rounded-3xl p-8 animate-pulse border border-purple-900/20">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-purple-950/50"></div>
            <div className="space-y-3 flex-1">
              <div className="h-6 bg-purple-950/50 rounded w-1/3"></div>
              <div className="h-4 bg-purple-950/50 rounded w-1/4"></div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-purple-950/30 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090514] text-white font-sans selection:bg-[#EC4899] selection:text-white pb-24">
      <PageMusicPlayer src={homeAndProfileMusic} />

      {/* Top Navigation Bar Header from IMG-20260626-WA0012.jpg */}


      {/* Main Container Dashboard */}
      <main className="max-w-md mx-auto px-4 mt-18  min-h-screen bg-[#090514] text-white font-sans selection:bg-[#EC4899] selection:text-white pb-24">

        {/* Profile Identity Card Context */}
        <section className="relative flex items-start justify-between bg-[#130E29]/60 border border-purple-900/30 p-5 rounded-3xl backdrop-blur-xl mb-6 shadow-xl">
          <div className="flex items-start gap-4">
            {/* Crown Avatar Badge Container */}
            <div className="relative">
              {userRank === 1 ? <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg drop-shadow-[0_2px_5px_rgba(236,72,153,0.5)] z-20">👑</div> : ''}
              <div className="relative p-1 rounded-full bg-linear-to-tr from-[#8B5CF6] via-[#EC4899] to-[#F472B6] shadow-[0_0_20px_rgba(236,72,153,0.25)]">
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="absolute -right-1 -bottom-1 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-violet-600 text-white shadow-lg shadow-pink-500/20 border border-white/20 hover:scale-105 transition-transform"
                  aria-label="Update profile photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <img
                  src={useralldata.imageUrl}
                  alt={useralldata.fullName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#130E29] bg-[#1A1235] cursor-pointer"
                  onClick={handleOpenModal}
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-linear-to-r from-[#EC4899] to-[#8B5CF6] text-[9px] font-black tracking-wider uppercase whitespace-nowrap shadow-md shadow-pink-500/20 border border-white/10">
                {isGirl ? userRank === 1 ? 'Top Girl' : `Rank ${userRank === 0 ? '100+' : userRank}` : userRank == 1 ? 'Top Boy' : `Rank ${userRank === 0 ? '100+' : userRank}`}
              </div>:
            </div>

            {/* Profile Info Text Blocks */}
            <div className="space-y-1.5 mt-2">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">{useralldata.fullName}</h1>
                <Verified className="w-4 h-4 text-blue-400" />
              </div>

              <div className="inline-block bg-purple-950/40 border border-purple-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-pink-300">
                ⭐ Stylish Star
              </div>

              <p className="text-xs text-slate-400 italic max-w-50 leading-relaxed py-0.5">
                {useralldata?.userBio || ''}
              </p>

              {/* Badges Info Chips Grid Row */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-medium text-slate-300">
                <span className="bg-[#1C143A] px-2 py-0.5 rounded-md border border-purple-500/10 flex items-center gap-1">
                  👤 {useralldata.age || 20} Years
                </span>
                <span className="bg-[#1C143A] px-2 py-0.5 rounded-md border border-purple-500/10 flex items-center gap-1">
                  📍 India
                </span>
                <span className={`px-2 py-0.5 rounded-md border flex items-center gap-1 ${isGirl ? 'bg-pink-950/30 border-pink-500/20 text-pink-400' : 'bg-blue-950/30 border-blue-500/20 text-blue-400'}`}>
                  {isGirl ? '♀️ Girl' : '♂️ Boy'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Call for Editing */}
          <button
            onClick={handleOpenModal}
            className="shrink-0 px-4 py-1.5 text-xs font-bold rounded-full bg-linear-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
          >
            Edit Profile
          </button>
        </section>

        {/* Dashboard Analytics Statistics Grid Layout */}
        <section className="grid grid-cols-4 gap-2.5 mb-6">
          <div className="bg-[#130E29]/60 border border-pink-500/40 rounded-2xl p-3 text-center flex flex-col justify-center items-center shadow-lg shadow-pink-500/5">
            <Users className="w-4 h-4 text-pink-500 mb-1" />
            <span className="text-sm font-black text-pink-400">{useralldata.followersCount || 0}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Followers</span>
          </div>

          <div className="bg-[#130E29]/60 border border-purple-900/30 rounded-2xl p-3 text-center flex flex-col justify-center items-center">
            <UserCheck className="w-4 h-4 text-purple-400 mb-1" />
            <span className="text-sm font-black text-slate-200">{useralldata.followingCount || 0}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Following</span>
          </div>

          <div className="bg-[#130E29]/60 border border-purple-900/30 rounded-2xl p-3 text-center flex flex-col justify-center items-center">
            {isBoy ? <img src={respact} alt="Repact point logo" className='h-7' /> : <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mb-1" />}
            <span className="text-sm font-black text-slate-200">{isBoy ? Number(userRate) * 2 : userRate || '0'}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{isBoy ? 'Respect point' : 'Avg. Rating'}</span>
          </div>

          <div className="bg-[#130E29]/60 border border-purple-900/30 rounded-2xl p-3 text-center flex flex-col justify-center items-center">
            <Trophy className="w-4 h-4 text-orange-400 mb-1" />
            <span className="text-sm font-black text-slate-200">Rank {userRank === 0 ? '100+' : userRank}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Leaderboard</span>
          </div>
        </section>

        {/* Financial Action Wallet Section Card */}
        <section className="bg-[#130E29]/60 border border-purple-900/30 rounded-2xl p-5 mb-4 shadow-xl flex items-center justify-between relative overflow-hidden group">
          {/* <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div> */}
          <div className="flex items-center gap-3.5 relative z-10">
            <div className={`p-3 rounded-xl ${isGirl ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 tracking-wide">
                {isGirl ? 'Your earning' : 'Wallet Balance'}
              </p>
              <h3 className="text-2xl font-black text-white mt-0.5 tracking-tight">
                {useralldata.walletBlance?.toLocaleString() || 0} <span className="text-xs text-yellow-500 font-bold">Coins</span>
              </h3>
            </div>
          </div>

          <button
            onClick={isBoy ? handelTopUp : handlewithdraw}

            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer ${isGirl
              ? 'bg-linear-to-r from-pink-500 to-rose-600 shadow-pink-500/20'
              : 'bg-linear-to-r from-blue-500 to-[#8B5CF6] shadow-blue-500/20'
              }`}
          >
            {isGirl ? 'Withdraw' : 'Top Up'}
          </button>
        </section>

        {/* Global Action Management Controls Area */}
        <section className="space-y-3 mt-6">
          <button
            onClick={() => {
              naviget("/call-history")
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
              });
            }}
            disabled={loder}
            className="w-full flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-green-950/20 border border-green-900/30 hover:bg-red-950/40 text-green-400 font-bold text-sm tracking-wide transition-all active:scale-[0.99] disabled:opacity-50"
          >


            <Phone className="w-4 h-4" />
            <span>Call history</span>
            <MoveRight className="w-4 h-4" />


          </button>
          <button
            onClick={handelLogout}
            disabled={loder}
            className="w-full flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-red-950/20 border border-red-900/30 hover:bg-red-950/40 text-red-400 font-bold text-sm tracking-wide transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {loder ? (
              <svg className="animate-spin h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Logout Account</span>
              </>
            )}
          </button>
        </section>

      </main>

      {/* Edit Profile Glassmorphism Modal Context */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
          <div className="w-full max-w-md bg-[#130E29] border border-purple-500/20 rounded-3xl shadow-2xl overflow-hidden transform transition-all max-h-[85vh]">

            <div className="px-6 py-4 border-b border-purple-900/30 flex justify-between items-center bg-purple-950/20">
              <h2 className="text-base font-bold text-white tracking-wide">Update Profile Photo</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAvatarMode('avatar')}
                  className={`py-3 rounded-2xl text-sm font-semibold uppercase tracking-wider transition-all ${avatarMode === 'avatar'
                    ? 'bg-linear-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-lg shadow-purple-500/20'
                    : 'bg-[#090514] border border-purple-900/40 text-slate-300 hover:bg-[#130E29]'}`}
                >
                  Upload Avatar
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarMode('own')}
                  disabled
                  className="py-3 rounded-2xl bg-[#0E0B1E] border border-purple-900/40 text-slate-500 text-sm font-semibold uppercase tracking-wider cursor-not-allowed"
                >
                  Upload Own Photo
                </button>
              </div>

              {avatarMode === 'avatar' ? (
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Choose one avatar below</p>
                  <div className="grid grid-cols-2 gap-3">
                    {avatarOptions.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => handleSelectAvatar(url)}
                        className={`relative overflow-hidden rounded-3xl border p-0.5 transition-all ${selectedAvatarUrl === url ? 'border-pink-400 shadow-[0_0_0_3px_rgba(236,72,153,0.18)]' : 'border-purple-900/30 hover:border-pink-500'}`}
                      >
                        <img
                          src={url}
                          alt="Avatar option"
                          className="h-[165px] w-full rounded-3xl object-cover"
                        />
                        {selectedAvatarUrl === url && (
                          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-pink-500/95 px-2 py-1 text-[10px] font-bold uppercase text-white shadow-lg shadow-pink-500/20">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Selected
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-purple-900/40 bg-[#0B0718] p-5 text-sm text-slate-400">
                  Upload own photo is temporarily disabled. Please choose one of the avatar options.
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl border border-purple-900/40 text-xs font-bold text-slate-300 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAvatarDone}
                  disabled={avatarLoading || avatarMode !== 'avatar'}
                  className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-white transition-all ${avatarMode === 'avatar'
                    ? 'bg-linear-to-r from-[#8B5CF6] to-[#EC4899] shadow-lg shadow-purple-500/20 hover:opacity-90'
                    : 'bg-purple-950/40 cursor-not-allowed text-slate-500'}`}
                >
                  {avatarLoading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating
                    </span>
                  ) : (
                    'Done'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
