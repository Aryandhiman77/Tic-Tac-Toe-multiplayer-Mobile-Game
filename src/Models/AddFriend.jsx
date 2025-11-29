import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import CustomButton from '../elements/CustomButton';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DataContext} from '../context/Data';
import image from '../assets/ttt.jpg';
import Seperator from '../utils/Seperator';
import FaW6 from 'react-native-vector-icons/FontAwesome6';

const AddFriend = ({visible, setvisible}) => {
  const {searchFriend, friendFound, sendRequest, setFriendFound} =
    useContext(DataContext);
  const [input, setinput] = useState('');
useEffect(()=>{
    setFriendFound();
},[visible])
  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            //   backgroundColor: 'rgba(20, 3, 3, 0.64)',
          }}>
          <View
            style={{
              backgroundColor: 'rgba(21, 83, 209, 0.93)',
              paddingTop: 20,
              borderRadius: 12,
              paddingHorizontal: 20,
              width: '90%',
              alignItems: 'center',
              gap: 15,
              borderWidth: 2,
              borderColor: 'rgb(71, 125, 232)',
            }}>
            <Text style={styles.heading}>Add Friend</Text>
            <View
              style={{
                gap: 10,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'white',
                borderRadius: 12,
              }}>
              <TextInput
                style={{
                  padding: 2,
                  width: 180,
                  height: 40,
                  textAlign: 'center',
                  color: 'white',
                }}
                placeholder="Enter TicTacToe ID"
                placeholderTextColor={'gray'}
                keyboardType="numeric"
                keyboardAppearance="dark"
                maxLength={10}
                onChangeText={txt => setinput(txt)}
              />
              <TouchableOpacity
                onPress={() => searchFriend(input)}
                style={{
                  padding: 12,
                  backgroundColor: 'rgb(21, 140, 245)',
                  borderLeftColor: 'white',
                  borderLeftWidth: 1,
                  borderTopRightRadius: 12,
                  borderBottomRightRadius: 12,
                }}>
                <Ionicons size={25} color={'white'} name="account-search" />
              </TouchableOpacity>
            </View>
            <Seperator />
            {friendFound && (
              <>
                <View
                  style={{flexDirection: 'row',
                    alignItems:"center",
                    gap: 10,borderColor: 'rgb(242, 237, 247)', borderWidth: 2}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      padding:5
                    }}>
                    <View
                      style={{
                        borderRightColor: 'rgb(201, 86, 243)',
                        borderRightWidth: 2,
                      }}>
                      <Image source={image} style={{height: 55, width: 50}} />
                    </View>
                    <View style={{paddingHorizontal: 5}}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                          color: 'white',
                        }}>
                        {friendFound?.username}
                      </Text>
                      <Seperator />
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                          color: 'white',
                        }}>
                        {friendFound?.userid}
                      </Text>
                      <Seperator />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      sendRequest(friendFound?.userid);
                    }}
                    style={{
                      backgroundColor: 'rgb(138, 52, 230)',
                      padding: 20,
                      borderLeftColor: 'rgb(223, 152, 249)',
                      borderLeftWidth: 1,
                    }}>
                    <FaW6 name="user-plus" size={25} color={'white'} />
                  </TouchableOpacity>
                </View>
              </>
            )}

            <CustomButton
              onPress={() => setvisible(false)}
              title={'Close'}
              borderRadius={12}
              bg={'rgb(231, 76, 125)'}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AddFriend;

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
