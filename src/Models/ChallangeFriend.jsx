import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import CustomButton from '../elements/CustomButton';
import {DataContext} from '../context/Data';
import Seperator from '../utils/Seperator';
import socket from '../context/socket';
import ProfileImage from '../utils/ProfileImage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HourGlassLoader from '../utils/HourGlassLoader';
import Clipboard from '@react-native-clipboard/clipboard';
import { useToast } from 'react-native-toast-notifications';
const ChallangeFriend = ({visible, setvisible}) => {
  const {getMyFriendList, friendList, loading, handleFriendChallange} =
    useContext(DataContext);
    const timeoutref = useRef(null);
    const toast = useToast();
    const handleCopy = str => {
        Clipboard.setString(str);
        toast.show('Copied to clipboard');
      };
  const [isChallangingGameid, setChallangingGameid] = useState(undefined);

  const setChallangingEnabled = (gameid) => {
    setChallangingGameid(gameid);
    timeoutref.current = setTimeout(() => {
      setChallangingGameid(undefined);
    }, 10000);
  };

  useEffect(() => {
    getMyFriendList();
    console.log(friendList);
    socket.on('getOnlineStatus');
    return ()=>{
      socket.off('getOnlineStatus');
      clearTimeout(timeoutref.current);
    }
  }, []);
  return (
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
            height: 320,
            alignItems: 'center',
            gap: 20,
            borderWidth: 2,
            borderColor: 'rgb(71, 125, 232)',
          }}>
          <Text style={styles.heading}>My Friends</Text>

          <>
            {loading ? (
              <ActivityIndicator size={4} color={'rgb(224, 247, 18)'} />
            ) : (
              <FlatList
                data={friendList}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      alignItems: 'center',
                      height: 150,
                      justifyContent: 'center',
                    }}>
                    <FontAwesome5
                      name="user-friends"
                      size={100}
                      color={'white'}
                      style={{opacity: 0.5}}
                    />
                    <Text
                      style={{
                        color: 'rgba(255, 254, 254, 0.6)',
                        fontWeight: 'bold',
                      }}>
                      No Friends found.
                    </Text>
                  </View>
                )}
                keyExtractor={(item, i) => i}
                renderItem={({item}) => (
                  <View
                    style={{
                      borderColor: 'rgb(234, 224, 244)',
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      paddingVertical:4
                    }}>
                    <View>
                      {/* <Text>{JSON.stringify(item?.friendDetails)}</Text> */}
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 5,
                          gap: 10,
                          opacity: item.status === 'inactive' ? 0.4 : 1,
                        }}>
                        <View>
                          <ProfileImage source={item?.profile} size={2} />
                        </View>
                        <View style={{paddingHorizontal: 0}}>
                          <Text
                            onPress={() => handleCopy(item?.username)}
                            style={{
                              fontWeight: 'bold',
                              fontSize: 12,
                              color: 'white',
                              width:100
                            }}>
                            {/* {JSON.stringify(item)} */}
                            {item?.username}
                          </Text>
                          <Seperator color={'orange'} />
                          <Text
                            onPress={() =>
                              handleCopy(item?.gameid)
                            }
                            style={{
                              fontWeight: 'bold',
                              fontSize: 12,
                              color: 'white',
                            }}>
                            {item?.gameid}
                            {/* 238382392 */}
                          </Text>

                          <Seperator color={'orange'} />
                        </View>
                        <View
                          style={{
                            // gap: 50,
                            justifyContent: 'space-around',
                          }}>
                          <CustomButton
                            disabled={
                              item.status === 'inactive' || isChallangingGameid===item?.gameid
                            }
                            disabledOpacity={0.9}
                            onPress={() => {
                              handleFriendChallange(item?.gameid);
                              setChallangingEnabled(item?.gameid);
                            }}
                            title={isChallangingGameid!=item?.gameid && 'Challenge'}
                            borderRadius={12}
                            fontSize={12}
                            bg={'rgb(255, 140, 0)'}
                            icon={
                              isChallangingGameid===item?.gameid && (
                               <HourGlassLoader color={'black'} isloading={isChallangingGameid} />
                              )
                            }
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              />
            )}
          </>
          <CustomButton
            onPress={() => setvisible(false)}
            title={'Close'}
            borderRadius={12}
            bg={'rgb(231, 76, 125)'}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ChallangeFriend;

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
