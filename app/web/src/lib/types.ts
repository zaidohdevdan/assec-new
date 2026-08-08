export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | "PROFESSIONAL" | "PRESIDENT" | "CONTABILIDADE" | "EDITOR";
  cpf: string | null;
  rg: string | null;
  matricula: string | null;
  status: string;
  org: string | null;
  since: string;
  createdAt: string;
  updatedAt: string;
  photoUrl: string | null;
  avatarUrl: string | null;
  specialty: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface ScheduleSlot {
  id: string;
  professionalId: string;
  professional?: User;
  date: string;
  time: string;
  status: string;
  schedule?: Schedule;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  userId: string;
  user?: User;
  slotId: string | null;
  slot?: ScheduleSlot;
  type: string;
  title: string;
  date: string;
  time: string;
  info: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type FinancialType = 'INCOME' | 'EXPENSE';

export interface FinancialRecord {
  id: string;
  description: string;
  amount: number;
  type: FinancialType;
  category: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
}

export interface FinancialStats {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  monthly: MonthlyStats[];
}

export interface Benefit {
  id: string;
  title: string;
  tag: string;
  description: string;
  details: string | null;
  image: string | null;
  icon: string | null;
  location: string | null;
  amenities: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
