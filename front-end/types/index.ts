export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    points: number;
    role: 'student' | 'admin' | 'staff';
  }
  
  export interface Report {
    id: string;
    title: string;
    description: string;
    type: string;
    location: string;
    createdAt: string;
    status: 'pending' | 'in_progress' | 'resolved';
    userId: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
    images?: string[];
  }
  
  export interface Reward {
    id: string;
    name: string;
    description: string;
    cost: number;
    image: string;
  }
  
  export interface ReportType {
    id: string;
    name: string;
    icon: string;
    color: string;
  }