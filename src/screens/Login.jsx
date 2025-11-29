import React, {useContext} from 'react';
import {useForm, Controller} from 'react-hook-form';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import Background from '../component/Background';
import {AuthContext} from '../context/Auth';
import CustomButton from '../elements/CustomButton';

// Yup validation schema
const schema = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password should be at least 6 characters')
    .required('Password is required'),
});

const Login = ({navigation}) => {
  const {Login, loading} = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async data => {
    try {
      const {email, password} = data;
      if (email && password) {
        Login({email, password});
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Background />
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Login</Text>

        {/* Email Input */}
        <View>
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#888"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors?.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#888"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />
          {errors?.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}

          {/* Submit Button */}
          <CustomButton
            loading={loading}
            disabled={loading}
            onPress={handleSubmit(onSubmit)}
            title={'Login'}
            borderRadius={12}
            bg={'rgba(66, 241, 13, 0.76)'}
          />
         <Text onPress={()=>navigation.navigate("ForgotPass")} style={{color:"rgb(203, 212, 250)",fontWeight:"600",textAlign:"center",marginVertical:12,textDecorationLine:"underline"}}>Forgot Password ?</Text>
        </View>

        <CustomButton
          onPress={() => navigation.push('Register')}
          title={"Don't have an Account ?"}
          borderRadius={12}
          bg={'rgba(13, 54, 241, 0.8)'}
        />
      </SafeAreaView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    margin: Platform.OS === 'android' ? 2 : 20,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#fff',
    textShadowRadius: 12,
    textShadowColor: 'gray',
  },
  label: {
    marginBottom: 5,
    color: '#ccc',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#8e44ad', // rich purple for contrast
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: 30,
    color: 'rgb(249, 34, 74)',
    textDecorationLine: 'underline',
    fontSize: 16,
    fontWeight: '700',
  },
});
