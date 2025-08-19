// admin page
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import client from '@/utils/api/client'
import { ENDPOINTS } from '@/utils/api/endpoints'

interface Report {
  id: number
  report_type: string
  description: string
  status: string
  room: number
}

const statusColors: Record<string, string> = {
  pending: '#F59E0B',
  resolved: '#10B981',
  urgent: '#EF4444'
}

export default function AdminsScreen() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    try {
      const response = await client.get(ENDPOINTS.REPORTS)
      setReports(response.data)
    } catch (error) {
      console.error('Failed to load reports:', error)
      Alert.alert('Error', 'Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await client.patch(`${ENDPOINTS.REPORTS}${id}/`, {
        status: newStatus,
      })

      if (response.status === 200) {
        Alert.alert('Success', `Marked as ${newStatus}`)
        fetchReports()
      } else {
        Alert.alert('Error', 'Failed to update status')
      }
    } catch (error: any) {
      console.error('Update error:', error)
      Alert.alert('Error', error.response?.data?.message || 'Request failed')
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  if (loading) {
    return <ActivityIndicator size="large" color="#2563EB" style={{ flex: 1 }} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>All Reports</Text>

        {reports.map((report) => (
          <View key={report.id} style={styles.reportCard}>
            <View style={styles.headerRow}>
              <Text style={styles.reportTitle}>{report.report_type}</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${statusColors[report.status]}20` }]}>
                <Text style={[styles.statusText, { color: statusColors[report.status] }]}>
                  {report.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.description}>{report.description}</Text>

            <View style={styles.actionsRow}>
              {report.status !== 'resolved' && (
                <TouchableOpacity onPress={() => updateStatus(report.id, 'resolved')} style={styles.button}>
                  <Ionicons name="checkmark" size={16} color="white" />
                  <Text style={styles.buttonText}>Resolve</Text>
                </TouchableOpacity>
              )}
              {report.status !== 'urgent' && (
                <TouchableOpacity 
                  onPress={() => updateStatus(report.id, 'urgent')} 
                  style={[styles.button, { backgroundColor: '#EF4444' }]}
                >
                  <Ionicons name="alert-circle" size={16} color="white" />
                  <Text style={styles.buttonText}>Mark Urgent</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {reports.length === 0 && (
          <Text style={styles.emptyText}>No reports available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 20 },
  reportCard: { backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 16, elevation: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reportTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontWeight: '600' },
  description: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563EB', padding: 10, borderRadius: 12 },
  buttonText: { color: 'white', fontWeight: '600', marginLeft: 6 },
  emptyText: { textAlign: 'center', color: '#6B7280', marginTop: 32, fontSize: 16 }
})
