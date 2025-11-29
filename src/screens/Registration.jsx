import React, {useContext} from 'react';
import {useForm, Controller} from 'react-hook-form';
import * as Yup from 'yup';
import {Platform} from 'react-native';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import {AuthContext} from '../context/Auth';
import CustomButton from '../elements/CustomButton';
import Seperator from '../utils/Seperator';

// Validation schema
const schema = Yup.object().shape({
  username: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password should be at least 6 characters')
    .required('Password is required'),
  cpassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Registration = ({navigation}) => {
  const {signup, loading} = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = data => {
    signup(data);
    // Alert.alert('Registration Successful', JSON.stringify(data, null, 2));
  };

  const handleSocialLogin = platform => {
    Alert.alert(`Login with ${platform}`, 'Social login clicked!');
    // Integrate your OAuth logic here
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Register</Text>

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <Controller
          control={control}
          name="username"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.username && (
          <Text style={styles.error}>{errors.username.message}</Text>
        )}

        {/* Age */}
        {/* <Text style={styles.label}>Age</Text>
      <Controller
        control={control}
        name="age"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="numeric"
          />
        )}
      />
      {errors.age && <Text style={styles.error}>{errors.age.message}</Text>} */}

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <Controller
          control={control}
          name="cpassword"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.cpassword && (
          <Text style={styles.error}>{errors.cpassword.message}</Text>
        )}
        <CustomButton
          loading={loading}
          disabled={loading}
          onPress={handleSubmit(onSubmit)}
          title={'Register'}
          borderRadius={12}
          bg={'rgba(45, 11, 240, 0.76)'}
          borderWidth={2}
          borderColor={'rgb(36, 22, 230)'}
        />
        <Seperator/>
        {/* Register Button */}
        {/* <View style={{flexDirection: 'row', justifyContent: 'space-between'}}> */}
          {/* <TouchableOpacity style={styles.button} >
  <Text style={styles.buttonText}>Register</Text>
</TouchableOpacity> */}
          <Text style={{textAlign:"center",marginBottom:10}}>or</Text>
          {/* Login Button */}
          {/* <TouchableOpacity
            style={[styles.button, {backgroundColor: ''}]}
            onPress={() => navigation.pop()}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity> */}
          <CustomButton
            loading={loading}
            disabled={loading}
            onPress={() => navigation.pop()}
            title={'Login'}
            borderRadius={12}
            bg={'#4CAF50'}
          />
        {/* </View> */}

        {/* Social Media Login */}
        <Text style={styles.orText}>Or sign up with</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={[styles.socialButton, {backgroundColor: '#4267B2'}]}
            onPress={() => handleSocialLogin('Facebook')}>
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialButton, {backgroundColor: '#DB4437'}]}
            onPress={() => handleSocialLogin('Google')}>
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialButton, {backgroundColor: '#1DA1F2'}]}
            onPress={() => handleSocialLogin('Twitter')}>
            <Text style={styles.socialButtonText}>Twitter</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#f5f5f5',
    margin: Platform.OS === 'android' ? 2 : 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  label: {
    marginBottom: 5,
    color: '#555',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'android' ? 6 : 10,
    fontSize: 14,
    height: 44,
    textAlignVertical: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    marginTop: 20,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#555',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  socialButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
