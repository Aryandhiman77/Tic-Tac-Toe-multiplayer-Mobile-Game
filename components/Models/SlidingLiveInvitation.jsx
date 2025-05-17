// SlidingLiveInvitation.js
import {
    Animated,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
  } from 'react-native';
  import React, { useEffect, useState, useRef, useContext } from 'react';
  import CustomButton from '../elements/CustomButton';
  import ProfileImage from '../utils/ProfileImage';
  import Entypo from 'react-native-vector-icons/Entypo';
  import Seperator from '../utils/Seperator';
  import { DataContext } from '../context/Data';
import { baseurl } from '../config/appConfig';
  
  const SCREEN_WIDTH = Dimensions.get('window').width;
  
  const SlidingLiveInvitation = ({ setMultiplayer }) => {
    const { liveRequest: request, setLiveRequest, acceptLiveInvite, rejectLiveInvite } = useContext(DataContext);
    const [reqTimeout, setReqTimeout] = useState(10);
    const intervalRef = useRef(null);
    const isHandled = useRef(false);
    const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  
    useEffect(() => {
      if (request) {
        setReqTimeout(10);
        isHandled.current = false;
        clearInterval(intervalRef.current);
  
        intervalRef.current = setInterval(() => {
          setReqTimeout(prev => {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              if (!isHandled.current) {
                isHandled.current = true;
                setLiveRequest('');
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
  
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
  
      return () => clearInterval(intervalRef.current);
    }, [request]);
  
    const handleReject = () => {
      if (!isHandled.current) {
        isHandled.current = true;
        clearInterval(intervalRef.current);
        Animated.timing(slideAnim, {
          toValue: SCREEN_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setLiveRequest(''));
        rejectLiveInvite();
      }
    };
  
    const handleAccept = () => {
      if (!isHandled.current) {
        isHandled.current = true;
        clearInterval(intervalRef.current);
        Animated.timing(slideAnim, {
          toValue: SCREEN_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setLiveRequest('');
          acceptLiveInvite(request?.id);
          setMultiplayer(true);
        });
      }
    };
  
    if (!request) return null;
  
    return (
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateX: slideAnim }] },
        ]}>
        <View style={styles.card}>
          <Text style={styles.heading}>{reqTimeout}</Text>
          <View style={styles.profileRow}>
            <View style={styles.profileBorder}>
              <ProfileImage size={2} source={request?.profile}/>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.text}>
                Username: <Text style={styles.boldText}>{request?.username}</Text>
              </Text>
              <Seperator color="orange" />
              <Text style={styles.text}>
                ID: <Text style={styles.boldText}>{request?.id}</Text>
              </Text>
              <Seperator color="orange" />
            </View>
          </View>
          <View style={styles.buttonRow}>
            <CustomButton
              icon={<Entypo name="cross" size={20} color="white" />}
              borderRadius={12}
              bg="rgb(189, 47, 4)"
              onPress={handleReject}
            />
            <CustomButton
              icon={<Entypo name="check" size={20} color="white" />}
              borderRadius={12}
              bg="rgb(43, 173, 4)"
              onPress={handleAccept}
            />
          </View>
        </View>
      </Animated.View>
    );
  };
  
  export default SlidingLiveInvitation;
  
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 100,
      left: 0,
      zIndex: 999,
      padding: 20,
    },
    card: {
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
    },
    heading: {
      fontSize: 24,
      color: 'white',
      fontWeight: 'bold',
    },
    profileRow: {
      flexDirection: 'row',
      gap: 10,
    },
    profileBorder: {
      borderWidth: 2,
      borderColor: 'white',
    },
    text: {
      textTransform: 'capitalize',
      color: 'white',
    },
    boldText: {
      fontWeight: 'bold',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 10,
    },
  });
  