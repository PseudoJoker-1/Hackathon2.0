import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import client from '@/utils/api/client'
import { ENDPOINTS } from '@/utils/api/endpoints'
import { Href, Link, useRouter } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import { useAuthStore } from '@/features/auth/authSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

interface Service {
  id: number
  title: string
  icon: keyof typeof Ionicons.glyphMap
  link: string
}

interface Partner {
  id: number
  name: string
  logo: string
  description?: string
}

export default function ServicesScreen() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loadingPartners, setLoadingPartners] = useState(true)
  const [loadingAdditional, setLoadingAdditional] = useState(true)
  const [user,setUser] = useState(null)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const services = [
    {
      id:1,
      title:'Админка',
      icon:'settings',
      link:'/(main)/(screens)/AdminScreen/admin',
    },
    {
      id:2,
      title:'Магазин',
      icon:'cart',
      link:'/(main)/(screens)/Shop/shop',
    },
    {
      id:3,
      title:'Лидерборд',
      icon:'trophy',
      link: '/(main)/(screens)/LeaderBoard/leaderboard',
    },
    {
      id:4,
      title:'Профиль',
      icon:'person',
      link:'/(main)/(screens)/profile/profile',
    },
    {
      id:5,
      title:'Жалобы',
      icon:'document-text',
      link:'/(main)/(tabs)/report',
    },
    {
      id:6,
      title:'QR Сканер',
      icon:'qr-code',
      link:'/(main)/(tabs)/qr',
    },
    {
      id: 7,
      title: 'Создать фасилити',
      icon: 'qr-code',
      link: '/(main)/(screens)/CreateLobby/createFacility',
    },
  ]
  const mockPartners = [
    {
      id: 1,
      name: "Binom school",
      logo: "https://via.placeholder.com/80x80.png?text=TechnoLab",
      description: "Инновационные IT-решения для бизнеса",
    },
    {
      id: 2,
      name: "KTL (BIL)",
      logo: "https://via.placeholder.com/80x80.png?text=EduSmart",
      description: "Современные образовательные технологии",
    },
  ]
  const additionalServices = [
    {
      id:1,
      title:'Поддержка',
      icon:'help-buoy',
      description:'Помощь и консультации',
    },
    {
      id:2,
      title:'Настройки',
      icon:'construct',
      description:'Настройте приложение под себя',
    },
    {
      id:3,
      title:'Уведомления',
      icon:'notifications',
      description:'Настройте уведомления',
    },
  ]

  useEffect(()=>{
    const getUser = async()=>{
      try{
        const token = await AsyncStorage.getItem('access')
        if(!token){
          router.push('/(auth)/signin')
        }
        
        const API_URL = 'https://django-api-1082068772584.us-central1.run.app'
        const resp = await axios.get(`${API_URL}/api/me/`, {
          headers: {
            Authorization:`Bearer ${token}`,
          }
        })
        console.log(resp.data);
        
        setUser(resp.data)
      }
      catch(error){
        if(axios.isAxiosError(error) && error.response?.status == 401){
          console.log("токен недействителен")
          // router.push('/(auth)/signin')
        }
        else{
          console.log("get user error", error)
        }
      }
    }
    const loadPartners = async()=>{
      try{
        setLoadingPartners(true)
        const API_URL = 'https://django-api-1082068772584.us-central1.run.app'
        const token = await AsyncStorage.getItem('access')
        const response = await client.get(`${API_URL}/api/organizations/`,{headers:{ Authorization: `Bearer ${token}` }})
        setPartners(response.data)
        setLoadingPartners(false)
      }
      catch(error){
        Alert.alert('Ошибка', 'Не удалось загрузить данные партнеров')
        setLoadingPartners(false)
      }
    }
    getUser()
    loadPartners()
    
    setTimeout(()=>{
      setLoadingAdditional(false)
    }, 1000)
  }, [])

  const navigateToAuth = ()=>{
    router.push('/(auth)/signin')
  }

  const UserProfileSection = ()=>{
    if(isAuthenticated && user){
      return (
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {user.name?.[0]}{user.surname?.[0]}
              </Text>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name} {user.surname?.[0]}.</Text>
            <Text style={styles.profileUsername}>@{user.username}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#6B7280" />
        </View>
      )
    }

    return (
      <View style={styles.profileContainer}>
        <View style={[styles.avatar, styles.anonymousAvatar]}>
          <Ionicons name="person" size={24} color="#6B7280" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.authPrompt}>Войдите или зарегистрируйтесь</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#6B7280" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity 
          style={styles.profileCard}
          onPress={isAuthenticated ? ()=>router.push('/(main)/(screens)/profile/profile') : navigateToAuth}
        >
          <UserProfileSection />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Сервисы</Text>
          <View style={styles.servicesGrid}>
            {services.map((service)=>(
              <Link key={service.id} href={service.link as Href} asChild>
                <TouchableOpacity style={styles.serviceCard}>
                  <View style={styles.serviceIconContainer}>
                    <Ionicons name={service.icon} size={24} color="#3B82F6" />
                  </View>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Наши партнеры</Text>
          {!loadingPartners ? (
            <View style={styles.additionalServices}>
              {mockPartners.map((item, index) => (
                <View key={index} style={styles.additionalServiceCard}>
                  <Image 
                    source={{ uri: item.logo }} 
                    style={styles.additionalServiceIcon}
                    resizeMode="contain"
                  />
                  <View style={styles.additionalServiceInfo}>
                    <Text style={styles.additionalServiceTitle}>{item.name}</Text>
                    {item.description && (
                      <Text style={styles.additionalServiceDesc}>{item.description}</Text>
                    )}
                  </View>
                </View>
            ))}

            </View>
          ) : (
            <View style={styles.additionalServices}>
              {partners.map((partner)=>(
                <View key={partner.id} style={styles.additionalServiceCard}>
                  <Image 
                    source={{ uri: partner.logo }} 
                    style={styles.additionalServiceIcon}
                    resizeMode="contain"
                  />
                  <View style={styles.additionalServiceInfo}>
                    <Text style={styles.additionalServiceTitle}>{partner.name}</Text>
                    {partner.description && (
                      <Text style={styles.additionalServiceDesc}>{partner.description}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Дополнительные услуги</Text>
          {loadingAdditional ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.partnersScroll}
              contentContainerStyle={styles.partnersContainer}
            >
              {[1,2,3].map((item)=>(
                <View key={item} style={styles.partnerCard}>
                  <View style={styles.partnerSkeletonLogo} />
                  <View style={styles.partnerSkeletonText} />
                </View>
              ))}
            </ScrollView>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.partnersScroll}
              contentContainerStyle={styles.partnersContainer}
            >
              {additionalServices.map((service)=>(
                <TouchableOpacity key={service.id} style={styles.partnerCard}>
                  <View style={styles.additionalServiceIcon}>
                    <Ionicons name={service.icon as any} size={24} color="#F59E0B" />
                  </View>
                  <Text style={styles.partnerName}>{service.title}</Text>
                  <Text style={styles.partnerDescription}>{service.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  anonymousAvatar: {
    backgroundColor: '#E5E7EB',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  profileUsername: {
    fontSize: 14,
    color: '#6B7280',
  },
  authPrompt: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: '31%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  partnersScroll: {
    marginHorizontal: -16,
  },
  partnersContainer: {
    paddingHorizontal: 16,
  },
  partnerCard: {
    width: 150,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  partnerSkeletonLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  partnerSkeletonText: {
    height: 16,
    width: '80%',
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
  partnerDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  additionalServices: {
    gap: 12,
  },
  additionalServiceSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  additionalServiceSkeletonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  additionalServiceSkeletonText: {
    flex: 1,
    gap: 6,
  },
  additionalServiceSkeletonTitle: {
    height: 16,
    width: '40%',
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  additionalServiceSkeletonDesc: {
    height: 14,
    width: '60%',
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  additionalServiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  additionalServiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  additionalServiceInfo: {
    flex: 1,
  },
  additionalServiceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  additionalServiceDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
})