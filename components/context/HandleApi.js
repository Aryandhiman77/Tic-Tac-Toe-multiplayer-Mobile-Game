import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl} from '../config/appConfig';

  export default async function apiRequest(
    endpoint,
    body,
    authToken = null,
    refreshToken = null,
    TokenRefreshCallback,
    method=null,
    contentType=null,
    stringify=true
  ) {
    const makeRequest = async token => {
      const headers = {
        ...(contentType &&{'Content-Type': contentType||'application/json'} ),
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const response = await fetch(apiUrl + endpoint, {
        method: method||'POST',
        headers,
        body: stringify?JSON.stringify({ ...body }):body,
      });
      const data = await response.json();
      return { response, data };
    };
  
    try {
      const { response, data } = await makeRequest(authToken);
      if ([400, 401, 404, 403, 500].includes(response.status)) {
        if (data.message === 'TokenExpiredError') {
          const success = await TokenRefreshCallback() ;
          if (success) {
            const newUser = JSON.parse(await AsyncStorage.getItem('user')); // fetch fresh token
            const { response: retryResponse, data: retryData } = await makeRequest(newUser?.authToken);
  
            if ([400, 401, 404, 403, 500].includes(retryResponse.status)) {
              // console.log('retry failed.', retryResponse);
              return { success: false, message: retryData.message };
            }
  
            // console.log('retry passed.', retryResponse);
            return { success: true, data: retryData };
          }
        }
        return { success: false, message: data.message };
      }
  
      return { success: true, data };
    } catch (error) {
      console.log('apiRequest error:', error.message);
      return {
        success: false,
        message: 'Something went wrong',
        error,
      };
    }
  }
  
