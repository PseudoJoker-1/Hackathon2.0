// layout
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PointsProvider } from '@/app/context/PointsContext';
import { config } from '@/config';

export default function TabLayout() {
  const [isAdmin, setIsAdmin] = useState(false);
  // const BASE_URL = 'https://django-api-1082068772584.us-central1.run.app';
  // const BASE_URL = 'http://localhost:8000'; // For local development
  const { URL } = config;
  const BASE_URL = `${URL}:8000`;
  
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('access');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      const userRes = await fetch(`${BASE_URL}/api/me/`, { headers });
      if (userRes.ok) {
        const user = await userRes.json();
        if (user.is_admin) {
          setIsAdmin(true);
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <PointsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            paddingBottom: 8,
            paddingTop: 8,
            height: 88,
          },
          tabBarActiveTintColor: '#2563EB',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            title: 'Report',
            tabBarIcon: ({ size, color })=>(
              <Ionicons name="alert-circle" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Leaderboard',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="trophy" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            title: 'Shop',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="bag" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="QR-scanner"
          options={{
            title: 'QR Scanner',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="qr-code" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="create_lobby"
          options={{
            title: 'Create lobby',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="book" size={size} color={color} />
            ),
          }}
        />
        {/* тут в любом случье показывается admin page,надо исправить */}
        {!isAdmin && (
          <Tabs.Screen
          name="admin"
          options={{
            title: "Admin",
            tabBarIcon: ({ color }) => <Ionicons name="shield-checkmark" size={22} color={color} />,
          }}
        />
        
      )}
      </Tabs>
    </PointsProvider>
  );
}