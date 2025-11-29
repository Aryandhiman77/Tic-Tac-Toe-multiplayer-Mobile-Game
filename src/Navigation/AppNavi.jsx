import { View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from '../Stacks/AuthStack';
import HomeStack from '../Stacks/HomeStack';
import { AuthContext } from '../context/Auth';


const AppNavi = () => {
    const {userinfo} = useContext(AuthContext);
   
  return (
    <NavigationContainer>
     {
          userinfo?.authToken ?<HomeStack/>:<AuthStack/>
        } 
    </NavigationContainer>
  )
}

export default AppNavi