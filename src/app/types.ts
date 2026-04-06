export interface RecyclingCenter {
  id: string;
  name: string;
  location: string;
  createdAt: string;
}

export interface CollectionRecord {
  id: string;
  area: string;
  plasticCollected: number; // in kg
  date: string;
  status: 'Collected' | 'Sent' | 'Recycled';
  recyclingCenterId?: string;
  collectedAt: string;
}

export interface Complaint {
  id: string;
  area: string;
  description: string;
  date: string;
  status: 'Pending' | 'Resolved';
}

export interface DailyLog {
  date: string;
  totalCollected: number;
  totalRecycled: number;
}
