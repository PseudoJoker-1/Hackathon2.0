import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useReportStore } from '@/features/report/reportSlice';
import { useEffect } from 'react';
import { ReportDetail } from '@/components/features/report/ReportDetail';
// import { ImageUploader } from '@/components/ui/ImageUploader';
import { Button } from '@/components/ui/Button';

export default function ReportDetailsPage() {
  const { id } = useLocalSearchParams();
  const { selectedReport, fetchReportById } = useReportStore();
  
  useEffect(() => {
    if (id) {
      fetchReportById(id as string);
    }
  }, [id]);

  const handleImageUpload = async (uri: string) => {
    // Implement image upload logic
  };

  if (!selectedReport) {
    return (
      <View style={styles.loadingContainer}>
        {/* <ActivityIndicator size="large" color="#1E3A8A" /> */}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ReportDetail report={selectedReport} />
      
      <View style={styles.uploadContainer}>
        {/* <Text style={styles.uploadTitle}>Attach Photo</Text> */}
        {/* <ImageUploader onImageSelected={handleImageUpload} /> */}
        
        {/* <Button 
          title="Submit Report" 
          onPress={() => console.log('Report submitted')}
          fullWidth
          style={styles.submitButton}
        /> */}
      </View>
    </ScrollView>
  );
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
  uploadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1E293B',
  },
  submitButton: {
    marginTop: 24,
  }
});