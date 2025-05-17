import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import goldFrame from '../assets/goldFrame.png'
import { baseurl } from '../config/appConfig';
const ProfileImage = ({source,size=null,isactive=null}) => {
  return (
    size===1 || !size? // largest
    <>
      <View style={{shadowColor:"orange",shadowOffset:1,shadowRadius:10,shadowOpacity:1}}>
        <Image style={styles.Image1} source={{uri:source.includes(`file://`)?source:baseurl+source}}/>
        <Image style={styles.frame1} source={goldFrame} />
      </View>
    </>
    :  size===2? // medium for list
    <>
      <View style={{shadowColor:"orange",shadowOffset:1,shadowRadius:10,shadowOpacity:1}}>
        <Image style={styles.Image2} source={{uri:baseurl+source}}/>
        <Image style={styles.frame2} source={goldFrame} />
      </View>
    </>
    : // smallest for friend online/offline Flatlist
    <> 
      <View style={{opacity:!isactive?0.4:1}}>
        <Image style={styles.Image3} source={{uri:baseurl+source}}/>
        <Image style={styles.frame3} source={goldFrame} />
      </View>
    </>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({
  Image1: {
    height: 60,
    width: 60,
  },
  frame1:{
    height:93,
    width:90,
    position:"absolute",
    top:-13,
    left:-15,
  },
  Image2: {
    height: 50,
    width: 50,
  },
  frame2:{
    height:80,
    width:80,
    position:"absolute",
    top:-13,
    left:-15
  },
  Image3: {
    height: 32,
    width: 33,
  },
  frame3:{
    height:45,
    width:45,
    position:"absolute",
    top:-5,
    left:-6,
    // elevation:5,
  },
});
