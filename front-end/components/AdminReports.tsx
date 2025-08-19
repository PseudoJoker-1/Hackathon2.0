import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

const reportData = [
  {
    id: 1,
    title: 'Broken Light in Library',
    description: 'Fluorescent light flickering in study area',
    location: 'Library Room 204A',
    reporter: 'Alex Johnson',
    type: 'Lighting',
    status: 'pending',
    priority: 'medium',
    submitted: '2 hours ago',
    points: 50,
  },
  {
    id: 2,
    title: 'Computer Not Working',
    description: 'Desktop computer won\'t turn on',
    location: 'Computer Lab B',
    reporter: 'Sarah Miller',
    type: 'Equipment',
    status: 'in-progress',
    priority: 'high',
    submitted: '4 hours ago',
    points: 75,
  },
  {
    id: 3,
    title: 'WiFi Connection Issues',
    description: 'Intermittent connectivity in dormitory',
    location: 'Dorm Building C',
    reporter: 'John Davis',
    type: 'Network',
    status: 'resolved',
    priority: 'low',
    submitted: '1 day ago',
    points: 50,
  },
]

const statusFilters = ['All', 'Pending', 'In Progress', 'Resolved']

export default function AdminReports() {
  const [selectedFilter, setSelectedFilter] = useState('All')

  // Фильтруем отчеты по выбранному статусу
  const filteredReports = selectedFilter === 'All' 
    ? reportData 
    : reportData.filter(report => report.status === selectedFilter.toLowerCase().replace(' ', '-'))

  // Выбираем цвет в зависимости от статуса
  const getStatusColor = (status: string) => {
    const statusColors = {
      'pending': '#F59E0B',
      'in-progress': '#3B82F6',
      'resolved': '#10B981',
      'default': '#6B7280'
    }
    return statusColors[status] || statusColors.default
  }

  // Выбираем цвет в зависимости от приоритета
  const getPriorityColor = (priority: string) => {
    const priorityColors = {
      'high': '#EF4444',
      'medium': '#F59E0B',
      'low': '#10B981',
      'default': '#6B7280'
    }
    return priorityColors[priority] || priorityColors.default
  }

  // Выбираем иконку в зависимости от статуса
  const getStatusIcon = (status: string) => {
    const statusIcons = {
      'pending': <Ionicons name="time" size={16} color="#F59E0B" />,
      'in-progress': <Ionicons name="warning" size={16} color="#3B82F6" />,
      'resolved': <Ionicons name="checkmark-circle" size={16} color="#10B981" />,
      'default': <Ionicons name="time" size={16} color="#6B7280" />
    }
    return statusIcons[status] || statusIcons.default
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Panel</Text>
          <Text style={styles.subtitle}>Manage campus reports</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="time" size={20} color="#F59E0B"/>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="warning" size={20} color="#3B82F6" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>
        
        <View style={styles.filterContainer}>
          <Ionicons name="filter" size={20} color="#6B7280" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
            {statusFilters.map((filter, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.filterTab, selectedFilter === filter && styles.filterTabActive]} 
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.reportsContainer}>
          {filteredReports.map((report, index) => (
            <View key={index} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportTitleSection}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <View style={styles.reportMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="person" size={12} color="#6B7280" />
                      <Text style={styles.metaText}>{report.reporter}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar" size={12} color="#6B7280" />
                      <Text style={styles.metaText}>{report.submitted}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.priorityBadge}>
                  <View style={[styles.priorityDot, {backgroundColor: getPriorityColor(report.priority)}]}/>
                </View>
              </View>
              
              <Text style={styles.reportDescription}>{report.description}</Text>
              
              <View style={styles.reportLocation}>
                <Ionicons name="location" size={14} color="#6B7280" />
                <Text style={styles.locationText}>{report.location}</Text>
              </View>
              
              <View style={styles.reportFooter}>
                <View style={styles.statusSection}>
                  {getStatusIcon(report.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                    {report.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </View>
                <Text style={styles.pointsText}>{report.points} pts</Text>
              </View>
              
              {report.status !== 'resolved' && (
                <View style={styles.actionButtons}>
                  {report.status === 'pending' && (
                    <TouchableOpacity style={styles.assignButton}>
                      <Text style={styles.assignButtonText}>Assign to Staff</Text>
                    </TouchableOpacity>
                  )}
                  {report.status === 'in-progress' && (
                    <TouchableOpacity style={styles.resolveButton}>
                      <Ionicons name="checkmark-circle" size={16} color="white" />
                      <Text style={styles.resolveButtonText}>Mark Resolved</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.bottomPadding} />
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
    paddingHorizontal: 20,
  },
  header: {
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  filterTabs: {
    marginLeft: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  reportsContainer: {
    gap: 16,
  },
  reportCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportTitleSection: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  reportMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  priorityBadge: {
    marginLeft: 12,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  reportDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  reportLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  assignButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  assignButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  resolveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
  },
  resolveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 6,
  },
  bottomPadding: {
    height: 20,
  },
})