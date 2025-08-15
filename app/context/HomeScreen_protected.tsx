
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

interface WithAuthProtectionProps {
  [key: string]: any;
}

type WrappedComponentType = React.ComponentType<any>;

const withAuthProtection = (WrappedComponent: WrappedComponentType) => {
  return function ProtectedComponent(props: WithAuthProtectionProps): React.ReactElement {
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const BASE_URL = 'https://django-api-1082068772584.us-central1.run.app';

    const refreshAccessToken = async (): Promise<boolean> => {
      const refresh = await AsyncStorage.getItem('refresh');
      if (!refresh) return false;

      const res = await fetch(`${BASE_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });

      if (res.ok) {
        const data: { access: string } = await res.json();
        await AsyncStorage.setItem('access', data.access);
        return true;
      } else {
        await AsyncStorage.removeItem('access');
        await AsyncStorage.removeItem('refresh');
        return false;
      }
    };

    useEffect(() => {
      const checkToken = async (): Promise<void> => {
        const token = await AsyncStorage.getItem('access');
        if (!token) {
          router.replace('/signin');
          return;
        }

        try {
          const decoded = jwtDecode<DecodedToken>(token);
          const now = Date.now() / 1000;

          if (decoded.exp < now) {
            const refreshed = await refreshAccessToken();
            if (!refreshed) {
              router.replace('/signin');
              return;
            }
          }
        } catch (err) {
          router.replace('/signin');
          return;
        }

        setLoading(false);
      };

      checkToken();
    }, []);

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthProtection;
