import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/Login';
import Registration from '../screens/Registration';
import ForgotPass from '../screens/ForgotPass';
import OtpVerification from '../screens/OtpVerification';
import NewPassword from '../screens/NewPassword';
const Stack = createNativeStackNavigator();
const AuthStack = () => {
  return (
    <>
      
      <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false, // ✅ correct
        }}
      />
      <Stack.Screen
        name="ForgotPass"
        component={ForgotPass}
        options={{
          headerShown: false, // ✅ correct
        }}
      />
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerification}
        options={{
          headerShown: false, // ✅ correct
        }}
      />
      <Stack.Screen
        name="NewPassword"
        component={NewPassword}
        options={{
          headerShown: false, // ✅ correct
        }}
      />
        <Stack.Screen
          name="Register"
          component={Registration}
          options={{
            headerShown: false, // ✅ correct
          }}
        />
      </Stack.Navigator>
    </>
  )
}


export default AuthStack

const styles = StyleSheet.create({})