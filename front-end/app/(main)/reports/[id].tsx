import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useReportStore } from '@/features/report/reportSlice'
import { useEffect } from 'react'
import { ReportDetail } from '@/components/features/report/ReportDetail'
import { Button } from '@/components/ui/Button'

export default function ReportDetailsPage(){
  const { id } = useLocalSearchParams()
  const { selectedReport, fetchReportById } = useReportStore()

  useEffect(()=>{
    if(id){
      fetchReportById(id as string)
    }
  },[id])

  // Обрабатываем загрузку изображений
  const handleImageUpload = async (uri: string) => {
    // тут будет логика загрузки изображений
    console.log('uploading image',uri)
  }
  // Показываем загрузку пока данные не получены
  if(!selectedReport){
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <ReportDetail report={selectedReport} />
      
      <View style={styles.uploadContainer}>
        <Button 
          title="Submit Report" 
          onPress={() => console.log('Report submitted')} 
          fullWidth 
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  submitButton: {
    marginTop: 24,
  }
})