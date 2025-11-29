import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useEffect, useRef, useState} from 'react';
import RequestApi from './HandleApi';
import {useToast} from 'react-native-toast-notifications';
import {success, danger, warning} from '../utils/ToastConfig';
import socket from './socket';
import {AppState} from 'react-native';

let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

export const AuthContext = createContext();
// const [errors,setErrors] = useState(new Array(10));
const AuthState = props => {
  const toast = useToast();
  const [userinfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(false);
  const appState = useRef(AppState.currentState);

  const Login = async data => {
    const {email, password} = data;
    const sendData = {
      email: email.toLowerCase(),
      password,
    };
    try {
      setLoading(true);
      if (email && password) {
        try {
          const response = await RequestApi('/auth/login', {...sendData},null,null,null,"POST",'application/json',true);
          if (response.success) {
            const {username, email, userid, profile} = response.data.user;
            const {authToken, refreshToken} = response.data;
            AsyncStorage.setItem(
              'user',
              JSON.stringify({
                username,
                email,
                authToken,
                refreshToken,
                userid,
                profile,
              }),
            );
            setUserInfo(username, email, authToken, refreshToken, profile);
            toast.show('Login successful.', success);
            console.log('Data saved in async storage.');
            setLoading(false);
          } else {
            toast.show(response.message, warning);
            setErrors([...errors, response.message]);
            setLoading(false);
          }
        } catch (error) {
          toast.show(error.toString(), danger);
          setLoading(false);
        }
        getLogin();
      } else {
        setLoading(false);
        toast.show('Please enter username and password', danger);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const signup = async data => {
    const {username, email, password} = data;
    setLoading(true);
    const sendData = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
    };
    try {
      const response = await RequestApi('/auth/register', {...sendData},null,null,null,"POST",'application/json',true);
      if (response.success) {
        const {username, email, userid, profile} = response.data.user;
        const {authToken, refreshToken} = response.data;
        AsyncStorage.setItem(
          'user',
          JSON.stringify({
            username,
            email,
            authToken,
            refreshToken,
            userid,
            profile,
          }),
        );
        toast.show('Registration successful.', success);
        console.log('Data saved in async storage.');
        getLogin();
        setLoading(false);
      } else {
        toast.show(response.message, warning);
        setErrors([...errors, response.message]);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.show(error.toString(), danger);
      setLoading(false);
    }
  };
  const getLogin = async () => {
    setLoading(true);
    const getuser = await AsyncStorage.getItem('user');
    if (getuser) {
      setUserInfo(JSON.parse(getuser));
      console.log('Login successful. ', getuser);
      setLoading(false);
      reconnectSocket();
    }
    setLoading(false);
  };
  const uploadProfile = async ({photo}) => {
    const data = new FormData();

    data.append('profile', {
      name: photo.fileName,
      filename: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });
    const upload = await RequestApi(
      '/user/profileUpload',
      data,
      userinfo?.authToken,
      userinfo?.refreshToken,
      renewTokens,
      'PATCH',
      false, // no content type due to image data.
      false,
    );

    if (upload.success) {
      console.log(upload);
      const {profile, ...rest} = JSON.parse(await AsyncStorage.getItem('user'));
      const setNewInfo = await AsyncStorage.setItem(
        'user',
        JSON.stringify({
          ...rest,
          profile: upload.data.uri,
        }),
      );
      setUserInfo(prev => ({
        ...prev,
        profile: upload.data.uri,
      }));
      toast.show(upload.data.message, success);
    } else {
      toast.show(upload.data.message, danger);
    }
  };
  const logout = async () => {
    setLoading(true);
    let {refreshToken} = JSON.parse(await AsyncStorage.getItem('user'));
    console.log(refreshToken)
    const response = await RequestApi('/auth/logout', {refreshToken},null,null,null,"POST",'application/json',true);
    if (response.success) {
      console.log(response.data);
      await AsyncStorage.removeItem('user');
      setUserInfo({});
      toast.show('Logout successful.', success);
      socket.disconnect();
      setLoading(false);
    } else {
      toast.show(response.message, warning);
      setLoading(false);
      // setErrors([...errors, response.message]);
    }
    // await AsyncStorage.removeItem('user');
    // console.log(userinfo);
  };
  const reconnectSocket = async () => {
    console.log('reconnecting socket..');
    let {authToken: newauthToken} = JSON.parse(
      await AsyncStorage.getItem('user'),
    );
    try {
      socket.io.opts.extraHeaders = {
        authorization: `Bearer ${newauthToken}`,
      };
      if (!socket.connected) {
        reconnectAttempts++;
        socket.connect();
        socket.on('connect', sktid => {
          reconnectAttempts = 0;
          socket.emit('updateStatus');
        });
      }
      if (reconnectAttempts === MAX_RECONNECT_ATTEMPTS) {
        return logout();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const renewTokens = async () => {
    console.log('after refreshing...');
    let {refreshToken, username, email, userid, profile} = JSON.parse(
      await AsyncStorage.getItem('user'),
    );

    const response = await RequestApi(
      '/auth/ref',
      {refreshToken},
      null, // authtoken
      null, // refreshtoken
      null, //tokenrefreshcallback
      null, // method
      'application/json',
      true
    );

    console.log('got token refresh response : ', response);

    if (response.success) {
      const {authToken, refreshToken: newRefreshToken} = response.data;
      console.log(
        'New auth token is : ' +
          authToken +
          '     ' +
          'new refresh token is: ' +
          newRefreshToken,
      );
      // Update user info in memory (correctly)
      setUserInfo(prev => ({
        ...prev,
        authToken,
        refreshToken: newRefreshToken,
      }));

      // Update AsyncStorage
      await AsyncStorage.setItem(
        'user',
        JSON.stringify({
          username,
          email,
          userid,
          authToken,
          refreshToken: newRefreshToken,
          profile,
        }),
      );
      console.log('new tokens saved in storage..');
      return true;
    } else {
      console.log(response.message);
    }
  };
  const forgotPassword = async email => {
    setLoading(true);
    const response = await RequestApi(
      '/auth/fgtpwd',
      {email},
      null,
      null,
      null,
      'PATCH',
    );
    console.log(response);
    if (response.success) {
      setLoading(false);
      return response?.data.message;
    } else {
      setLoading(false);
      return false;
    }
  };
  const resetPassword = async ({token, password}) => {
    console.log(token, password);
    setLoading(true);
    const response = await RequestApi(
      `/auth/resetPassword/${token}`,
      {password},
      null,
      null,
      null,
      'PATCH',
    );
    if (response.success) {
      setLoading(false);
      return response?.data.message;
    } else {
      setLoading(false);
      return false;
    }
  };
  useEffect(() => {
    if (status) {
      toast.show('You are online.', success);
    }
    const subscription = AppState.addEventListener('change', nextAppState => {
      const prevState = appState.current;
      appState.current = nextAppState;

      if (
        (prevState === 'background' || prevState === 'inactive') &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground — reconnecting socket...');
        if (socket.disconnected) {
          reconnectSocket(); // auto reconnect when app becomes active
        }
        if (socket.connected && toast.show !== undefined) {
          toast.show('You are online.', success);
        }
      }
    });

    getLogin();

    const handleAuthError = async err => {
      console.log('connection error :  ', err);
      if (err) {
        console.log(err);
        const success = await renewTokens();
        console.log(success);
        if (success) {
          reconnectSocket();
        }
      }
    };

    const handleUpdatedStatus = receivedstatus => {
      console.log('updatedStatus received:', receivedstatus);
      if (receivedstatus === 'online') {
        setStatus(true);
      }
    };

    socket.on('connect_error', handleAuthError);

    socket.on('auth_error', handleAuthError);
    socket.on('updatedStatus', handleUpdatedStatus);

    // Always cleanup listeners to avoid duplicates when component re-renders
    return () => {
      // socket.off('connect_error', handleConnectError);
      socket.off('connect');
      socket.off('connect_error');
      socket.off('updatedStatus', handleUpdatedStatus);
      subscription.remove();
    };
  }, [status, appState]);
  return (
    <AuthContext.Provider
      value={{
        getLogin,
        Login,
        loading,
        setLoading,
        signup,
        errors,
        userinfo,
        logout,
        renewTokens,
        reconnectSocket,
        forgotPassword,
        resetPassword,
        uploadProfile,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
