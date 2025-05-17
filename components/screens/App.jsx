
import React from 'react';
import AppNavi from '../Navigation/AppNavi';
import AuthState from '../context/Auth';
import DataState from '../context/Data';
import { ToastProvider } from 'react-native-toast-notifications'

const App = () => {
  return (
    <ToastProvider>
    <AuthState>
      <DataState>
        <AppNavi/>
        {/* <PlayerJoined/> */}
      </DataState>
    </AuthState>
    </ToastProvider>
    // <>
    // <Toss/>
    // </>
  );
};

export default App;

