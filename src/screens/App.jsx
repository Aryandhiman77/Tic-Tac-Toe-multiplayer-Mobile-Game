import React from 'react';
import AppNavi from '../Navigation/AppNavi';
import AuthState from '../context/Auth';
import DataState from '../context/Data';
import { ToastProvider } from 'react-native-toast-notifications';
import Game from '../MultiPlayerModeScreens/Game';

const App = () => {
  return (
    <ToastProvider>
      <AuthState>
        <DataState>
          <AppNavi />
        </DataState>
      </AuthState>
    </ToastProvider>
    // <>
    // <Toss/>
    // </>
  );
};

export default App;
