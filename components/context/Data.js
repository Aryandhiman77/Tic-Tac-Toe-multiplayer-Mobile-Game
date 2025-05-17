import {createContext, useContext, useEffect, useState} from 'react';

import socket from './socket';
import {AuthContext} from './Auth';
import RequestApi from './HandleApi';
import {useToast} from 'react-native-toast-notifications';
import {danger, success} from '../utils/ToastConfig';

export const DataContext = createContext();

const DataState = props => {
  const toast = useToast();

  const [localRoomId, setLocalRoomId] = useState('');
  const [player, setPlayer] = useState('');
  const [step, setStep] = useState('');
  const [tossResult, setTossResult] = useState(null);
  const {userinfo, renewTokens,reconnectSocket} = useContext(AuthContext);
  const [friendFound, setFriendFound] = useState(); // temporary for searching friend
  const [sentFriendRequests,setSentFriendRequests]=useState([]);
  const [incomingRequests,setIncomingRequests] = useState([]);
  const [friendList,setFriendList] = useState([]);
  const [loading,setLoading] = useState(false);
  const [liveRequest,setLiveRequest] = useState('');
  const [friendinfo,setFriendInfo] =useState('');
  const [roomtype,setroomtype] =useState('');

  
  const createRoom = () => {
    socket.emit('createRoom', roomId => {
      setLocalRoomId(roomId);
      setPlayer('Player1');
      setroomtype("host");
    });
  };
  
  const handleJoin = inputId => {
    socket.emit('joinRoom', inputId, response => {
      if (response.success) {
        setLocalRoomId(inputId);
        setPlayer('Player2');
        setroomtype("join");
      } else {
        toast.show(response.message, warning);
      }
    });
  };

 
  const handleMessages = () => {
    socket.emit('sendMessage', (localRoomId, player));
  };
  const disconnectSocket = () => {
    socket.disconnect();
  };



  
  // ====================friend list handling ====================
  const searchFriend = async friendid => {
    setLoading(true)
    try {
      console.log(friendid);
      const response = await RequestApi(
        '/friend/search',
        {friendid},
        userinfo?.authToken,
        userinfo?.refreshToken,
        renewTokens,"POST",'application/json',
      );
      console.log(response);
      if (response.success) {
        const {username, userid, profile} = response.data;
        setFriendFound({username, userid, profile});
        toast.show('Friend found.', success);
      } else {
        toast.show(response.message, danger);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const sendRequest = async friendid => {
    try {
      const response = await RequestApi(
        '/friend/send',
        {friendid}, // body
        userinfo?.authToken, // header auth token
        userinfo?.refreshToken, // if auth token expires
        renewTokens,"POST",'application/json',
      );
      console.log(response);
      if (response.success) {
        toast.show(response.data.message, success);
        getAllSentFriendRequests();
        
      } else {
        toast.show(response.message||"Something went wrong.", danger);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllSentFriendRequests = async () => {
    setLoading(true)
    try {
      const response = await RequestApi(
        '/friend/req',null,
        userinfo?.authToken, // header auth token
        userinfo?.refreshToken, // if auth token expires
        renewTokens,"POST",'application/json',
      );
      if (response.success) {
        setSentFriendRequests(response.data.requests)
        console.log(response.data);
        getIncomingRequests();

      } else {
        console.log(response);
        toast.show("Something went wrong.", danger);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const getIncomingRequests = async()=>{
    setLoading(true)
    try {
      const response = await RequestApi(
        '/friend/increq',{myfriendid:userinfo?.userid},
        userinfo?.authToken, // header auth token
        userinfo?.refreshToken, // if auth token expires
        renewTokens,
        "POST",'application/json',
      );
      if (response.success) {
        setIncomingRequests(response.data.requests)
        console.log(response);
        console.log(response.data);
      } else {
        console.log(response);
        toast.show(response.message||"Something went wrong.", danger);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  const acceptRequest = async(friendid)=>{
    setLoading(true)
    try {
      const response = await RequestApi(
        '/friend/accept',{friendid},
        userinfo?.authToken, // header auth token
        userinfo?.refreshToken, // if auth token expires
        renewTokens,"POST",'application/json',
      );
      if (response.success) {
        toast.show(response.data.message, success);
        
        getMyFriendList();
        getIncomingRequests();
      } else {
        toast.show(response.message, danger);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  const ignoreRequest = async()=>{
    setLoading(true)
    try {
      const response = await RequestApi(
        '/friend/reject',{friendid},
        userinfo?.authToken, // header auth token
        userinfo?.refreshToken, // if auth token expires
        renewTokens,"POST",'application/json',
      );
      if (response.success) {
        toast.show(response.data.message, success);
      } else {
        toast.show(response.message, danger);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  const getMyFriendList = async()=>{
    setLoading(true)
    try {
      const response = await RequestApi(
        '/friend/list',null,
        userinfo?.authToken, // header auth token
        userinfo?.refreshToken, // if auth token expires
        renewTokens,"POST",'application/json',
      );

      if (response.success) {
        setFriendList(response.data.friendList);
        console.log(response.data);
        setLoading(false)
      } else {
        console.log(response);
        toast.show(response.message, danger);
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  const deleteMyRequest = async({friendid})=>{
    setLoading(true)
    try {
      const response = await RequestApi(
        '/friend/deletereq',friendid,
        userinfo?.authToken, // header auth token
        userinfo?.refreshToken, // if auth token expires
        renewTokens,"POST",'application/json',
      );
      console.log(response)

      if (response.success) {
        getAllSentFriendRequests();
        setLoading(false)
      } else {
        toast.show(response.message, danger);
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  const handleFriendChallange = (friendid) => {
    socket.emit('challengeFriend', friendid); // fix the emit
    setLocalRoomId(userinfo?.userid); // set YOUR gameid as the roomId
    setPlayer('Player1');
    setroomtype("host");
  };
  const acceptLiveInvite = (roomid) => {
    handleJoin(roomid);
  };
  const rejectLiveInvite=()=>{
    setLiveRequest('');
    setLocalRoomId('');
    setPlayer('');
    setroomtype("");
  }
 
  useEffect(() => {
    getMyFriendList();
    
    const handleBroadCastOnlineStatus = receivedstatus => {
      console.log('user online received:', receivedstatus.userid);
    
      setFriendList(prevList => {
        const index = prevList?.findIndex(
          friend => friend.gameid === receivedstatus.userid
        );
        if (index === -1) return prevList;
    
        const updatedList = [...prevList];
        updatedList[index] = {
          ...updatedList[index],
          status: "active",
        };
    
        return updatedList;
      });
    };
    socket.on('playerJoined', () => {
      setStep('toss');
    });
    
    const handleBroadCastOfflineStatus = receivedstatus => {
      console.log('user online received:', receivedstatus.userid);
    
      setFriendList(prevList => {
        const index = prevList?.findIndex(
          friend => friend.gameid === receivedstatus.userid
        );
        if (index === -1) return prevList;
    
        const updatedList = [...prevList];
        updatedList[index] = {
          ...updatedList[index],
          status: "inactive",
        };
    
        return updatedList;
      });
    };
    const liveRoomRequests = (roomdata)=> {
      setLiveRequest(roomdata?.friend);
      
    }
    const listenplayerDisconnected = (msg)=>{
      setDisconnectMsg(msg);
    } 
    socket.on('playerJoined', (info) => {
      console.log("Both players info:", info);
      setFriendInfo(info); // save both host and joined player info
      setStep('toss');
    });
  

    socket.on('playerDisconnected', listenplayerDisconnected);
    
    socket.on('liveRoomRequests', liveRoomRequests);
  
    socket.on('checkOnlineUser', handleBroadCastOnlineStatus);
    socket.on('checkOfflineUser', handleBroadCastOfflineStatus);

    // socket clean ups 
    return ()=>{
      socket.off('checkOnlineUser', handleBroadCastOnlineStatus);
      socket.off('checkOfflineUser', handleBroadCastOfflineStatus);
      socket.off('liveRoomRequests', liveRoomRequests);
      socket.off('playerDisconnected', listenplayerDisconnected);
      socket.off('playerJoined');
     
    }
  }, []);
  return (
    <DataContext.Provider
      value={{
        createRoom,
        localRoomId,
        setLocalRoomId,
        handleJoin,
        player,
        step,
        setStep,
        tossResult,
        setTossResult,
        setPlayer,
        disconnectSocket,
        searchFriend,
        friendFound,
        sendRequest,
        setFriendFound,
        getAllSentFriendRequests,
        sentFriendRequests,
        setSentFriendRequests,
        getIncomingRequests,
        incomingRequests,setIncomingRequests,
        loading,
        acceptRequest,
        ignoreRequest,
        getMyFriendList,
        friendList,
        deleteMyRequest,
        handleFriendChallange,
        liveRequest,
        setLiveRequest,
        acceptLiveInvite,
        rejectLiveInvite,
        roomtype,
        setroomtype,
        friendinfo,
        setFriendInfo

      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataState;
