const GirlCard = ({ profile }) => {
    return (
        <div className="relative w-40 h-56 rounded-2xl overflow-hidden shrink-0 border border-gray-800 bg-gray-900 group cursor-pointer hover:border-pink-500/50 transition-colors">
            {/* Background Image */}
            <img
                src={profile.imageUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
            />

            {/* Online/Offline Indicator */}
            <div
                className={`absolute top-2 right-2 w-3.5 h-3.5 rounded-full border-2 border-gray-900 shadow-sm
          ${profile.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}
            />

            {/* Bottom Gradient Overlay for Text Readability */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">

                {/* Name & Verified Badge */}
                <div className="flex items-center gap-1 mb-1">
                    <h3 className="text-white font-semibold text-sm truncate">{profile.name}</h3>
                    {profile.isVerified && (
                        <svg className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    )}
                </div>

                {/* Stats: Rating and Followers */}
                <div className="flex items-center gap-3 text-xs text-gray-300">
                    <div className="flex items-center gap-1">
                        {/* Star Icon */}
                        <svg className="w-3 h-3 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <span>{profile.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {/* People/Followers Icon */}
                        <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>
                        <span>{profile.followers}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GirlCard;