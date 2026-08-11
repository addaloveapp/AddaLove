import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import useUserStore from '../store/userStore';
import { Camera, LogOut, Bell, ChevronLeft, CheckCircle2, Star, Trophy, Users, UserCheck, Wallet, Verified, Phone, MoveLeft, MoveRight, MapPin, Calendar, Edit3 } from 'lucide-react';
import { handleError } from '../components/ErrorMessage';
import respact from "../assets/respectpointlogo.png";
import homeAndProfileMusic from '../assets/musics/homeAndProfile.mpeg';
import PageMusicPlayer from '../components/PageMusicPlayer.jsx';
import wllate from "../assets/wallet.png"
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
  const [modalType, setModalType] = useState('photo'); // 'photo' | 'profile'
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState('');
  const [photoUploadLoading, setPhotoUploadLoading] = useState(false);
  const [ownPhotoMethod, setOwnPhotoMethod] = useState('camera');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

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

  const handleOpenModal = () => {
    if (useralldata) {
      setModalType('photo');
      setAvatarMode('avatar');
      setOwnPhotoMethod('camera');
      setSelectedFile(null);
      setFilePreviewUrl('');
      setSelectedAvatarUrl(useralldata.imageUrl || avatarOptions[0] || '');
      setIsModalOpen(true);
    }
  };

  const handleOpenProfileModal = () => {
    if (useralldata) {
      setModalType('profile');
      setProfileName(useralldata.fullName || '');
      setProfileBio(useralldata.userBio || '');
      setIsModalOpen(true);
    }
  };

  const handleSelectAvatar = (url) => {
    setSelectedAvatarUrl(url);
  };

  const handleOpenCamera = () => {
    setOwnPhotoMethod('camera');
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleOpenGallery = () => {
    setOwnPhotoMethod('gallery');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setFilePreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

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

  const handleUploadOwnPhoto = async () => {
    if (!selectedFile) {
      handleError('Please take or choose a photo first.');
      return;
    }

    setPhotoUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('profilePhoto', selectedFile);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/v1/upload-profile`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        handleError(data.message || 'Failed to upload profile photo.');
        return;
      }

      await fetchUser();
      setIsModalOpen(false);
      setSelectedFile(null);
      setFilePreviewUrl('');
    } catch (error) {
      console.error(error);
      handleError('Network issue while uploading photo.');
    } finally {
      setPhotoUploadLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/v1/profile-data-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: profileName, bio: profileBio }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        handleError(data.message || 'Failed to update profile data.');
        return;
      }
      await fetchUser();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      handleError('Network issue while updating profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handelTopUp = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    naviget('/wallet');
  };

  const handlewithdraw = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    naviget('/earning');
  };

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
    <div className="min-h-screen bg-[#090514] text-white pt-10 font-sans selection:bg-[#EC4899] selection:text-white pb-24">
      <PageMusicPlayer src={homeAndProfileMusic} />

      <main className="max-w-md mx-auto px-4 mt-18">
        
        {/* Profile Identity Card Context */}
        <section className="relative flex flex-col items-center bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-2xl mb-6 shadow-2xl">
          
          {/* Edit Button - Top Right */}
          <button
            onClick={handleOpenProfileModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            aria-label="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Avatar Section */}
          <div className="relative mt-2 mb-4">
            {/* Rank 1 Crown and Golden Spin Effect */}
            {userRank === 1 && (
              <>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-4xl drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] z-30 animate-bounce">
                  👑
                </div>
                {/* Spinning Golden Circle */}
                <div className="absolute inset-[-6px] rounded-full border-4 border-transparent border-t-yellow-400 border-b-yellow-400 animate-[spin_3s_linear_infinite] z-0 shadow-[0_0_20px_rgba(250,204,21,0.4)]"></div>
              </>
            )}

            <div className={`relative p-1 rounded-full z-10 ${userRank !== 1 ? 'bg-linear-to-tr from-[#8B5CF6] via-[#EC4899] to-[#F472B6] shadow-[0_0_25px_rgba(236,72,153,0.3)]' : 'bg-[#1A1235]'}`}>
              <img
                src={useralldata.imageUrl}
                alt={useralldata.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-[3px] border-[#130E29] bg-[#1A1235] cursor-pointer"
                onClick={handleOpenModal}
              />
              <button
                type="button"
                onClick={handleOpenModal}
                className="absolute right-0 bottom-0 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-violet-600 text-white shadow-xl shadow-pink-500/40 border-2 border-[#130E29] hover:scale-105 transition-transform"
                aria-label="Update profile photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            {/* Rank Badge */}
            <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase whitespace-nowrap shadow-lg border border-white/20 z-20 ${userRank === 1 ? 'bg-linear-to-r from-yellow-500 to-orange-500 shadow-yellow-500/30 text-white' : 'bg-linear-to-r from-[#EC4899] to-[#8B5CF6] shadow-pink-500/20'}`}>
              {isGirl ? (userRank === 1 ? 'Top Girl' : `Rank ${userRank === 0 ? '100+' : userRank}`) : (userRank === 1 ? 'Top Boy' : `Rank ${userRank === 0 ? '100+' : userRank}`)}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col items-center mt-3 w-full">
            <div className="flex items-center gap-1.5 mb-1">
              <h1 className="text-2xl font-bold tracking-tight text-white">{useralldata.fullName}</h1>
              <Verified className="w-5 h-5 text-blue-400" />
            </div>

            <div className="inline-flex items-center bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-[10px] font-semibold text-pink-300 mb-3">
              ⭐ Stylish Star
            </div>

            <p className="text-sm text-slate-300 text-center max-w-[90%] leading-relaxed mb-5">
              {useralldata?.userBio || 'Hey there! I am using this app to connect with awesome people.'}
            </p>

            {/* Demographics Grid */}
            <div className="flex flex-wrap justify-center gap-2 w-full">
              <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-medium text-slate-300 backdrop-blur-md">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                {useralldata.age || 20} Years
              </div>
              <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-medium text-slate-300 backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5 text-green-400" />
                India
              </div>
              <div className={`border px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-medium backdrop-blur-md ${isGirl ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                {isGirl ? '♀️ Girl' : '♂️ Boy'}
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Analytics Statistics Grid Layout */}
        <section className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-[1.25rem] p-3 text-center flex flex-col justify-center items-center shadow-lg backdrop-blur-xl">
            <Users className="w-5 h-5 text-pink-500 mb-1.5" />
            <span className="text-base font-black text-white">{useralldata.followersCount || 0}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Followers</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[1.25rem] p-3 text-center flex flex-col justify-center items-center shadow-lg backdrop-blur-xl">
            <UserCheck className="w-5 h-5 text-purple-400 mb-1.5" />
            <span className="text-base font-black text-white">{useralldata.followingCount || 0}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Following</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[1.25rem] p-3 text-center flex flex-col justify-center items-center shadow-lg backdrop-blur-xl">
            {isBoy ? <img src={respact} alt="Respect point logo" className='h-6 mb-1' /> : <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mb-1.5" />}
            <span className="text-base font-black text-white">{isBoy ? Number(userRate) * 2 : userRate || '0'}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 text-center leading-tight">{isBoy ? 'Respect Point' : 'Avg. Rating'}</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[1.25rem] p-3 text-center flex flex-col justify-center items-center shadow-lg backdrop-blur-xl">
            <Trophy className="w-5 h-5 text-orange-400 mb-1.5" />
            <span className="text-base font-black text-white">#{userRank === 0 ? '100+' : userRank}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Rank</span>
          </div>
        </section>

        {/* Financial Action Wallet Section Card */}
        <section className="relative overflow-hidden bg-white/5 border border-white/10 rounded-[2rem] p-6 mb-4 shadow-xl flex items-center justify-between backdrop-blur-xl">
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none ${isGirl ? 'bg-pink-500' : 'bg-blue-500'}`}></div>
          <div className="flex items-center gap-4 relative z-10">
            <div >
              {/* <Wallet className="w-7 h-7" /> */}
              <img src={wllate} className="h-12"  alt="Wallet image" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                {isGirl ? 'Your Earning' : 'Wallet Balance'}
              </p>
              <h3 className="text-3xl font-black text-white mt-1 tracking-tight flex items-baseline gap-1">
                {useralldata.walletBlance?.toLocaleString() || 0} <span className="text-sm text-yellow-500 font-bold">Coins</span>
              </h3>
            </div>
          </div>

          <button
            onClick={isBoy ? handelTopUp : handlewithdraw}
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer relative z-10 ${isGirl
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
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
            disabled={loder}
            className="w-full flex items-center justify-between p-4 px-6 rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm tracking-wide transition-all active:scale-[0.99] disabled:opacity-50 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 text-green-400 rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <span>Call History</span>
            </div>
            <MoveRight className="w-5 h-5 text-slate-500" />
          </button>
          
          <button
            onClick={handelLogout}
            disabled={loder}
            className="w-full flex items-center justify-between p-4 px-6 rounded-[1.5rem] bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 text-red-400 font-bold text-sm tracking-wide transition-all active:scale-[0.99] disabled:opacity-50 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 text-red-500 rounded-xl">
                {loder ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
              </div>
              <span>{loder ? 'Logging out...' : 'Logout Account'}</span>
            </div>
          </button>
        </section>

      </main>

      {/* Edit Profile Glassmorphism Modal Context */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg transition-opacity">
          <div className="w-full max-w-md bg-[#090514]/90 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden transform transition-all max-h-[85vh] backdrop-blur-xl">

            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-lg font-bold text-white tracking-wide">{modalType === 'photo' ? 'Update Profile Photo' : 'Edit Profile'}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 bg-white/5"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto custom-scrollbar">
              {modalType === 'photo' ? (
                <>
                  <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => setAvatarMode('avatar')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${avatarMode === 'avatar'
                        ? 'bg-white/10 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Avatar
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarMode('own')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${avatarMode === 'own'
                        ? 'bg-white/10 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Own Photo
                    </button>
                  </div>

                  {avatarMode === 'avatar' ? (
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Choose an avatar</p>
                      <div className="grid grid-cols-2 gap-3">
                        {avatarOptions.map((url) => (
                          <button
                            key={url}
                            type="button"
                            onClick={() => handleSelectAvatar(url)}
                            className={`relative overflow-hidden rounded-[1.5rem] border-[3px] p-0.5 transition-all ${selectedAvatarUrl === url ? 'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'border-transparent hover:border-white/20'}`}
                          >
                            <img
                              src={url}
                              alt="Avatar option"
                              className="h-36 w-full rounded-[1.25rem] object-cover bg-white/5"
                            />
                            {selectedAvatarUrl === url && (
                              <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-pink-500 px-2.5 py-1 text-[9px] font-black uppercase text-white shadow-lg">
                                <CheckCircle2 className="h-3 w-3" />
                                Selected
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Upload from your device</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={handleOpenCamera}
                          className="py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200 font-bold uppercase tracking-wider hover:bg-white/10 transition-all text-sm flex flex-col items-center gap-2"
                        >
                          <Camera className="w-5 h-5 text-pink-400" />
                          Selfie
                        </button>
                        <button
                          type="button"
                          onClick={handleOpenGallery}
                          className="py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200 font-bold uppercase tracking-wider hover:bg-white/10 transition-all text-sm flex flex-col items-center gap-2"
                        >
                          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Gallery
                        </button>
                      </div>

                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="user"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      <div className="rounded-3xl border border-white/10 bg-black/40 overflow-hidden relative">
                        {filePreviewUrl ? (
                          <img
                            src={filePreviewUrl}
                            alt="Selected profile preview"
                            className="w-full h-56 object-cover"
                          />
                        ) : (
                          <div className="flex flex-col h-56 items-center justify-center text-xs text-slate-500 px-6 text-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
                              <Camera className="w-5 h-5 text-slate-600" />
                            </div>
                            No photo selected yet.<br/>Use Selfie or Gallery to pick one.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={avatarMode === 'avatar' ? handleAvatarDone : handleUploadOwnPhoto}
                      disabled={avatarMode === 'avatar' ? avatarLoading : photoUploadLoading || !selectedFile}
                      className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all ${avatarMode === 'avatar'
                        ? 'bg-linear-to-r from-[#8B5CF6] to-[#EC4899] shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:scale-105'
                        : 'bg-linear-to-r from-[#EC4899] to-[#F97316] shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:scale-105'} ${(avatarMode === 'own' && !selectedFile) || avatarLoading || photoUploadLoading ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
                    >
                      {(avatarMode === 'avatar' ? avatarLoading : photoUploadLoading) ? (
                        <span className="inline-flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        avatarMode === 'avatar' ? 'Save Avatar' : 'Upload Photo'
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block pl-1">Full Name</label>
                    <input
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block pl-1">Bio</label>
                    <textarea
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3.5 text-white text-sm h-32 resize-none custom-scrollbar focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 transition-all placeholder:text-slate-600"
                      placeholder="Write a short bio about yourself..."
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleProfileSave}
                      disabled={profileLoading}
                      className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all bg-linear-to-r from-[#8B5CF6] to-[#EC4899] shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:scale-105 active:scale-95 ${profileLoading ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
                    >
                      {profileLoading ? (
                        <span className="inline-flex items-center gap-2 justify-center">
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}