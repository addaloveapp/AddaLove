import { create } from 'zustand';
import axios from 'axios';

const useLeaderboardStore = create((set, get) => ({
    leaderboards: {
        boy: [],
        girl: [],
    },
    fetchedLeaderboards: {
        boy: false,
        girl: false,
    },
    leaderboard: [],
    activeLeaderboard: 'boy',
    isLoading: false,
    error: null,
    setActiveLeaderboard: (userType) => {
        const leaderboards = get().leaderboards;
        set({ activeLeaderboard: userType, leaderboard: leaderboards[userType] || [] });
    },
    fetchLeaderboard: async (userType, force = false) => {
        const { fetchedLeaderboards, leaderboards } = get();
        if (!force && fetchedLeaderboards[userType]) {
            set((state) => ({ leaderboard: state.activeLeaderboard === userType ? leaderboards[userType] || [] : state.leaderboard, isLoading: false, error: null }));
            return leaderboards[userType] || [];
        }

        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/leaderboard/v1/leaderboard/${userType}`,
                {
                    withCredentials: true,
                }
            );
            set((state) => ({
                leaderboards: {
                    ...state.leaderboards,
                    [userType]: response.data.data,
                },
                fetchedLeaderboards: {
                    ...state.fetchedLeaderboards,
                    [userType]: true,
                },
                leaderboard: get().activeLeaderboard === userType ? response.data.data : state.leaderboard,
                isLoading: false,
            }));
            console.log('Leaderboard fetched:', response.data.data);
            return response.data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
            throw error;
        }
    }
}));

export default useLeaderboardStore;
