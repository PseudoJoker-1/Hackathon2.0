import { create } from 'zustand'
import { Report } from '@/types'
import client from '@/utils/api/client'

// Хранилище Zustand для управления отчетами
export const useReportStore = create((set) => ({
  reports: [],
  selectedReport: null,
  
  // Загружаем все отчеты с сервера
  fetchReports: async () => {
    try {
      const response = await client.get('api/reports/')
      set({ reports: response.data })
    } catch (error) {
      console.error('Ошибка при загрузке отчетов:', error)
    }
  },
  
  // Загружаем конкретный отчет по ID
  fetchReportById: async (id) => {
    try {
      const response = await client.get(`api/reports/${id}/`)
      set({ selectedReport: response.data })
    } catch (error) {
      console.error('Ошибка при загрузке отчета:', error)
    }
  },
  
  // Создаем новый отчет
  createReport: async (report) => {
    try {
      const response = await client.post('api/reports/', report)
      set((state) => ({ 
        reports: [...state.reports, response.data] 
      }))
      return response.data
    } catch (error) {
      console.error('Ошибка при создании отчета:', error)
      throw error
    }
  }
}))