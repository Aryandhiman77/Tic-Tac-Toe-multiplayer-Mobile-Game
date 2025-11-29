import React, { useContext, useEffect, useState } from 'react';
import {StyleSheet, Text, TouchableOpacity, SafeAreaView, View, ActivityIndicator} from 'react-native';
import Background from '../component/Background';
import Room from '../MultiPlayerModeScreens/Room';
import { DataContext } from '../context/Data';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/Auth';
import { useToast } from "react-native-toast-notifications";
import Profile from '../Models/Profile';
import SlidingLiveInvitation from '../Models/SlidingLiveInvitation';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';


const GameType = ({navigation}) => {
  const toast =useToast() ;
    const [multiplayer,setMultiplayer] = useState(false);
    const {setLocalRoomId,setStep,setTossResult} = useContext(DataContext);
    const {logout,loading}  = useContext(AuthContext);
    const [profileModal,setProfileModal] = useState(false);
    
    useEffect(()=>{
      
        setLocalRoomId('')
        setStep('')
        setTossResult('')
       
    },[multiplayer])
  return (
    <>
    <Background/>
    
    {
    !loading
    ?(
      <>
      <SafeAreaView
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '60%',
        width: '100%',
      }}>
      <Text style={styles.heading}>Select Mode</Text>
      <View>
        <TouchableOpacity onPress={()=>navigation.navigate("Home")} style={[styles.btns,{backgroundColor:"rgb(213, 162, 20)",borderColor:"yellow"}]}>
          <Text style={styles.centerbtns}>Play Offline</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setMultiplayer(true)} style={[styles.btns,{backgroundColor:"rgb(43, 169, 178)",borderColor:"cyan"}]}>
          <Text style={styles.centerbtns}>Online Multiplayer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>toast.show("AI mode will be available soon.")} style={[styles.btns,{backgroundColor:"rgb(197, 29, 133)",borderColor:"red"}]}>
          <Text style={styles.centerbtns}>Play with AI</Text>
        </TouchableOpacity>
      </View>
     
    </SafeAreaView>
    <TouchableOpacity onPress={()=>setProfileModal(true)} style={[{backgroundColor:"rgb(103, 17, 179)",borderWidth:2,borderColor:"rgb(188, 125, 243)",position:"absolute",bottom:100,right:10,padding:20,borderRadius:40}]}>
          {/* <Text style={styles.centerbtns}>Logout</Text> */}
          <FontAwesome6Icon size={30} color={"white"} name='id-card'/>
          <Profile visible={profileModal} setVisible={setProfileModal} />
    </TouchableOpacity>
    <TouchableOpacity onPress={logout} style={[{backgroundColor:"rgb(236, 88, 38)",borderWidth:2,borderColor:"rgb(238, 197, 162)",position:"absolute",bottom:20,right:10,padding:20,borderRadius:40}]}>
          {/* <Text style={styles.centerbtns}>Logout</Text> */}
          <Icon size={30} color={"white"} name='logout'/>
    </TouchableOpacity>
    <Room visible={multiplayer} setMultiplayer={setMultiplayer} navigation={navigation}/>
    </>
    ):(
      <ActivityIndicator size={40} color={"black"}/>
    )
    } 
    
      <SlidingLiveInvitation setMultiplayer={setMultiplayer} />
    
    </>
  );
};

export default GameType;

const styles = StyleSheet.create({
  btns: {
    padding: 12,
    padding:20,
    marginTop:20,
    borderRadius:40,
    borderWidth:2,
    paddingRight:50,
    paddingLeft:50
    
  },
  centerbtns:{
    textAlign:"center",
    color:"white",
    fontWeight:'700',
    fontSize:20
  },
  heading:{
    fontSize:40,
    fontWeight:"bold",
    color:"rgb(253, 243, 49)",
    padding:30,
    textShadowColor:"rgb(17, 20, 14)",
    textShadowRadius:5,
    textShadowOffset:50
  }
  ,
  
});
