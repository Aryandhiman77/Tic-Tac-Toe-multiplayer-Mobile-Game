import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import CustomButton from '../elements/CustomButton';
import Seperator from '../utils/Seperator';
import FaW6 from 'react-native-vector-icons/FontAwesome6';
import image from '../assets/ttt.jpg';
import {DataContext} from '../context/Data';
import {useToast} from 'react-native-toast-notifications';
import Clipboard from '@react-native-clipboard/clipboard';
import Entypo from 'react-native-vector-icons/Entypo';

const SentRequests = ({visible, setvisible}) => { // contains incoming and outgoing friend requests.
  const {
    getAllSentFriendRequests,
    sentFriendRequests,
    getIncomingRequests,
    incomingRequests,
    loading,
    acceptRequest,
    ignoreRequest,
    deleteMyRequest
  } = useContext(DataContext);
  const [reqType, setReqType] = useState('incoming');
  const toast = useToast();
  const handleCopy = str => {
    Clipboard.setString(str);
    toast.show('Copied to clipboard');
  };

  useEffect(() => {
    getAllSentFriendRequests();
    getIncomingRequests();
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
            backgroundColor: 'rgba(30, 97, 198, 0.93)',
            // paddingTop: 20,
            borderRadius: 12,
            // paddingHorizontal: 20,
            width: '90%',
            // gap: 15,
            borderWidth: 2,
            borderColor: 'rgb(71, 125, 232)',
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity
              style={{width: '50%'}}
              onPress={() => setReqType('incoming')}>
              <Text
                style={{
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor:
                    reqType === 'incoming'
                      ? 'rgb(203, 8, 164)'
                      : 'rgba(203, 8, 164,0.2)',
                  padding: 5,
                  paddingVertical: 20,
                  borderTopLeftRadius: 10,
                  borderRightWidth: 1,
                  borderRightColor: 'white',
                  borderBottomColor: 'white',
                  borderBottomWidth: 1,
                  textAlign: 'center',
                  alignItems: 'center',
                }}>
                Incoming Requests
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{width: '50%'}}
              onPress={() => setReqType('pending')}>
              <Text
                style={{
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor:
                    reqType === 'pending'
                      ? 'rgb(203, 8, 164)'
                      : 'rgba(203, 8, 164,0.2)',
                  padding: 5,
                  paddingVertical: 20,
                  borderTopRightRadius: 10,
                  borderBottomColor: 'white',
                  borderBottomWidth: 1,
                  textAlign: 'center',
                  alignItems: 'center',
                }}>
                Pending Requests
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 165,
              width: '100%',
              marginVertical: 10,
              justifyContent: 'center',
            }}>
            {loading ? (
              <ActivityIndicator size={4} color={'rgb(224, 247, 18)'} />
            ) : reqType === 'incoming' ? (
              <FlatList
                data={incomingRequests}
                contentContainerStyle={{justifyContent:"center"}}
                ListEmptyComponent={()=>
                  <View style={{alignItems:"center",height:150,justifyContent:"center"}}>
                    <Entypo name='add-user' size={100} color={"white"} style={{opacity:0.5}}/>
                    <Text style={{color:"rgba(255, 254, 254, 0.6)",fontWeight:"bold"}}>No Incoming Requests.</Text>
                  </View>
                    } 
                keyExtractor={(item, i) => i}
                renderItem={({item}) => (
                  <View
                    style={{borderColor: 'rgb(234, 224, 244)', borderTopWidth:1,borderBottomWidth:1}}>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent:"space-around",
                          alignItems: 'center',
                          padding: 5,
                        }}>
                        <View>
                          <Image
                            source={image}
                            style={{height: 55, width: 50}}
                          />
                        </View>
                        <View style={{paddingHorizontal: 0}}>
                          <Text
                            onPress={() =>
                              handleCopy(item?.friendDetails?.username)
                            }
                            style={{
                              fontWeight: 'bold',
                              fontSize: 16,
                              color: 'white',
                            }}>
                            {/* {JSON.stringify(item.friendDetails)} */}
                            {/* aryan walia */}
                            {item?.friendDetails.username}
                          </Text>
                          <Seperator />
                          <Text
                            onPress={() =>
                              handleCopy(item?.friendDetails?.gameid)
                            }
                            style={{
                              fontWeight: 'bold',
                              fontSize: 16,
                              color: 'white',
                            }}>
                            {item?.friendDetails?.gameid}
                            {/* 238382392 */}
                          </Text>
                          <Seperator />
                        </View>
                        <View
                      style={{
                        flexDirection: 'row',
                        gap: 30,
                        justifyContent: 'center',
                        paddingHorizontal:12
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          acceptRequest(item?.friendDetails?.gameid);
                        }}
                        style={{
                          backgroundColor: 'rgb(93, 166, 10)',
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: 'white',
                        }}>
                        <Entypo name='check' size={40} color={"white"}/>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                        ignoreRequest(item?.friendDetails?.gameid);
                        }}
                        style={{
                          backgroundColor: 'rgb(219, 60, 25)',
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: 'white',
                        }}>
                        
                         <Entypo name='cross' size={40} color={"white"}/>
                      </TouchableOpacity>
                    </View>
                      </View>
                    </View>                    
                  </View>
                )}
              />
            ) : (
              <FlatList
                data={sentFriendRequests}
                ListEmptyComponent={()=>
                  <View style={{alignItems:"center",height:150,justifyContent:"center"}}>
                    <FaW6 name='user-clock' size={100} color={"white"} style={{opacity:0.5}}/>
                    <Text style={{color:"rgba(255, 254, 254, 0.6)",fontWeight:"bold"}}>No Pending Requests.</Text>
                  </View>
                    } 
                keyExtractor={(item, i) => i}
                ItemSeparatorComponent={<Seperator />}
                renderItem={({item}) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent:"center",
                      gap: 10,
                      borderColor: 'rgb(133, 41, 232)',
                      borderWidth: 2,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 20,
                        alignItems: 'center',
                        padding: 5,
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
                         onPress={() =>
                            handleCopy(item?.friendDetails?.username)
                          }
                          style={{
                            fontWeight: 'bold',
                            fontSize: 16,
                            color: 'white',
                          }}>
                          {/* {JSON.stringify(item.friendDetails)} */}
                          {/* aryan walia */}
                          {item?.friendDetails.username}
                        </Text>
                        <Seperator />
                        <Text
                         onPress={() =>
                            handleCopy(item?.friendDetails?.username)
                          }
                          style={{
                            fontWeight: 'bold',
                            fontSize: 16,
                            color: 'white',
                          }}>
                          {item?.friendDetails.gameid}
                          {/* 238382392 */}
                        </Text>
                        <Seperator />
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        deleteMyRequest(item?.friendDetails?.gameid)
                      }}
                      style={{
                        backgroundColor: 'rgb(138, 52, 230)',
                        padding: 20,
                        borderLeftColor: 'rgb(223, 152, 249)',
                        borderLeftWidth: 1,
                      }}>
                      <FaW6 name="trash" size={25} color={'white'} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
          <View style={{alignItems: 'center'}}>
            <CustomButton
              onPress={() => {
                setvisible(false);
              }}
              title={'Close'}
              borderRadius={12}
              bg={'rgb(231, 76, 125)'}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SentRequests;

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

// {
//     loading ? <ActivityIndicator /> :
//     <>
//     <Text style={styles.heading}>Requested : {sentFriendRequests?.length}</Text>
//     <View
//       style={{
//         gap: 10,
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderColor: 'white',
//         borderRadius: 12,
//       }}>
//       {/* ==== body */}
//

//     </View>
//     <Seperator />
//
//     </>
//     }
