import { ReportType } from '@/types'

export const reportTypes: ReportType[] = [
  {
    id: 'electricity',
    name: 'Electricity Issue',
    icon: 'flash-outline',
    color: '#F59E0B'
  },
  {
    id: 'plumbing',
    name: 'Plumbing Problem',
    icon: 'water-outline',
    color: '#3B82F6'
  },
  {
    id: 'furniture',
    name: 'Furniture Damage',
    icon: 'bed-outline',
    color: '#10B981'
  },
  {
    id: 'cleanliness',
    name: 'Cleanliness',
    icon: 'sparkles-outline',
    color: '#8B5CF6'
  },
  {
    id: 'other',
    name: 'Other Issue',
    icon: 'help-circle-outline',
    color: '#6B7280'
  }
]