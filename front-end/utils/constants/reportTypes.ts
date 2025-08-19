import { ReportType } from '@/types'

// все возможные типы проблем, которые можно report-ить

export const reportTypes: ReportType[] = [
  {
    id: 'electricity',
    name: 'Electricity Issue',
    icon: 'flash-outline',
    color: '#F59E0B'  // оранжевый для электричества
  },
  {
    id: 'plumbing',
    name: 'Plumbing Problem',
    icon: 'water-outline',
    color: '#3B82F6'  // синий для водопровода
  },
  {
    id: 'furniture',
    name: 'Furniture Damage',
    icon: 'bed-outline',
    color: '#10B981'  // зеленый для мебели
  },
  {
    id: 'cleanliness',
    name: 'Cleanliness',
    icon: 'sparkles-outline',
    color: '#8B5CF6'  // фиолетовый для чистоты
  },
  {
    id: 'other',
    name: 'Other Issue',
    icon: 'help-circle-outline',
    color: '#6B7280'  // серый для других проблем
  }
]