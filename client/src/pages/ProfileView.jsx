import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  UserPlus, 
  UserMinus,
  MessageCircle, 
  Users, 
  UserCheck, 
  Verified, 
  MapPin, 
  ShieldCheck,
  AlertTriangle,
  RefreshCcw,
  Loader2,
  Crown
} from 'lucide-react';
import respact from "../assets/respectpointlogo.png";
export default function ProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avgReating,setAvgReacting]=useState(0);
  const [respectPoint,setRespectPoint]=useState(null);
  // Follow states
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    const fetchUserDataAndFollowStatus = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch Profile Data
        const profileUrl = `${import.meta.env.VITE_BACKEND_URL2}/api/auth/v1/profile-data`;
        const profileRes = await fetch(profileUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: id })
        });
        
        const profileDataRes = await profileRes.json();
        
        if (profileDataRes.success && profileDataRes.data) {
          const userProfile = profileDataRes.data.boyProfile || profileDataRes.data.girlProfile || profileDataRes.data.profile;
          
          if (userProfile) {
            setProfileData(userProfile);
            
            setStats({
                followers: profileDataRes.data.followersCount || 0,
                following: profileDataRes.data.followingCount || 0
            });
            if (profileDataRes.data.resRespectpoint !== null && profileDataRes.data.resRespectpoint !== undefined) {
               setRespectPoint(profileDataRes.data.resRespectpoint)
               setAvgReacting(0)
            } else {
                setRespectPoint(null)
                setAvgReacting(profileDataRes.data.avgRating ?? 0)
            }

          } else {
            setError("Profile data is incomplete or missing.");
          }
        } else {
          setError(profileDataRes.message || "Failed to load profile. Please try again.");
        }

        // Fetch Follow Status
        const followUrl = `${import.meta.env.VITE_BACKEND_URL}/api/follower/v1/check-follow`;
        const followRes = await fetch(followUrl, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileUserId: id }),
          credentials: 'include',
        });
        
        const followData = await followRes.json();
        if (followData.success) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Network issue! Unable to connect to the server.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUserDataAndFollowStatus();
    }
  }, [id]);

  const handleFollowToggle = async () => {
    if (isFollowLoading) return;
    
    setIsFollowLoading(true);
    try {
      const endpoint = isFollowing ? 'unfollow' : 'add-followers';
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/follower/v1/${endpoint}`;
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileUserId: id }),
        credentials: 'include',
      });
      
      const data = await res.json();
      
      if (data.success || res.ok) {
        setIsFollowing(!isFollowing);
        // Optimistically update the followers count in the UI
        setStats(prev => ({
          ...prev,
          followers: isFollowing ? prev.followers - 1 : prev.followers + 1
        }));
      } else {
        console.error("Failed to toggle follow status", data.message);
      }
    } catch (error) {
      console.error("Network error during follow toggle", error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const getFallbackAvatar = (name = 'User') =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF4D8D&color=fff&bold=true&size=200`;

  // -------------------------
  // SKELETON LOADER STATE
  // -------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b19] px-4 py-6 sm:px-6 font-sans flex flex-col items-center">
        <div className="w-full max-w-md">
          {/* Nav Skeleton */}
          <div className="flex items-center gap-4 mb-8 opacity-50">
            <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
            <div className="w-24 h-6 rounded-md bg-white/5 animate-pulse" />
          </div>

          {/* Profile Card Skeleton */}
          <div className="bg-[#0c122b]/80 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-xl flex flex-col items-center shadow-2xl animate-pulse">
            <div className="w-28 h-28 rounded-full bg-white/10 mb-4" />
            <div className="w-40 h-7 rounded-lg bg-white/10 mb-2" />
            <div className="w-24 h-5 rounded-full bg-white/5 mb-4" />
            <div className="w-full max-w-[80%] h-12 rounded-lg bg-white/5 mb-6" />
            
            <div className="flex gap-4 w-full mb-6">
              <div className="flex-1 h-16 rounded-2xl bg-white/5" />
              <div className="flex-1 h-16 rounded-2xl bg-white/5" />
            </div>
            
            <div className="flex gap-3 w-full">
              <div className="flex-[2] h-12 rounded-2xl bg-white/10" />
              <div className="flex-1 h-12 rounded-2xl bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------
  // ERROR STATE
  // -------------------------
  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-[#070b19] px-4 py-6 sm:px-6 font-sans flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-red-500/10 border border-red-500/20 rounded-[2rem] p-8 backdrop-blur-xl flex flex-col items-center text-center shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-400">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 tracking-wide">Oops! Something went wrong</h2>
          <p className="text-sm text-red-200/80 mb-6">{error || "User profile could not be found."}</p>
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all"
            >
              Go Back
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw size={16} /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------
  // SUCCESS STATE
  // -------------------------
  return (
    <div className="min-h-screen bg-[#070b19] px-4 py-6 sm:px-6 font-sans flex flex-col items-center">
      <div className="w-full max-w-md">
        
        {/* Navigation Bar */}
        <nav className="flex items-center gap-4 mb-6 z-10 relative">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-white tracking-wide">Profile</h1>
        </nav>

        {/* Main Profile Card */}
        <main className="bg-linear-to-b from-[#0c122b]/90 to-[#070b19]/90 border border-blue-500/20 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_40px_rgba(77,141,255,0.08)] flex flex-col items-center relative overflow-hidden">
          
          {/* Background Glow Effects */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4D8D]/20 rounded-full blur-[50px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#4D8DFF]/15 rounded-full blur-[60px] pointer-events-none" />

          {/* Avatar Section */}
          <div className="relative mb-5 group">
            <div className="absolute inset-[-4px] rounded-full bg-linear-to-tr from-[#FF4D8D] via-purple-500 to-[#4D8DFF] opacity-70 group-hover:opacity-100 blur-[8px] transition-opacity duration-500" />
            <div className="relative rounded-full p-1 bg-linear-to-tr from-[#FF4D8D] via-purple-500 to-[#4D8DFF]">
              <img 
                src={profileData.imageUrl || getFallbackAvatar(profileData.fullName)} 
                alt={profileData.fullName}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackAvatar(profileData.fullName);
                }}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-[4px] border-[#0c122b]"
              />
            </div>
          </div>

          {/* Identity Section */}
          <div className="flex flex-col items-center text-center z-10 w-full">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 mb-1">
              {profileData.fullName} 
              <Verified size={22} className="text-[#4D8DFF] drop-shadow-[0_0_8px_rgba(77,141,255,0.6)]" />
            </h2>
            
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-bold text-purple-300 uppercase tracking-widest mb-4">
              <ShieldCheck size={14} /> Verified Member
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-[90%] mb-6 font-medium">
              {profileData.userBio || "This user hasn't added a bio yet. They are exploring AddaLove mysteriously."}
            </p>

            {/* Demographics / Quick Info */}
            

            {/* Statistics Matrix */}
            <div className="flex w-full gap-3 mb-6">
              <div className="flex-1 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl py-4 transition-all hover:bg-white/10 backdrop-blur-md">
                <Users size={20} className="text-[#FF4D8D] mb-1.5" />
                <span className="text-xl font-black text-white tracking-tight">{stats.followers}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Followers</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl py-4 transition-all hover:bg-white/10 backdrop-blur-md">
                <UserCheck size={20} className="text-[#4D8DFF] mb-1.5" />
                <span className="text-xl font-black text-white tracking-tight">{stats.following}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Following</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl py-4 transition-all hover:bg-white/10 backdrop-blur-md">
               {respectPoint !== null && respectPoint !== undefined ? <img src={respact} className="h-10" alt="" /> :<Crown size={20} className="text-yellow-400  mb-1.5" />}
                <span className="text-xl font-black text-white tracking-tight">{respectPoint !== null && respectPoint !== undefined ? Number(respectPoint) * 2 : avgReating}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{respectPoint !== null && respectPoint !== undefined ? "Respect Point" : "Rating"}</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex w-full gap-3">
              <button 
                onClick={handleFollowToggle}
                disabled={isFollowLoading}
                className={`flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
                  ${isFollowing 
                    ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-md' 
                    : 'bg-linear-to-r from-[#FF4D8D] to-purple-600 text-white shadow-[0_0_20px_rgba(255,77,141,0.3)] hover:scale-[1.02]'
                  }`}
              >
                {isFollowLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isFollowing ? (
                  <><UserMinus size={18} /> Unfollow</>
                ) : (
                  <><UserPlus size={18} /> Follow</>
                )}
              </button>
              
              
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
