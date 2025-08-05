// socketMap.js
const userSocketMap = new Map();

export const setUserSocket = (userId, socketId) => {
    userSocketMap.set(userId, socketId);
    console.log(userSocketMap);
};
export const getSocketId = (userId) => userSocketMap.get(userId);
export const removeUserSocket = (userId) =>{
     userSocketMap.delete(userId)
    };
export const getMap = () => userSocketMap;
