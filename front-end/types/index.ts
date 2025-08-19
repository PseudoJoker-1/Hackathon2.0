// Основные типы данных, которые используются во всем приложении

// Пользователь приложения
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  points: number
  role: 'user' | 'admin'
}

// Сообщение о проблеме
export interface Report {
  id: string
  title: string
  description: string
  type: string
  location: string
  createdAt: string
  status: 'pending' | 'in_progress' | 'resolved'
  userId: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  images?: string[]
}

// Награда в магазине
export interface Reward {
  id: string
  name: string
  description: string
  cost: number
  image: string
}

// Тип проблемы для отчета
export interface ReportType {
  id: string
  name: string
  icon: string
  color: string
}