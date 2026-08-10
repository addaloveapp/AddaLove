const onlineUsers = new Map();

const setOnlineUser = (userId, info) => onlineUsers.set(String(userId), info);
const getOnlineUsers = () => Array.from(onlineUsers.entries()).map(([userId, info]) => ({
    userId,
    userType: info.userType
}));
const getOnlineUser = (userId) => onlineUsers.get(String(userId));
const removeOnlineUser = (userId) => onlineUsers.delete(String(userId));

export { setOnlineUser, getOnlineUsers, getOnlineUser, removeOnlineUser };
