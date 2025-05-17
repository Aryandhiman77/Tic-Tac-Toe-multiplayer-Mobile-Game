import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home';
import GameType from '../screens/GameType';
import Game from '../MultiPlayerModeScreens/Game';
import Chat from '../MultiPlayerModeScreens/Chat';
const Stack = createNativeStackNavigator();
const HomeStack = () => {
    
  return (
   <Stack.Navigator initialRouteName='GameType'>
    
     <Stack.Screen
        name="GameType"
        component={GameType}
        options={{
          headerShown: false,
        }}
      />
     <Stack.Screen
        name="Game"
        component={Game}
        options={{
          headerShown: false,
        }}
      />

     <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          headerShown: false, 
        }}
      />
     
      
     <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
   </Stack.Navigator>
  )
}

export default HomeStack

const styles = StyleSheet.create({})