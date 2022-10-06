import socketIOClient from "socket.io-client"

export const socket = socketIOClient.connect(process.env.REACT_APP_API_URL)
// export const socket = socketIOClient(process.env.REACT_APP_API_URL, {
//     transports: ["websocket"],
//     reconnectionAttempts: 20,
//     reconnectionDelay: 5000
// })