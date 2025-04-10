
export interface Child {
  id: string;
  name: string;
  xp: number;
}

export interface ChoreStats {
  completed: number;
  total: number;
}

export interface Chore {
  id: string;
  title: string;
  description?: string;
  xp: number;
  childId: string;
  isCompleted: boolean;
  frequency: string;
  frequencyDays?: number;
}

export interface Reward {
  id: string;
  name: string;
  icon?: string;
  cost: number;
  claimedBy?: string;
  claimedOn?: Date;
}

export interface AppState {
  children: Child[];
  chores: Chore[];
  rewards: Reward[];
  currentChildId: string | null;
  currentChildName: string | null;
  currentChildXp: number | null;
}
