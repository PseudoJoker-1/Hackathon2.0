import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Better way to learning\nis calling you!',
    subtitle: 'Learn new things everyday with the\nbest academic experience',
    icon: 'school',
  },
  {
    id: '2',
    title: 'Find yourself by doing\nwhatever you do!',
    subtitle: 'Discover your passion and dive into\nexciting academic opportunities',
    icon: 'people',
  },
  {
    id: '3',
    title: "It's not just learning,\nit's a promise!",
    subtitle: 'Join thousands of students on their\njourney to academic excellence',
    icon: 'trophy',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex });
    } else {
      router.replace('/(auth)/signin');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/signin');
  };

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon as any} size={100} color="#3B82F6" />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
      
      <View style={styles.bottomContainer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentIndex ? '#1E3A8A' : '#E5E7EB' }
              ]}
            />
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextText}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#F8FAFC',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280',
  },
  nextButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

// import React, { useState, useRef } from 'react'
// import { View, Text, Dimensions, TouchableOpacity, FlatList } from 'react-native'
// import { useRouter } from 'expo-router'
// import { Ionicons } from '@expo/vector-icons'
// import { LinearGradient } from 'expo-linear-gradient'

// const { width } = Dimensions.get('window')

// // Данные для онбординга
// const onboardingData = [
//   {
//     id: '1',
//     title: 'Better way to learning\nis calling you!',
//     subtitle: 'Learn new things everyday with the\nbest academic experience',
//     icon: 'school',
//   },
//   {
//     id: '2',
//     title: 'Find yourself by doing\nwhatever you do!',
//     subtitle: 'Discover your passion and dive into\nexciting academic opportunities',
//     icon: 'people',
//   },
//   {
//     id: '3',
//     title: "It's not just learning,\nit's a promise!",
//     subtitle: 'Join thousands of students on their\njourney to academic excellence',
//     icon: 'trophy',
//   },
// ]

// // Экран онбординга с пролистываемыми слайдами
// export default function OnboardingScreen() {
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const flatListRef = useRef<FlatList>(null)
//   const router = useRouter()

//   // Переход к следующему слайду или на экран входа
//   const handleNext = () => {
//     if (currentIndex < onboardingData.length - 1) {
//       const nextIndex = currentIndex + 1
//       setCurrentIndex(nextIndex)
//       flatListRef.current?.scrollToIndex({ index: nextIndex })
//     } else {
//       router.replace('/(auth)/signin')
//     }
//   }

//   // Пропуск онбординга
//   const handleSkip = () => {
//     router.replace('/(auth)/signin')
//   }

//   // Рендер одного слайда
//   const renderItem = ({ item }: { item: typeof onboardingData[0] }) => {
//     return (
//       <View className="items-center justify-center px-10" style={{ width }}>
//         <View className="w-50 h-50 bg-blue-50 rounded-full items-center justify-center mb-10">
//           <Ionicons name={item.icon as any} size={40} color="#3B82F6" />
//         </View>
//         <Text className="text-2xl font-bold text-blue-900 text-center mb-4 leading-8">
//           {item.title}
//         </Text>
//         <Text className="text-base text-gray-500 text-center leading-6">
//           {item.subtitle}
//         </Text>
//       </View>
//     )
//   }

//   return (
//     <LinearGradient colors={['#1E3A8A', '#3B82F6']} className="flex-1">
//       <FlatList
//         ref={flatListRef}
//         data={onboardingData}
//         renderItem={renderItem}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onMomentumScrollEnd={(event) => {
//           const index = Math.round(event.nativeEvent.contentOffset.x / width)
//           setCurrentIndex(index)
//         }}
//       />
      
//       <View className="px-10 pb-12">
//         <View className="flex-row justify-center mb-10">
//           {onboardingData.map((_, index) => (
//             <View 
//               key={index} 
//               className={`w-2.5 h-2.5 rounded-full mx-1 ${
//                 index === currentIndex ? 'bg-white' : 'bg-blue-200'
//               }`}
//             />
//           ))}
//         </View>
//         <View className="flex-row justify-between items-center">
//           <TouchableOpacity onPress={handleSkip}>
//             <Text className="text-base text-blue-200">Skip</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             className="bg-white px-8 py-4 rounded-xl"
//             onPress={handleNext}
//           >
//             <Text className="text-base font-semibold text-blue-900">
//               {currentIndex == onboardingData.length - 1 ? 'Get Started' : 'Next'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </LinearGradient>
//   )
// }

