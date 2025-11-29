import { ImageBackground, StyleSheet} from 'react-native'
import React from 'react'
import background from '../assets/ttt1.jpg'

const Background = () => {
  return (
    <>
     <ImageBackground source={background} style={styles.background} blurRadius={0} />
    </>
  )
}

export default Background

const styles = StyleSheet.create({
    background:{
        height:"100%",
        width:"100%",
        position:"absolute",
    }
})