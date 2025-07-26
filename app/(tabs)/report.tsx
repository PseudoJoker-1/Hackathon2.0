import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import withAuthProtection from '../context/HomeScreen_protected';

const issueTypes = [
  { id: 'light', name: 'Lighting', icon: 'bulb', color: '#F59E0B' },
  { id: 'computer', name: 'Computer', icon: 'desktop', color: '#3B82F6' },
  { id: 'water', name: 'Water/Plumbing', icon: 'water', color: '#14B8A6' },
  { id: 'wifi', name: 'WiFi/Internet', icon: 'wifi', color: '#8B5CF6' },
  { id: 'hvac', name: 'Heating/Cooling', icon: 'thermometer', color: '#EF4444' },
  { id: 'other', name: 'Other', icon: 'warning', color: '#6B7280' },
];

function ReportScreen() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!selectedIssue || !room || !description) {
      Alert.alert('Missing Information', 'Please fill in all fields to submit your report.');
      return;
    }
    
    Alert.alert(
      'Report Submitted!',
      'Thank you for your report. You\'ve earned 50 points! Our team will address this issue soon.',
      [{ text: 'OK' }]
    );
    
    // Reset form
    setSelectedIssue(null);
    setRoom('');
    setDescription('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Report an Issue</Text>
          <Text style={styles.subtitle}>Help us improve campus facilities</Text>
        </View>

        {/* Issue Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What type of issue?</Text>
          <View style={styles.issueGrid}>
            {issueTypes.map((issue) => (
              <TouchableOpacity
                key={issue.id}
                style={[
                  styles.issueCard,
                  selectedIssue === issue.id && styles.issueCardSelected
                ]}
                onPress={() => setSelectedIssue(issue.id)}
              >
                <View style={[styles.issueIcon, { backgroundColor: `${issue.color}20` }]}>
                  <Ionicons name={issue.icon as any} size={24} color={issue.color} />
                </View>
                <Text style={[
                  styles.issueText,
                  selectedIssue === issue.id && styles.issueTextSelected
                ]}>
                  {issue.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Room/Location Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Room or Location</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color="#6B7280" />
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Library Room 204A, Main Hall"
              value={room}
              onChangeText={setRoom}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.textAreaInput}
            placeholder="Describe the issue in detail..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Photo Upload Button */}
        <TouchableOpacity style={styles.photoButton}>
          <Ionicons name="camera" size={20} color="#6B7280" />
          <Text style={styles.photoButtonText}>Add Photo (Optional)</Text>
        </TouchableOpacity>

        {/* Points Preview */}
        <View style={styles.pointsPreview}>
          <Text style={styles.pointsText}>🎯 You'll earn 50 points for this report!</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, (!selectedIssue || !room || !description) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!selectedIssue || !room || !description}
        >
          <Ionicons name="send" size={20} color="white" />
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}
export default withAuthProtection(ReportScreen);

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
    marginTop: 20,
    marginBottom: 32,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  issueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  issueCard: {
    width: '47%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  issueCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  issueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  issueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  issueTextSelected: {
    color: '#2563EB',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  textAreaInput: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: '#111827',
    minHeight: 100,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  photoButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 8,
  },
  pointsPreview: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D97706',
    textAlign: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 20,
  },
});