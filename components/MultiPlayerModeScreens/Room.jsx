import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import {DataContext} from '../context/Data';
import Toss from './Toss';
import QRCode from 'react-native-qrcode-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {Image} from 'react-native';
import profile1 from '../assets/ttt1.jpg';
import profile2 from '../assets/ttt.jpg';
import stone from '../assets/tossImages/stone.png';
import AddFriend from '../Models/AddFriend';
import SentRequests from '../Models/SentRequests';
import ChallangeFriend from '../Models/ChallangeFriend';
import { FlatList } from 'react-native';
import ProfileImage from '../utils/ProfileImage';
import Seperator from '../utils/Seperator';
import CustomButton from '../elements/CustomButton';
import socket from '../context/socket';

const Room = ({visible, setMultiplayer, navigation}) => {
  const DeviceBackCamera = useCameraDevice('back');
  const {localRoomId, createRoom, step, handleJoin, tossResult, error,getMyFriendList,friendList,loading:DataLoading,disconnectSocket,roomtype} =
  useContext(DataContext);
  const [roomType, setRoomType] = useState(roomtype);
    
    const [challange,setChallange] = useState(false);
  const [localScreenRoomId, setLocalScreenRoomId] = useState(localRoomId);
  const [addFriend,setAddFriend] = useState(false);
  const [sentReq,setSentReq] = useState(false);
  const [disconnectMsg,setDisconnectMsg] = useState('');
 
  const [enteredid, setEnteredid] = useState('');
  const [cam, setCam] = useState(false);
  const onShare = async () => {
    try {
      await Share.share({
        message: `Your Tic Tac Toe Room Id is: *${localScreenRoomId}}*`,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      setEnteredid(codes[0].value);
      handleJoin(codes[0].value);
      setCam(false);
    },
  });
  const checkPermission = async () => {
    const permission = Camera.getCameraPermissionStatus();
    if (permission !== 'granted') {
      let ask = await Camera.requestCameraPermission();
      if (ask === 'granted') return true;
      return false;
    }
  };
  const useDeviceCamera = async () => {
    if (roomType === 'join' && checkPermission()) {
      setCam(true);
    }
  };
  const goBack = () => {
    if (roomType === 'create' || roomType === 'join') {
      setRoomType('');
    } else {
      setMultiplayer(false);
     
    }
    setDisconnectMsg('');
  };
  const EmitPlayerLeft = ()=>{
    socket.emit('PlayerLeft');
  } 

  
  const cancelToss = ()=>{
    setMultiplayer(false);
    setDisconnectMsg('');
    if(!disconnectMsg){
      EmitPlayerLeft();
    }

  }
  useEffect(() => {
    if (step === 'game') {
      navigation.navigate('Game', {
        roomId: localRoomId,
        player: tossResult,
        roomType:roomType?roomType:roomtype,
      });
      setMultiplayer(false);
    }
    getMyFriendList();
    const OnPlayerLeft = (msg)=>{
      // console.log(msg+"player gone..");
      setDisconnectMsg(msg)
    } 
    socket.on('listenPlayerLeft', OnPlayerLeft);
    return ()=>{
      socket.off('listenPlayerLeft', OnPlayerLeft);
    }
  }, [step]);
  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setMultiplayer(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Multiplayer Mode</Text>
            {cam && (
              <Modal visible={cam} transparent>
                <View
                  style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 300,
                      width: 300,
                      backgroundColor: 'white',
                      marginTop: '0%',
                      borderWidth: 4,
                      borderColor: 'white',
                    }}>
                    <Camera
                      style={{
                        height: '100%',
                        width: '100%',
                        borderColor: 'white',
                      }}
                      device={DeviceBackCamera}
                      codeScanner={codeScanner}
                      isActive={cam}
                    />
                  </View>
                  <TouchableOpacity
                    style={{
                      padding: 20,
                      backgroundColor: 'rgb(116, 82, 211)',
                      borderRadius: 14,
                      borderWidth: 2,
                      borderColor: 'rgb(63, 11, 232)',
                    }}
                    onPress={() => {
                      setCam(false);
                    }}>
                    <Text
                      style={{fontSize: 18, fontWeight: '800', color: 'white'}}>
                      Go Back
                    </Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            )}
            {roomType === '' && step !== 'toss'&& (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 30,
                    marginBottom: 20,
                    marginTop: 20,
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'rgb(197, 116, 29)',
                      borderRadius: 9,
                      borderWidth: 2,
                      borderColor: 'yellow',
                    }}
                    onPress={() => {
                      setRoomType('create');
                      createRoom(navigation);
                    }}>
                    <Text
                      style={[
                        {
                          color: 'white',
                          padding: 15,
                          fontWeight: '700',
                          fontSize: 18,
                        },
                      ]}>
                      Create Room
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'rgb(29, 46, 197)',
                      borderRadius: 9,
                      borderWidth: 2,
                      borderColor: 'cyan',
                    }}
                    onPress={() => {
                      setRoomType('join');
                    }}>
                    <Text
                      style={[
                        {
                          color: 'white',
                          padding: 15,
                          fontWeight: '700',
                          fontSize: 18,
                        },
                      ]}>
                      Join Room
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    borderRadius: 4,
                    flexDirection:"row",justifyContent:"center",alignItems:"center",gap:4,
                     
                  }}>
                  <View style={{padding:5,borderWidth:1,borderColor:"white",backgroundColor: 'rgba(61, 63, 74, 0.62)',width:"40%",}}>
                  <TouchableOpacity onPress={()=>setChallange(true)}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 14.5,
                        marginVertical: 3,
                        textAlign: 'center',
                      }}>
                      My Friends
                        <Seperator color={"rgba(235, 169, 14, 0.42)"}/>
                    </Text>
                   
                      {/* <View style={{flexDirection: 'row', gap: 2}}> */}
                        <FlatList 
                        data={friendList}
                        ListEmptyComponent={<Text style={{fontSize:12,textAlign:'center',color:"rgba(255, 255, 255, 0.65)"}}>No friends found.</Text>}
                        horizontal
                        contentContainerStyle={{height:33,gap:1}}
                        renderItem={({item})=>(
                        // <Image
                        //   source={profile2}
                        //   style={{
                        //     height: 30,
                        //     width: 30,
                        //     borderRadius: 4,
                        //     borderWidth: 1,
                        //     borderColor: 'white',
                        //     opacity: item.status==="inactive" ? 0.4 : 1, // if friend offline
                        //   }}
                        // />
                        <ProfileImage  source={item?.profile} size={3} isactive={item.status==="active"}/>
                        )}
                        />
                        
                      {/* </View> */}
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={()=>setAddFriend(true)} style={{backgroundColor:"rgba(65, 53, 58, 0.72)",paddingHorizontal:10,paddingVertical:17,borderWidth:1,borderColor:"white"}}>
                    <MaterialCommunityIcons name="account-search-outline" size={33} color={'white'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>setSentReq(true)} style={{backgroundColor:"rgba(65, 53, 58, 0.72)",paddingHorizontal:10,paddingVertical:17,borderWidth:1,borderColor:"white"}}>
                    <AntDesign name="addusergroup" size={33} color={'white'} />
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={()=>setChallange(true)} style={{backgroundColor:"rgba(65, 53, 58, 0.72)",paddingHorizontal:10,paddingVertical:20,borderWidth:1,borderColor:"white"}}>
                    <Faw5 name="user-friends" size={25} color={'white'} />
                  </TouchableOpacity> */}
                </View>
                <AddFriend visible={addFriend} setvisible={setAddFriend}/>
                <SentRequests visible={sentReq} setvisible={setSentReq}/>
                <ChallangeFriend visible={challange} setvisible={setChallange} />
              </>
            )}
            {roomType === 'create' && step !== 'toss'&&(
              <>
                <Text selectable style={styles.roomidtext}>
                  Your Room ID is :
                </Text>
                <TouchableOpacity
                  onPress={onShare}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'black',
                    borderRadius: 12,
                    padding: 4,
                  }}>
                  <Text
                    selectable
                    style={{
                      fontSize: 25,
                      padding: 10,
                      color: 'white',
                      fontWeight: '800',
                    }}>
                    {localRoomId ? (
                      localRoomId
                    ) : (
                      <ActivityIndicator
                        style={{marginTop: 10}}
                        size={20}
                        color={'rgb(111, 22, 255)'}
                      />
                    )}
                  </Text>
                  <Icon color="red" name="share" size={30} />
                </TouchableOpacity>
                <View
                  style={{borderColor: 'white', borderWidth: 3, marginTop: 20}}>
                  {localRoomId ? (
                    <QRCode
                      value={localRoomId}
                      backgroundColor="white"
                      color="black"
                    />
                  ) : (
                    <ActivityIndicator
                      style={{marginTop: 10}}
                      size={20}
                      color={'rgb(111, 22, 255)'}
                    />
                  )}
                </View>
                {/* <Text style={{fontSize: 17, marginTop: 20, fontWeight: '600'}}>
                  {step === 'toss' && !disconnectMsg
                    ? 'Player Joined Successfully.'
                    : disconnectMsg?disconnectMsg:`Waiting for other Player to join...`}

                </Text> */}
                {step !== 'toss' && (
                  <ActivityIndicator
                    style={{marginTop: 10}}
                    size={20}
                    color={'rgb(111, 22, 255)'}
                  />
                )}
              </>
            )}
            {roomType === 'join' && step !== 'toss' && (
              <>
                <Text selectable style={styles.roomidtext}>
                  Enter your Room ID to join
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor: 'rgb(232, 244, 12)',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    borderWidth: 2,
                    borderRadius: 12,
                    padding: 3,
                  }}>
                  <TextInput
                    value={enteredid}
                    onChangeText={text => setEnteredid(text)}
                    placeholder="Enter Your Room ID"
                    placeholderTextColor={'white'}
                    keyboardAppearance="dark"
                    enterKeyHint="enter room id"
                    style={{
                      textTransform: 'uppercase',
                      height: 45,
                      width: '80%',
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: '400',
                    }}
                  />
                  <TouchableOpacity onPress={() => useDeviceCamera()}>
                    <Ionicons
                      name="qr-code-outline"
                      color={'white'}
                      size={20}
                      style={{
                        backgroundColor: 'black',
                        padding: 10,
                        borderRadius: 20,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                {error && (
                  <View>
                    <Text
                      style={{
                        color: 'red',
                        marginTop: 10,
                        fontWeight: '700',
                        fontSize: 18,
                      }}>
                      {error}
                    </Text>
                  </View>
                )}
                {step !== 'toss' && (
                  <TouchableOpacity
                    onPress={() => {
                      handleJoin(enteredid.toUpperCase());
                      setEnteredid('');
                    }}
                    style={[
                      styles.modalButton,
                      {
                        backgroundColor: 'rgb(6, 55, 233)',
                        borderRadius: 25,
                        borderWidth: 2,
                        borderColor: 'rgb(166, 249, 239)',
                        marginTop: 20,
                      },
                    ]}>
                    <Text
                      style={{color: 'white', fontWeight: '700', fontSize: 18}}>
                      Join Room
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            {step === 'toss' && <Toss roomId={localRoomId} disconnectMsg={disconnectMsg}/>
                 }

            <TouchableOpacity
              style={[
                styles.modalButton,
                {
                  backgroundColor: 'rgb(233, 6, 82)',
                  borderRadius: 25,
                  borderWidth: 3,
                  borderColor: 'rgb(231, 183, 236)',
                  marginTop: 10,
                },
              ]}
              onPress={step==="toss" && EmitPlayerLeft ?cancelToss:goBack}>
              <Text style={{color: 'white', fontWeight: '700', fontSize: 18}}>
                {roomType === 'create' || roomType === 'join'
                  ? 'Go Back'
                  : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Room;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(39, 213, 109, 0.8)',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
  },
  roomidtext: {
    fontSize: 18,
    fontWeight: '700',
    padding: 9,
    textAlign: 'center',
    color: 'black',
  },
});
