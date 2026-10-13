import { create } from 'zustand';
import axios from 'axios';

const useIsAppLiveStore = create((set) => ({
    isAppLive: true,
    isLoading: false,
    error: null,
    data: null,
    checkIsAppLive: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/v1/is-app-live`,
                {
                    withCredentials: true,
                }
            );

            const serverData = response.data.data;

            set({
                isAppLive: serverData === null,
                data: serverData,
                isLoading: false,
                error: null,
            });
            return {
                isAppLive: serverData === null,
                data: serverData,
            }
        } catch (error) {
            set({
                error: error.response?.data?.message || error.message,
                isLoading: false,
            });

            throw error;
        }
    }
}))

export default useIsAppLiveStore;