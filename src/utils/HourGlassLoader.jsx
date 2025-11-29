import { Animated, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

const HourGlassLoader = ({ isloading,color }) => {
  let hourGlassStates = [
    'hourglass',
    'hourglass-start',
    'hourglass-half',
    'hourglass-end',
  ];

  const [currentHourGlass, setCurrentHourGlass] = useState('hourglass');
  const intervalRef = useRef(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const startRotation = () => {
    rotateAnim.setValue(0);
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hourGlassAnimation = () => {
    let i = 0;
    intervalRef.current = setInterval(() => {
      setCurrentHourGlass(hourGlassStates[i]);
      if (i === hourGlassStates.length-1) {
        hourGlassStates.reverse();
        startRotation();
        i = 0;
      } else {
        i++;
      }
    }, 800);
  };

  useEffect(() => {
    if (isloading) hourGlassAnimation();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isloading]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
      <FontAwesome6Icon color={color||'purple'} size={15} name={currentHourGlass} />
    </Animated.View>
  );
};

export default HourGlassLoader;

