import React,{useEffect} from 'react'
import { useReportStore } from './reportSlice'


export const useReports = () => {
  const { reports,fetchReports } = useReportStore()
  
  useEffect(()=>{
    fetchReports()
  },[])

  return {
    reports,
  }
}