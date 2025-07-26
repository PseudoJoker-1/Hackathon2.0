import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import withAuthProtection from '../context/HomeScreen_protected';
import { Modal } from 'react-native';


interface Product {
  name: string;
  label: string;
  price: number;
}

const categories = [
  { id: 'all', name: 'All Items' },
  { id: 'food', name: 'Food & Drink' },
  { id: 'access', name: 'Access' },
  { id: 'transport', name: 'Transport' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'premium', name: 'Premium' },
];

function ShopScreen() {
  const [promoModalVisible, setPromoModalVisible] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const colorMap: any = {
    coffee: '#F59E0B',
    library: '#3B82F6',
    parking: '#10B981',
    credit: '#8B5CF6',
    premium: '#F59E0B',
    priority: '#EF4444',
  };

  const iconMap: any = {
    coffee: 'cafe',
    library: 'library',
    parking: 'car',
    credit: 'gift',
    premium: 'diamond',
    priority: 'flash',
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('access');
      try {
        const [meRes, productRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/me/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://127.0.0.1:8000/api/product/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const user = await meRes.json();
        const items = await productRes.json();

        setPoints(user.points);
        setProducts(items);
      } catch (e) {
        Alert.alert('Error', 'Failed to load shop');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const redeemItem = async (product: Product) => {
    const token = await AsyncStorage.getItem('access');
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/redeem/${product.id}/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setPoints(data.remaining_points);
        console.log(data.code);
        setPromoCode(data.code); 
        setPromoModalVisible(true); 
      } else {
        Alert.alert('Error', data.error || 'Something went wrong');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to redeem');
    }
  };





  

  const filtered = selectedCategory === 'all'
    ? products
    : products.filter(p => p.name.includes(selectedCategory));

  if (loading) return <ActivityIndicator size="large" color="#2563EB" style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={promoModalVisible}
        onRequestClose={() => setPromoModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 24,
            borderRadius: 16,
            alignItems: 'center',
            width: '80%',
          }}>
            <Ionicons name="gift" size={40} color="#2563EB" />
            <Text style={{ fontSize: 20, fontWeight: '700', marginVertical: 12 }}>Your Promo Code</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2563EB' }}>{promoCode}</Text>
            <TouchableOpacity
              onPress={() => setPromoModalVisible(false)}
              style={{
                marginTop: 20,
                backgroundColor: '#2563EB',
                paddingVertical: 10,
                paddingHorizontal: 24,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Close</Text>
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map(c => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setSelectedCategory(c.id)}
              style={[styles.categoryButton, selectedCategory === c.id && styles.categoryButtonActive]}
            >
              <Text style={[styles.categoryText, selectedCategory === c.id && styles.categoryTextActive]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.itemsGrid}>
          {filtered.map(item => (
            <View key={item.name} style={styles.itemCard}>
              <View style={[styles.itemIcon, { backgroundColor: `${colorMap[item.name] || '#ccc'}20` }]}> 
                <Ionicons name={iconMap[item.name] || 'cube'} size={24} color={colorMap[item.name] || '#000'} />
              </View>
              <Text style={styles.itemName}>{item.label}</Text>
              <Text style={styles.itemDescription}>Reward</Text>
              <View style={styles.itemFooter}>
                <View style={styles.pointsContainer}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.itemPoints}>{item.price}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.redeemButton}
                onPress={() => redeemItem(item)}
              >
                <Ionicons name="bag" size={16} color="white" />
                <Text style={styles.redeemButtonText}>Redeem</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.earnMoreCard}>
          <Text style={styles.earnMoreTitle}>Need more points?</Text>
          <Text style={styles.earnMoreText}>Report issues around campus to earn points and unlock more rewards!</Text>
          <TouchableOpacity style={styles.earnMoreButton}>
            <Text style={styles.earnMoreButtonText}>Report an Issue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default withAuthProtection(ShopScreen);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  pointsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  pointsText: { fontSize: 16, fontWeight: '600', color: '#D97706', marginLeft: 6 },
  categoriesContainer: { marginBottom: 24 },
  categoryButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'white', marginRight: 12, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  categoryButtonActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  categoryText: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  categoryTextActive: { color: 'white', fontWeight: '600' },
  itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 32 },
  itemCard: { width: '47%', backgroundColor: 'white', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  itemIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  itemDescription: { fontSize: 14, color: '#6B7280', marginBottom: 12, lineHeight: 20 },
  itemFooter: { marginBottom: 12 },
  pointsContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  itemPoints: { fontSize: 16, fontWeight: '600', color: '#D97706', marginLeft: 4 },
  redeemButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB', paddingVertical: 10, borderRadius: 12 },
  redeemButtonText: { fontSize: 14, fontWeight: '600', color: 'white', marginLeft: 6 },
  earnMoreCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  earnMoreTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 },
  earnMoreText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  earnMoreButton: { backgroundColor: '#2563EB', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  earnMoreButtonText: { fontSize: 14, fontWeight: '600', color: 'white' },
});
