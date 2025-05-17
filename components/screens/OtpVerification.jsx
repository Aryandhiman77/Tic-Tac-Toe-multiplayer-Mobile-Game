import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Toast, useToast } from 'react-native-toast-notifications';
import { danger, success } from '../utils/ToastConfig';
import { AuthContext } from '../context/Auth';

// Validation schema
const schema = yup.object().shape({
  resetCode: yup
    .string()
    .required('Reset code is required')
    .matches(/^\d{6}$/, 'Code must be 6 digits'),
});

const OtpVerification = ({navigation}) => {
    const {passChangeStep,setPassChangeStep} = useState(AuthContext);
    const {
        control,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
      });
    
      const onSubmit = (data) => {
        navigation.navigate('NewPassword',{resetCode:data.resetCode});
      };
        return (
            <View style={styles.container}>
              <Text style={styles.title}>Verify Reset Code</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code sent to your email
              </Text>
        
              <Controller
                control={control}
                name="resetCode"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.resetCode && styles.errorInput]}
                    keyboardType="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.resetCode && (
                <Text style={styles.errorText}>{errors.resetCode.message}</Text>
              )}
        
              <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          );
      
}

export default OtpVerification

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      backgroundColor: '#f4f4f8',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      color: '#666',
      marginBottom: 24,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#fff',
      padding: 12,
      fontSize: 18,
      borderRadius: 8,
      textAlign: 'center',
      letterSpacing: 6,
    },
    errorInput: {
      borderColor: '#ff4d4d',
    },
    errorText: {
      color: '#ff4d4d',
      marginTop: 6,
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#007bff',
      paddingVertical: 14,
      borderRadius: 8,
      marginTop: 24,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
      fontWeight: '600',
    },
  });
  