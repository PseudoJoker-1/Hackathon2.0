import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '@/app/(main)/(tabs)/index'
import ShopScreen from '@/app/(main)/(tabs)/shop'
import LeaderboardScreen from '@/app/(main)/(tabs)/leaderboard'
import ProfileScreen from '@/app/(main)/(tabs)/profile'

const Tab = createBottomTabNavigator();

export const TabBar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'home'){
            iconName = focused ? 'home' : 'home';
          }
          else if(route.name === 'report'){
            iconName = focused ? 'alert-circle' : 'alert-circle'
          }
          else if (route.name === 'leaderboard') {
            iconName = focused ? 'trophy' : 'trophy';
          }
          else if (route.name === 'shop') {
            iconName = focused ? 'bag' : 'bag';
          }
          else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person';
          }
          else if (route.name === 'admin'){
            iconName = focused  ? 'shield-checkmark' : 'shield-checkmark'
          }
          

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E3A8A',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};