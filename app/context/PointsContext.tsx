import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PointsContextType = {
  points: number;
  setPoints: (p: number) => void;
};

const PointsContext = createContext<PointsContextType>({
  points: 0,
  setPoints: () => {},
});

export const PointsProvider = ({ children }: { children: React.ReactNode }) => {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchPoints = async () => {
      const token = await AsyncStorage.getItem('access');
      if (!token) return;
      try {
        const res = await fetch('https://django-api-1082068772584.us-central1.run.app/api/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPoints(data.points || 0);
        }
      } catch (e) {
        // handle error if needed
      }
    };
    fetchPoints();
  }, []);

  return (
    <PointsContext.Provider value={{ points, setPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => useContext(PointsContext);