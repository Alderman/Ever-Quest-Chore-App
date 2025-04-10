import React, { createContext, useState, useContext } from 'react';
import { Child, Chore, Reward } from '../types';

// Mock data
const MOCK_CHILDREN: Child[] = [
  { id: '1', name: 'Emma', xp: 120 },
  { id: '2', name: 'Noah', xp: 85 },
];

const MOCK_CHORES: Chore[] = [
  { 
    id: '1', 
    title: 'Clean Room', 
    description: 'Make bed and pick up toys', 
    xp: 20, 
    childId: '1', 
    isCompleted: false, 
    frequency: 'daily' 
  },
  { 
    id: '2', 
    title: 'Take out Trash', 
    xp: 10, 
    childId: '2', 
    isCompleted: true, 
    frequency: 'weekly',
    frequencyDays: 1
  },
];

const MOCK_REWARDS: Reward[] = [
  { id: '1', name: 'Ice Cream', cost: 50 },
  { id: '2', name: 'Movie Night', cost: 100 },
];

type AppContextType = {
  children: Child[];
  chores: Chore[];
  rewards: Reward[];
  currentChildId: string | null;
  setCurrentChildId: (id: string | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [appChildren, setAppChildren] = useState<Child[]>(MOCK_CHILDREN);
  const [appChores, setAppChores] = useState<Chore[]>(MOCK_CHORES);
  const [appRewards, setAppRewards] = useState<Reward[]>(MOCK_REWARDS);
  const [currentChildId, setCurrentChildId] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        children: appChildren,
        chores: appChores,
        rewards: appRewards,
        currentChildId,
        setCurrentChildId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}