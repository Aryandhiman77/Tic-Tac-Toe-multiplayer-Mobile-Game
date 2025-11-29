import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Seperator = ({mb,mt,h,color}) => {
  return (
    <View style={{backgroundColor:color||"white",width:"100%",height:h||1,marginBottom:mb||5,marginTop:mt||2}}/>
  )
}

export default Seperator

