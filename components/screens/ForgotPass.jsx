import React, { useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthContext } from '../context/Auth';
import Background from '../component/Background';
import { Toast, useToast } from 'react-native-toast-notifications';
import { danger, success } from '../utils/ToastConfig';
import CustomButton from '../elements/CustomButton';

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
});

const ForgotPass = ({ navigation }) => {
    const {forgotPassword,loading} = useContext(AuthContext);
    const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async(data) => {
    console.log('Sending reset link to:', data.email);
    const emailSentMsg = await forgotPassword(data?.email);
    if(emailSentMsg){
        navigation.navigate("OtpVerification");
        toast.show(emailSentMsg,success);
    }else{
        toast.show("Reset Code Password Failed.",danger);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a password reset code.
        </Text>

        {/* Email Input */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={[
                  styles.input,
                  errors.email && { borderColor: '#EF4444' },
                ]}
                placeholder="Email address"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </>
          )}
        />

        {/* Submit Button */}
        {/* <TouchableOpacity style={styles.button} >
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity> */}
        <CustomButton disabled={loading} loading={loading} onPress={handleSubmit(onSubmit)} marginV={20} title={"Send Reset Code"} bg={"#2563EB"} borderRadius={12}/>

        {/* Back to Login */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#6B7280',
  },
  input: {
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    color: '#111827',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backText: {
    color: '#2563EB',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 4,
  },
});
