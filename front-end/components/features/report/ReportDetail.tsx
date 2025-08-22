import { View, Text, StyleSheet, Image } from 'react-native';
import { Report } from '@/types';
// import { formatDate } from '@/utils/helpers/formatters';
import { reportTypes } from '@/utils/constants/reportTypes';

interface ReportDetailProps {
  report: Report;
}

export const ReportDetail = ({ report }: ReportDetailProps) => {
  const reportType = reportTypes.find(type => type.id === report.type);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          {reportType?.icon && (
            <Image source={reportType.icon}/>
          )}
          <Text style={[styles.type, { color: reportType?.color }]}>
            {reportType?.name}
          </Text>
        </View>
        {/* <Text style={styles.date}>{formatDate(report.createdAt)}</Text> */}
      </View>
      
      <Text style={styles.title}>{report.title}</Text>
      <Text style={styles.description}>{report.description}</Text>
      
      <View style={styles.userInfo}>
        <Image 
          source={{ uri: report.user.avatar }} 
          style={styles.avatar} 
        />
        <Text style={styles.userName}>{report.user.name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    color: '#475569',
  }
});