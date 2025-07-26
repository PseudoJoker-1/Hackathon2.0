import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Ionicons
} from '@expo/vector-icons';
import withAuthProtection from '../context/HomeScreen_protected';

const shopItems = [
  {
    id: 1,
    name: 'Free Coffee',
    description: 'Redeem at campus cafés',
    points: 200,
    icon: 'cafe',
    color: '#F59E0B',
    category: 'food',
    stock: 15,
  },
  {
    id: 2,
    name: 'Library Late Pass',
    description: 'Stay after hours for studying',
    points: 300,
    icon: 'library',
    color: '#3B82F6',
    category: 'access',
    stock: 8,
  },
  {
    id: 3,
    name: 'Parking Voucher',
    description: 'Free parking for one day',
    points: 150,
    icon: 'car',
    color: '#10B981',
    category: 'transport',
    stock: 20,
  },
  {
    id: 4,
    name: 'Campus Store Credit',
    description: '$5 off any purchase',
    points: 400,
    icon: 'gift',
    color: '#8B5CF6',
    category: 'shopping',
    stock: 12,
  },
  {
    id: 5,
    name: 'Premium Badge',
    description: 'Show off your contributor status',
    points: 500,
    icon: 'diamond',
    color: '#F59E0B',
    category: 'premium',
    stock: 5,
  },
  {
    id: 6,
    name: 'Priority Support',
    description: 'Fast-track your future reports',
    points: 600,
    icon: 'flash',
    color: '#EF4444',
    category: 'premium',
    stock: 3,
  },
];

const categories = [
  { id: 'all', name: 'All Items' },
  { id: 'food', name: 'Food & Drink' },
  { id: 'access', name: 'Access' },
  { id: 'transport', name: 'Transport' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'premium', name: 'Premium' },
];

function ShopScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userPoints] = useState(1250);

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  const handlePurchase = (item: typeof shopItems[0]) => {
    if (userPoints < item.points) {
      Alert.alert(
        'Insufficient Points',
        `You need ${item.points - userPoints} more points to redeem this item.`
      );
      return;
    }

    Alert.alert(
      'Confirm Purchase',
      `Redeem "${item.name}" for ${item.points} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Redeem',
          onPress: () => {
            Alert.alert(
              'Success!',
              `You've successfully redeemed "${item.name}". Check your profile for redemption details.`
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Rewards Shop</Text>
            <Text style={styles.subtitle}>Redeem your points for rewards</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.pointsText}>{userPoints.toLocaleString()}</Text>
          </View>
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Items Grid */}
        <View style={styles.itemsGrid}>
          {filteredItems.map((item) => {
            const canAfford = userPoints >= item.points;
            const isLowStock = item.stock <= 5;
            
            return (
              <View key={item.id} style={styles.itemCard}>
                <View style={[styles.itemIcon, { backgroundColor: `${item.color}20` }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                
                <View style={styles.itemFooter}>
                  <View style={styles.pointsContainer}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.itemPoints}>{item.points}</Text>
                  </View>
                  
                  {isLowStock && (
                    <Text style={styles.lowStockText}>Only {item.stock} left!</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.redeemButton,
                    !canAfford && styles.redeemButtonDisabled
                  ]}
                  onPress={() => handlePurchase(item)}
                  disabled={!canAfford}
                >
                  <Ionicons name="bag" size={16} color={canAfford ? 'white' : '#9CA3AF'} />
                  <Text style={[
                    styles.redeemButtonText,
                    !canAfford && styles.redeemButtonTextDisabled
                  ]}>
                    {canAfford ? 'Redeem' : 'Need More Points'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Earn More Points */}
        <View style={styles.earnMoreCard}>
          <Text style={styles.earnMoreTitle}>Need more points?</Text>
          <Text style={styles.earnMoreText}>
            Report issues around campus to earn points and unlock more rewards!
          </Text>
          <TouchableOpacity style={styles.earnMoreButton}>
            <Text style={styles.earnMoreButtonText}>Report an Issue</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}
export default withAuthProtection(ShopScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D97706',
    marginLeft: 6,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
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
    elevation: 2,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  itemFooter: {
    marginBottom: 12,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemPoints: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D97706',
    marginLeft: 4,
  },
  lowStockText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 12,
  },
  redeemButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 6,
  },
  redeemButtonTextDisabled: {
    color: '#9CA3AF',
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
    elevation: 2,
  },
  earnMoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  earnMoreText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  earnMoreButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  earnMoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  bottomPadding: {
    height: 20,
  },
});