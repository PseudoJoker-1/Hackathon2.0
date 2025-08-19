import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { ENDPOINTS } from '@/utils/api/endpoints'
import client from '@/utils/api/client'
import withAuthProtection from '@/components/common/ProtectedRoute'

interface Product {
  id: number | string
  name: string
  label: string
  price: number
}

const categories = [
  { id: 'all', name: 'All Items' },
  { id: 'food', name: 'Food & Drink' },
  { id: 'access', name: 'Access' },
  { id: 'transport', name: 'Transport' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'premium', name: 'Premium' },
]

function ShopScreen() {
  const [promoModalVisible, setPromoModalVisible] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [points, setPoints] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Цвета для разных типов продуктов
  const colorMap = {
    coffee: '#F59E0B',
    library: '#3B82F6',
    parking: '#10B981',
    credit: '#8B5CF6',
    premium: '#F59E0B',
    priority: '#EF4444',
  }

  // Иконки для разных типов продуктов
  const iconMap = {
    coffee: 'cafe',
    library: 'library',
    parking: 'car',
    credit: 'gift',
    premium: 'diamond',
    priority: 'flash',
  }

  // Загружаем данные о продуктах и баллах пользователя
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = 'https://django-api-1082068772584.us-central1.run.app'
        const [userResponse, productsResponse] = await Promise.all([
          axios.get(`${API_URL}${ENDPOINTS.USER_PROFILE}`),
          axios.get(`${API_URL}${ENDPOINTS.REWARDS}`)
        ])

        setPoints(userResponse.data.points || 0)
        setProducts(Array.isArray(productsResponse.data) ? productsResponse.data : [])
      } catch (error: any) {
        console.error('Failed to load shop:', error)
        Alert.alert('Error', 'Failed to load shop')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Обмениваем баллы на продукт
  const redeemItem = async (product: Product) => {
    try {
      const response = await axios.post(`${ENDPOINTS.REWARDS}${product.id}/redeem/`)
      const { remaining_points, code } = response.data
      
      setPoints(remaining_points)
      setPromoCode(code)
      setPromoModalVisible(true)
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to redeem item')
    }
  }

  // Фильтруем продукты по выбранной категории
  const filteredProducts = selectedCategory == 'all' ? products : products.filter(p => p.name.includes(selectedCategory))

  // Показываем загрузку пока данные не получены
  if (loading) {
    return <ActivityIndicator size="large" color="#2563EB" style={{ flex: 1 }} />
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Модальное окно с промо-кодом */}
      <Modal 
        animationType="slide" 
        transparent={true} 
        visible={promoModalVisible} 
        onRequestClose={() => setPromoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="gift" size={40} color="#2563EB" />
            <Text style={styles.modalTitle}>Your Promo Code</Text>
            <Text style={styles.promoCode}>{promoCode}</Text>
            <TouchableOpacity 
              onPress={() => setPromoModalVisible(false)} 
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Rewards Shop</Text>
            <Text style={styles.subtitle}>Redeem your points for rewards</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.pointsText}>{points}</Text>
          </View>
        </View>

        {/* Категории продуктов */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => setSelectedCategory(category.id)} 
              style={[styles.categoryButton, selectedCategory === category.id && styles.categoryButtonActive]}
            >
              <Text style={[styles.categoryText, selectedCategory === category.id && styles.categoryTextActive]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Список продуктов */}
        <View style={styles.itemsGrid}>
          {filteredProducts?.map((item) => (
            <View key={item.name} style={styles.itemCard}>
              <View style={[styles.itemIcon, { backgroundColor: `${colorMap[item.name as keyof typeof colorMap] || '#ccc'}20` }]}> 
                <Ionicons 
                  name={iconMap[item.name as keyof typeof iconMap] || 'cube'} 
                  size={24} 
                  color={colorMap[item.name as keyof typeof colorMap] || '#000'} 
                />
              </View>
              <Text style={styles.itemName}>{item.label}</Text>
              <Text style={styles.itemDescription}>Reward</Text>
              <View style={styles.itemFooter}>
                <View style={styles.pointsContainer}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.itemPoints}>{item.price}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.redeemButton} onPress={() => redeemItem(item)}>
                <Ionicons name="bag" size={16} color="white" />
                <Text style={styles.redeemButtonText}>Redeem</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Блок с предложением заработать больше баллов */}
        <View style={styles.earnMoreCard}>
          <Text style={styles.earnMoreTitle}>Need more points?</Text>
          <Text style={styles.earnMoreText}>
            Report issues around campus to earn points and unlock more rewards!
          </Text>
          <TouchableOpacity style={styles.earnMoreButton}>
            <Text style={styles.earnMoreButtonText}>Report an Issue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuthProtection(ShopScreen)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 20, 
    marginBottom: 24 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#111827', 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#6B7280' 
  },
  pointsBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FEF3C7', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 16 
  },
  pointsText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#D97706', 
    marginLeft: 6 
  },
  categoriesContainer: { 
    marginBottom: 24 
  },
  categoryButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    backgroundColor: 'white', 
    marginRight: 12, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  categoryButtonActive: { 
    backgroundColor: '#2563EB', 
    borderColor: '#2563EB' 
  },
  categoryText: { 
    fontSize: 14, 
    fontWeight: '500', 
    color: '#6B7280' 
  },
  categoryTextActive: { 
    color: 'white', 
    fontWeight: '600' 
  },
  itemsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 16, 
    marginBottom: 32 
  },
  itemCard: { 
    width: '47%', 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 16, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 3, 
    elevation: 2 
  },
  itemIcon: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12 
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#111827', 
    marginBottom: 4 
  },
  itemDescription: { 
    fontSize: 14, 
    color: '#6B7280', 
    marginBottom: 12, 
    lineHeight: 20 
  },
  itemFooter: { 
    marginBottom: 12 
  },
  pointsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  itemPoints: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#D97706', 
    marginLeft: 4 
  },
  redeemButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#2563EB', 
    paddingVertical: 10, 
    borderRadius: 12 
  },
  redeemButtonText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: 'white', 
    marginLeft: 6 
  },
  earnMoreCard: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 16, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 3, 
    elevation: 2 
  },
  earnMoreTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#111827', 
    marginBottom: 8 
  },
  earnMoreText: { 
    fontSize: 14, 
    color: '#6B7280', 
    textAlign: 'center', 
    lineHeight: 20, 
    marginBottom: 16 
  },
  earnMoreButton: { 
    backgroundColor: '#2563EB', 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 12 
  },
  earnMoreButtonText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: 'white' 
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 12
  },
  promoCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB'
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600'
  }
})