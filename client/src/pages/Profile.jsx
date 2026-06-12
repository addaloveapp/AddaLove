import React from 'react';
import { useUserData } from '../context/UserdataContext';
import { Camera, Edit2, User, Calendar, Shield, Wallet, Hash } from 'lucide-react';

export default function Profile() {
  const { useralldata } = useUserData();

  // Show nothing or a loader until data is available
  if (!useralldata) return null; 

  // Format the ISO date into a readable string
  const joinDate = new Date(useralldata.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#0F172A] p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Card: Avatar, Name, and Edit Button */}
        <div className="bg-[#1E293B]/80 backdrop-blur-xl flex justify-center rounded-2xl p-6 md:p-8 border border-[#6C3BFF]/20 shadow-2xl relative overflow-hidden group transition-all hover:shadow-[#6C3BFF]/10">
          
          {/* Subtle Grid Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#6C3BFF_1px,transparent_1px),linear-gradient(to_bottom,#6C3BFF_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar with Overlapping Camera Icon */}
              <div className="relative">
                <img 
                  src={useralldata.imageUrl} 
                  alt="Profile" 
                  className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-2 border-[#6C3BFF]/30 shadow-lg"
                />
                <button className="absolute -bottom-3 -right-3 bg-[#FF4D8D] p-2.5 rounded-xl text-white hover:bg-pink-500 transition-transform hover:scale-110 shadow-lg cursor-pointer">
                  <Camera size={18} />
                </button>
              </div>

              {/* User Identity Info */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                    {useralldata.fullName}
                  </h1>
                  <span className="bg-yellow-500/10 text-yellow-500 text-xs px-2.5 py-1 rounded-md font-semibold border border-yellow-500/20">
                    VIP
                  </span>
                </div>
                <p className="text-[#4DA6FF] font-medium">{useralldata.email}</p>
              </div>
            </div>

            {/* Edit Button */}
            <div className='flex justify-center gap-4'>

            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#FF4D8D]/30 text-[#FF4D8D] font-medium hover:bg-[#FF4D8D]/10 hover:border-[#FF4D8D] transition-all self-start md:self-center cursor-pointer">
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
            {/* <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#FF4D8D]/30 text-[#FF4D8D] font-medium hover:bg-[#FF4D8D]/10 hover:border-[#FF4D8D] transition-all self-start md:self-center cursor-pointer"> Top Up Wallet</button> */}
            </div>
           
          </div>
        </div>

        {/* Bottom Card: Profile Information List */}
        <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-[#6C3BFF]/20 shadow-2xl transition-all hover:border-[#6C3BFF]/40">
          <h2 className="text-white text-lg font-bold mb-6">Profile Information</h2>
          
          <ul className="space-y-5">
            <li className="flex items-center gap-4 text-gray-300 group hover:text-white transition-colors cursor-default">
              <User className="text-[#6C3BFF] group-hover:scale-110 transition-transform" size={20} />
              <span>Hey! I'm {useralldata.fullName} 💻</span>
            </li>
            
            <li className="flex items-center gap-4 text-gray-300 group hover:text-white transition-colors cursor-default">
              <Shield className="text-[#4DA6FF] group-hover:scale-110 transition-transform" size={20} />
              <span>Gender: {useralldata.userType}</span>
            </li>

            <li className="flex items-center gap-4 text-gray-300 group hover:text-white transition-colors cursor-default">
              <Hash className="text-[#FF4D8D] group-hover:scale-110 transition-transform" size={20} />
              <span>Age: {useralldata.age}</span>
            </li>

            <li className="flex items-center gap-4 text-gray-300 group hover:text-white transition-colors cursor-default">
              <Wallet className="text-[#6C3BFF] group-hover:scale-110 transition-transform" size={20} />
              <span>Wallet Balance: <span className="text-[#FF4D8D] font-semibold tracking-wide">₹{useralldata.walletBlance.toLocaleString()}</span></span>
            </li>

            <li className="flex items-center gap-4 text-gray-300 group hover:text-white transition-colors cursor-default">
              <Calendar className="text-[#4DA6FF] group-hover:scale-110 transition-transform" size={20} />
              <span>Joined {joinDate}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}