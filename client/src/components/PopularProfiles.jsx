import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import GirlCard from './GirlCard';
import { socket } from '../socket/socket.js';
import useRoomStore from '../store/roomStore.js';

const formatCount = (count) => count >= 1000 ? `${(count / 1000).toFixed(1)}K` : String(count || 0);

const PopularProfiles = () => {
    const scrollContainerRef = useRef(null);
    const rooms = useRoomStore((state) => state.rooms);
    const [profiles, setProfiles] = useState([]);
    const [onlineGirlIds, setOnlineGirlIds] = useState(new Set());

    useEffect(() => {
        let mounted = true;
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/v1/girl-profiles`, {
            withCredentials: true,
        }).then((response) => {
            if (mounted) setProfiles(response.data.data || []);
        }).catch(() => {
            if (mounted) setProfiles([]);
        });

        const updateOnlineUsers = ({ users = [] }) => {
            setOnlineGirlIds(new Set(
                users.filter((entry) => entry.userType === 'girl').map((entry) => String(entry.userId))
            ));
        };
        const requestOnlineUsers = () => socket.emit('get_online_users');

        socket.on('online_users', updateOnlineUsers);
        socket.on('connect', requestOnlineUsers);
        requestOnlineUsers();

        return () => {
            mounted = false;
            socket.off('online_users', updateOnlineUsers);
            socket.off('connect', requestOnlineUsers);
        };
    }, []);

    const roomGirlIds = useMemo(() => new Set(
        rooms.map((room) => String(room?.createdBy?._id)).filter(Boolean)
    ), [rooms]);

    const cards = useMemo(() => profiles
        .map((profile) => ({
            id: profile._id,
            name: profile.fullName,
            imageUrl: profile.imageUrl,
            rating: profile.rating || '—',
            followers: formatCount(profile.followersCount),
            isVerified: true,
            // A connected girl is green only when she is not in any active room.
            isOnline: onlineGirlIds.has(String(profile._id)) && !roomGirlIds.has(String(profile._id)),
        }))
        // Available online girls are always shown before offline/busy profiles.
        .sort((a, b) => Number(b.isOnline) - Number(a.isOnline)),
    [onlineGirlIds, profiles, roomGirlIds]);

    const handleScroll = (direction) => {
        scrollContainerRef.current?.scrollBy({
            left: direction === 'left' ? -350 : 350,
            behavior: 'smooth',
        });
    };

    return (
        <section className="w-full rounded-2xl border border-[#232336] bg-[#0a0a14]/80 p-4 font-sans">
            <div className="mb-4 flex items-center justify-between px-1">
                <h2 className="text-lg font-bold text-white">Popular Now <span className="text-pink-500">✨</span></h2>
                <span className="text-sm text-gray-400">{cards.length} girls</span>
            </div>

            {cards.length ? (
                <div className="group relative">
                    <button onClick={() => handleScroll('left')} className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-700 bg-gray-900/80 p-2 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100" aria-label="Scroll left">‹</button>
                    <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth [&::-webkit-scrollbar]:hidden">
                        {cards.map((profile) => <GirlCard key={profile.id} profile={profile} />)}
                    </div>
                    <button onClick={() => handleScroll('right')} className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-700 bg-gray-900/80 p-2 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100" aria-label="Scroll right">›</button>
                </div>
            ) : <p className="py-4 text-center text-sm text-slate-400">No girl profiles are available yet.</p>}
        </section>
    );
};

export default PopularProfiles;
