import io from "socket.io-client";

const URL = "http://10.11.13.232:4000"

let socket = io(URL);

export default socket;