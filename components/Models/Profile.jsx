import {Image, Modal, SafeAreaView, StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../context/Auth';
import CustomButton from '../elements/CustomButton';
import profile from '../assets/ttt.jpg';
import Seperator from '../utils/Seperator';
import Clipboard from '@react-native-clipboard/clipboard';
import {useToast} from 'react-native-toast-notifications';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileImage from '../utils/ProfileImage';
import {launchImageLibrary} from 'react-native-image-picker';
import { baseurl } from '../config/appConfig';
const Profile = ({visible, setVisible}) => {
  const {userinfo,uploadProfile} = useContext(AuthContext);
  const toast = useToast();
  const [imageUrl,setImageUrl] =useState(userinfo?.profile);
  const handleCopy = str => {
    Clipboard.setString(str);
    toast.show('Copied to clipboard');
  };
  const chooseImage = async () => {
    console.log('choosing file');
    const result = await launchImageLibrary({
      mediaType: 'photo',
      videoQuality: 'high',
      selectionLimit: 1,
      maxHeight:500,
      maxWidth:500
    });
    if(result.assets.length > 0){
      setImageUrl(result.assets[0].uri);
      uploadProfile({photo:result.assets[0]})
    }else{
      console.log(result);
    }
  };
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(20, 3, 3, 0.48)',
        }}>
        <View
          style={{
            backgroundColor: 'rgba(5, 24, 61, 0.82)',
            paddingTop: 20,
            borderRadius: 12,
            paddingHorizontal: 20,
            // width: '80%',
            alignItems: 'center',
            gap: 15,
            borderWidth: 1,
            borderColor: 'gold',
            shadowColor: 'gold',
            shadowOffset: 1,
            shadowRadius: 10,
            shadowOpacity: 1,
          }}>
          <Text style={styles.heading}>Profile</Text>
          <View style={{gap: 10, flexDirection: 'row'}}>
            <View style={{borderWidth: 2, borderColor: 'white'}}>
              {/* <Image source={profile} style={{height: 65, width: 60}} /> */}
              <TouchableOpacity onPress={chooseImage}>
                <ProfileImage source={imageUrl} />
              </TouchableOpacity>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text style={{textTransform: 'capitalize', color: 'white'}}>
                Username:{' '}
                <Text
                  style={{fontWeight: 'bold'}}
                  onPress={() => handleCopy(userinfo.username)}>
                  {userinfo.username}{' '}
                </Text>
                <Ionicons
                  name="copy"
                  size={15}
                  style={{paddingHorizontal: 4}}
                  color={'rgb(122,222,111)'}
                />
              </Text>
              <Seperator color={'orange'} />
              <Text style={{color: 'white'}}>
                ID:{' '}
                <Text
                  onPress={() => handleCopy(userinfo.userid)}
                  style={{fontWeight: 'bold'}}>
                  {userinfo.userid}{' '}
                </Text>
                <Ionicons
                  name="copy"
                  size={15}
                  style={{paddingHorizontal: 4}}
                  color={'rgb(122,222,111)'}
                />
              </Text>

              <Seperator color={'orange'} />
            </View>
          </View>
          <CustomButton
            onPress={() => {setVisible(false);setImageUrl(userinfo?.profile)}}
            title={'Close'}
            borderRadius={12}
            bg={'rgb(76, 118, 231)'}
          />
        </View>
      </View>
    </Modal>
  );
};

export default Profile;

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(253, 243, 49)',
    textShadowColor: 'rgb(17, 20, 14)',
    textShadowRadius: 5,
    textShadowOffset: 50,
  },
});
