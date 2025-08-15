import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const statusFilters = ['All', 'Pending', 'Resolved'];
const BASE_URL = 'https://django-api-1082068772584.us-central1.run.app';

// Helper to refresh token
async function refreshToken() {
  const refresh = await AsyncStorage.getItem('refresh');
  if (!refresh) return null;
  try {
    const res = await fetch(`${BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.access) {
        await AsyncStorage.setItem('access', data.access);
        return data.access;
      }
    }
  } catch {}
  return null;
}

export default function AdminReports() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [oneNumber, setOneNumber] = useState<string | number>();
  const [roomMap, setRoomMap] = useState<Record<number, string>>({});

  const fetchReports = useCallback(async () => {
    setLoading(true);
    let token = await AsyncStorage.getItem('access');
    let triedRefresh = false;

    while (true) {
      try {
        const res = await fetch(`${BASE_URL}/api/reports/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log('Reports API response:', data);

        // Handle expired token
        if (
          data &&
          typeof data === 'object' &&
          data.code === 'token_not_valid' &&
          !triedRefresh
        ) {
          token = await refreshToken();
          if (token) {
            triedRefresh = true;
            continue; // retry with new token
          } else {
            Alert.alert('Session expired', 'Please sign in again.');
            setReports([]);
            break;
          }
        }

        if (Array.isArray(data)) {
          setReports(data);
        } else if (Array.isArray(data.results)) {
          setReports(data.results);
        } else {
          setReports([]);
        }
        break;
      } catch (e) {
        Alert.alert('Error', 'Failed to load reports');
        setReports([]);
        break;
      } finally {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchReports();
    const fetchRoomNumbers = async () => {
      const token = await AsyncStorage.getItem('access');
      if (!token) return;

      try {
        const res = await fetch(`${BASE_URL}/api/rooms/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const rooms: { id: number; number: string | number }[] = await res.json();
          const roomMap: Record<number, string> = {};
          rooms.forEach(room => {
            roomMap[room.id] = room.number.toString();
          });
          setRoomMap(roomMap);
        }
      } catch (e) {
        console.error('Failed to fetch room numbers:', e);
      }
    };
    fetchRoomNumbers();
  }, [fetchReports,]);

  const handleResolve = async (reportId: number) => {
    const token = await AsyncStorage.getItem('access');
    try {
      const res = await fetch(`${BASE_URL}/api/reports/${reportId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'resolved' }),
      });
      if (res.ok) {
        fetchReports();
      } else {
        Alert.alert('Error', 'Failed to update status');
      }
    } catch {
      Alert.alert('Error', 'Failed to update status');
    }
  };
  const filteredReports =
    selectedFilter === 'All'
      ? reports
      : reports.filter((report) => report.status === selectedFilter.toLowerCase());

  // Dynamic stats
  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'resolved': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Ionicons name="time" size={16} color="#F59E0B" />;
      case 'resolved':
        return <Ionicons name="checkmark-circle" size={16} color="#10B981" />;
      default:
        return <Ionicons name="time" size={16} color="#6B7280" />;
    }
  };
  

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Admin Panel</Text>
          <Text style={styles.subtitle}>Manage campus reports</Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="time" size={20} color="#F59E0B" />
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.statNumber}>{resolvedCount}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <Ionicons name="filter" size={20} color="#6B7280" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterTabs}
          >
            {statusFilters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  selectedFilter === filter && styles.filterTabActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Reports List */}
        <View style={styles.reportsContainer}>
          {filteredReports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportTitleSection}>
                  <Text style={styles.reportTitle}>{report.title || report.report_type}</Text>
                  <View style={styles.reportMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="person" size={12} color="#6B7280" />
                      <Text style={styles.metaText}>{report.reporter || report.username || 'User'}</Text>
                    </View>
                    <View className="metaItem">
                      <Ionicons name="calendar" size={12} color="#6B7280" />
                      <Text style={styles.metaText}>{report.submitted || report.report_date || ''}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.priorityBadge}>
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor: getPriorityColor(report.priority || 'low') },
                    ]}
                  />
                </View>
              </View>

              <Text style={styles.reportDescription}>{report.description}</Text>

              <View style={styles.reportLocation}>
                <Ionicons name="location" size={14} color="#6B7280" />
                <Text style={styles.locationText}>{roomMap[Number(report.room)] ?? `#${report.room}`}</Text>
              </View>

              <View style={styles.reportFooter}>
                <View style={styles.statusSection}>
                  {getStatusIcon(report.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                    {report.status
                      ? report.status.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
                      : ''}
                  </Text>
                </View>
                <Text style={styles.pointsText}>{report.points || 0} pts</Text>
              </View>

              {report.status !== 'resolved' && (
                <View style={styles.actionButtons}>
                  {report.status === 'pending' && (
                    <TouchableOpacity style={styles.assignButton} onPress={() => Alert.alert('Assign', 'Assign to staff logic here')}>
                      <Text style={styles.assignButtonText}>Assign to Staff</Text>
                    </TouchableOpacity>
                  )}
                  {report.status === 'in-progress' && (
                    <TouchableOpacity
                      style={styles.resolveButton}
                      onPress={() => handleResolve(report.id)}
                    >
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
  );
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
});