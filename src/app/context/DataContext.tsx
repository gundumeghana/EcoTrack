import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RecyclingCenter, CollectionRecord, Complaint, DailyLog } from '../types';

import { db } from "../../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

interface DataContextType {
  recyclingCenters: RecyclingCenter[];
  collectionRecords: CollectionRecord[];
  complaints: Complaint[];
  dailyLogs: DailyLog[];
  addRecyclingCenter: (center: Omit<RecyclingCenter, 'id' | 'createdAt'>) => void;
  addCollectionRecord: (record: Omit<CollectionRecord, 'id' | 'collectedAt'>) => void;
  updateCollectionStatus: (id: string, status: CollectionRecord['status']) => void;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => void;
  getStats: () => {
    totalCollected: number;
    totalRecycled: number;
    totalPending: number;
    recyclingEfficiency: number;
  };
  getAreaStats: () => { area: string; collected: number; recycled: number }[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recyclingCenters, setRecyclingCenters] = useState<RecyclingCenter[]>([]);
  const [collectionRecords, setCollectionRecords] = useState<CollectionRecord[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);

  // 🔥 collectionRecords
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "collectionRecords"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CollectionRecord[];

      setCollectionRecords(data);
    });
    return () => unsubscribe();
  }, []);

  // 🔥 complaints
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "complaints"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComplaints(data as any);
    });
    return () => unsubscribe();
  }, []);

  // 🔥 recyclingCenters
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "recyclingCenters"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecyclingCenters(data as any);
    });
    return () => unsubscribe();
  }, []);

  // 🔥 ADD FUNCTIONS
  const addCollectionRecord = async (record: Omit<CollectionRecord, 'id' | 'collectedAt'>) => {
    await addDoc(collection(db, "collectionRecords"), {
      ...record,
      collectedAt: new Date().toISOString()
    });
  };

  const addComplaint = async (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => {
    await addDoc(collection(db, "complaints"), {
      ...complaint,
      date: new Date().toISOString(),
      status: "Pending"
    });
  };

  const addRecyclingCenter = async (center: Omit<RecyclingCenter, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, "recyclingCenters"), {
      ...center,
      createdAt: new Date().toISOString(),
    });
  };

  const updateCollectionStatus = (id: string, status: CollectionRecord['status']) => {
    setCollectionRecords(prev =>
      prev.map(record => (record.id === id ? { ...record, status } : record))
    );
  };

  const getStats = () => {
    const totalCollected = collectionRecords.reduce((sum, r) => sum + r.plasticCollected, 0);
    const totalRecycled = collectionRecords
      .filter(r => r.status === 'Recycled')
      .reduce((sum, r) => sum + r.plasticCollected, 0);
    const totalPending = totalCollected - totalRecycled;

    const recyclingEfficiency = totalCollected > 0
      ? (totalRecycled / totalCollected) * 100
      : 0;

    return { totalCollected, totalRecycled, totalPending, recyclingEfficiency };
  };

  const getAreaStats = () => {
    const map = new Map<string, { collected: number; recycled: number }>();

    collectionRecords.forEach(r => {
      if (!map.has(r.area)) {
        map.set(r.area, { collected: 0, recycled: 0 });
      }
      const stats = map.get(r.area)!;
      stats.collected += r.plasticCollected;
      if (r.status === 'Recycled') stats.recycled += r.plasticCollected;
    });

    return Array.from(map.entries()).map(([area, stats]) => ({
      area,
      ...stats,
    }));
  };

  return (
    <DataContext.Provider
      value={{
        recyclingCenters,
        collectionRecords,
        complaints,
        dailyLogs,
        addRecyclingCenter,
        addCollectionRecord,
        updateCollectionStatus,
        addComplaint,
        getStats,
        getAreaStats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};