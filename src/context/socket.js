
import { io } from 'socket.io-client';
import { baseurl } from '../config/appConfig';

const socket = io(baseurl,{
    autoConnect:false,
    reconnection:true
}) 
export default socket;
