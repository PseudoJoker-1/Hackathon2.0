import {create} from 'zustand';
import { Report } from '@/types';
import client from '@/utils/api/client'

export const useReportStore = create((set) => ({
  reports: [],
  selectedReport: null,
  
  fetchReports: async () => {
    const response = await client.get('/reports/');
    set({ reports: response.data });
  },
  
  fetchReportById: async (id) => {
    const response = await client.get(`/reports/${id}/`);
    set({ selectedReport: response.data });
  },
  
  createReport: async (report) => {
    const response = await client.post('/reports/', report);
    set((state) => ({ 
      reports: [...state.reports, response.data] 
    }));
  }
}));