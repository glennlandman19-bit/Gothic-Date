import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignout, setIsSignout] = useState(false);

  // Restore token on app load
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('authToken');
        const savedUser = await AsyncStorage.getItem('user');
        
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Failed to restore session', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    sign: {
      // Sign up
      up: async (username, email, password, firstName, lastName) => {
        try {
          setIsLoading(true);
          const response = await authAPI.signup({
            username,
            email,
            password,
            firstName,
            lastName,
          });

          const { user: userData, token: authToken } = response.data;
          
          await AsyncStorage.setItem('authToken', authToken);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          
          setToken(authToken);
          setUser(userData);
          setIsSignout(false);
        } catch (error) {
          throw error;
        } finally {
          setIsLoading(false);
        }
      },

      // Sign in (login)
      in: async (email, password) => {
        try {
          setIsLoading(true);
          const response = await authAPI.login({ email, password });

          const { user: userData, token: authToken } = response.data;
          
          await AsyncStorage.setItem('authToken', authToken);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          
          setToken(authToken);
          setUser(userData);
          setIsSignout(false);
        } catch (error) {
          throw error;
        } finally {
          setIsLoading(false);
        }
      },

      // Sign out (logout)
      out: async () => {
        try {
          setIsLoading(true);
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          
          setToken(null);
          setUser(null);
          setIsSignout(true);
        } catch (error) {
          console.error('Sign out error:', error);
        } finally {
          setIsLoading(false);
        }
      },
    },
    isSignout,
    isLoading,
    user,
    token,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};
