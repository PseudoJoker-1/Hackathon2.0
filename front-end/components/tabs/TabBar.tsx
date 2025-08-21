import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import HomeScreen from '@/app/(main)/(tabs)/index'
import ShopScreen from '@/app/(main)/(tabs)/shop'
import LeaderboardScreen from '@/app/(main)/(tabs)/leaderboard'
import ProfileScreen from '@/app/(main)/(tabs)/profile'

const Tab = createBottomTabNavigator()

export const TabBar = () => {
  // Карта иконок для табов
  const tabIcons = {
    home: 'home',
    report: 'alert-circle',
    leaderboard: 'trophy',
    shop: 'bag',
    profile: 'person',
    admin: 'shield-checkmark'
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Показываем иконку для каждой вкладки
        tabBarIcon: ({focused,color,size})=>{
          const iconName = tabIcons[route.name as keyof typeof tabIcons] || 'cube'
          return <Ionicons name={iconName as any} size={size} color={color} />
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
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="shop" component={ShopScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}