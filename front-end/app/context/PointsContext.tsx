import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PointsContextType = {
  points: number;
  setPoints: (p: number) => void;
  fetchPoints: () => Promise<void>; // ⬅️ добавляем
};

const PointsContext = createContext<PointsContextType>({
  points: 0,
  setPoints: () => {},
  fetchPoints: async () => {}, 
});

export const PointsProvider = ({ children }: { children: React.ReactNode }) => {
  const [points, setPoints] = useState(0);

  const fetchPoints = async () => {
    const token = await AsyncStorage.getItem('access');
    if (!token) return;
    try {
      // const res = await fetch('https://django-api-1082068772584.us-central1.run.app/api/me/', {
      const res = await fetch('http://localhost:8000/api/me/', { // For local development
        headers: { Authorization: `Bearer ${token}` },
        // mode:'no-cors',
      });
      if (res.ok) {
        const data = await res.json();
        setPoints(data.points || 0);
      }
    } catch (e) {
        console.error('Failed to fetch points:', e);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  return (
    <PointsContext.Provider value={{ points, setPoints, fetchPoints }}>
      {children}
    </PointsContext.Provider>
  );
};


export const usePoints = () => useContext(PointsContext);
// export default PointsProvider;