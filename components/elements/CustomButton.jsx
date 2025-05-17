import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const CustomButton = ({
  loading,
  loadingColor,
  disabled,
  onPress,
  title,
  bg,
  textColor,
  marginBottom,
  fontWeight,
  textPadding,
  fontSize,
  imgSource,
  imgStyle,
  borderRadius,
  marginH,
  marginV,
  borderWidth,
  borderColor,
  icon,
  disabledOpacity
}) => {
  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles.btn,
          {marginBottom: marginBottom || 10},
          disabled ? {opacity:disabledOpacity||0.4} : styles.enabled,
          {backgroundColor: bg || '#8858dc'},
          {
            borderRadius: borderRadius||0,
            marginHorizontal: marginH||0,
            marginVertical: marginV||0,
            borderWidth:borderWidth||0,
            borderColor:borderColor||"black"
          },
        ]}
        onPress={onPress}>
        {loading ? (
          <ActivityIndicator color={loadingColor || '#fff'} />
        ) : !imgSource && !icon ? (
          <Text
            style={[
              styles.btnText,
              {
                color: textColor || 'white',
                fontWeight: fontWeight || 'bold',
                fontSize: fontSize || 14,
                textPadding: textPadding || 5,
              },
            ]}>
            {title}
          </Text>
        ) : icon?icon:(
          <Image source={imgSource||""} style={imgStyle||""} />
        )}
      </TouchableOpacity>
    </>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btn: {
    padding: 12,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 18,
  },
  enabled: {
    opacity: 1,
  },
});
