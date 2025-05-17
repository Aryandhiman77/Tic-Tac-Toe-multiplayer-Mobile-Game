import { Modal, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState, useRef, useContext } from 'react';
import CustomButton from '../elements/CustomButton';
import ProfileImage from '../utils/ProfileImage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Seperator from '../utils/Seperator';
import { DataContext } from '../context/Data';
import { AuthContext } from '../context/Auth';
import { baseurl } from '../config/appConfig';

const LiveInvitation = ({ request,setMultiplayer}) => {
  const [reqTimeout, setReqTimeout] = useState(10);
  const {setLiveRequest,acceptLiveInvite,rejectLiveInvite} = useContext(DataContext);
  const {userinfo} = useContext(AuthContext);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (request) {
      setReqTimeout(10); // reset on new request
      intervalRef.current = setInterval(() => {
        setReqTimeout(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setLiveRequest(''); // dismiss modal
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current); // cleanup
  }, [request]);

  return (
    <Modal visible={!!request} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          padding: 40,
          backgroundColor: 'rgba(20, 3, 3, 0.48)',
        }}>
        <View
          style={{
            backgroundColor: 'rgba(5, 24, 61, 0.82)',
            paddingTop: 20,
            borderRadius: 12,
            paddingHorizontal: 20,
            alignItems: 'center',
            gap: 15,
            borderWidth: 1,
            borderColor: 'gold',
            shadowColor: 'gold',
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 10,
            shadowOpacity: 1,
            elevation: 8,
          }}>
          <Text style={styles.heading}>{reqTimeout}</Text>
          <View style={{ gap: 10, flexDirection: 'row' }}>
            <View style={{ borderWidth: 2, borderColor: 'white' }}>
              <ProfileImage size={2} source={baseurl+request?.profile} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ textTransform: 'capitalize', color: 'white' }}>
                Username:{' '}
                <Text style={{ fontWeight: 'bold' }}>{request?.username}</Text>
              </Text>
              <Seperator color="orange" />
              <Text style={{ color: 'white' }}>
                ID: <Text style={{ fontWeight: 'bold' }}>{request?.id}</Text>
              </Text>
              <Seperator color="orange" />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <CustomButton
            // onPress={()=>}
              icon={<Entypo name="cross" size={20} color="white" />}
              borderRadius={12}
              bg="rgb(189, 47, 4)"
              onPress={() => {
                clearInterval(intervalRef.current);
                rejectLiveInvite();
              }}
            />
            <CustomButton
              icon={<Entypo name="check" size={20} color="white" />}
              borderRadius={12}
              bg="rgb(43, 173, 4)"
              onPress={() => {
                clearInterval(intervalRef.current);
                // handle accept
                acceptLiveInvite(request?.id);
                setMultiplayer(true);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LiveInvitation;

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});
