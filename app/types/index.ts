
export interface Child {
  id: string;
  name: string;
  xp: number;
}

export interface Chore {
  id: string;
  title: string;
  description?: string;
  xp: number;
  childId: string;
  isCompleted: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';
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
