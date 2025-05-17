import React, { useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useToast } from 'react-native-toast-notifications';
import { success, danger } from '../utils/ToastConfig';
import CustomButton from '../elements/CustomButton';
import { AuthContext } from '../context/Auth';

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required('Password is required')
    .min(6, 'Password should be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

const NewPassword = ({ route, navigation }) => {
    const toast = useToast();
  const { resetCode } = route.params;
  const { resetPassword } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async ({ newPassword }) => {
    try {
      let passSavedMsg =await resetPassword({ token: resetCode, password: newPassword });
      if(passSavedMsg){
          toast.show(passSavedMsg, success);
          navigation.popToTop();
      }else{
        toast.show("Password cannot be changed", success);
      }
    } catch (err) {
        console.log(err)
      toast.show('Something went wrong. Try again.', danger);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Create New Password</Text>
          <Text style={styles.subtitle}>
            Your new password must be different from the previous one.
          </Text>

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.newPassword && styles.errorInput]}
                placeholder="New Password"
                secureTextEntry
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.newPassword && (
            <Text style={styles.errorText}>{errors.newPassword.message}</Text>
          )}

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.errorInput]}
                placeholder="Confirm Password"
                secureTextEntry
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
          )}

          <CustomButton
            title="Reset Password"
            borderRadius={12}
            bg="rgba(9, 111, 214, 0.6)"
            textColor="white"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default NewPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f8f9fc',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  errorInput: {
    borderColor: '#ff4d4d',
  },
  errorText: {
    color: '#ff4d4d',
    marginBottom: 12,
    marginLeft: 4,
    fontSize: 13,
  },
});
