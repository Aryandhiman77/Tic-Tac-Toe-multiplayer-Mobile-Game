import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

const ImageUpload = ({url}) => {
    const [imageUrl,setImageUrl] = useState(url);
  return (
    <View>
      <Text>ImageUpload</Text>
    </View>
  )
}

export default ImageUpload

const styles = StyleSheet.create({})