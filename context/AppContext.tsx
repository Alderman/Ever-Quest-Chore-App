import React, { createContext, useContext, useState } from 'react';
import { AppState, Child, Chore, Reward } from '../types';

// Define types (from the original file, moved to types.ts)
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
  frequency: 'daily' | 'weekly' | 'once';
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


// Mock data for initial development (from edited code)
const MOCK_CHILDREN: Child[] = [
  { id: '1', name: 'Emma', xp: 120 },
  { id: '2', name: 'Noah', xp: 85 },
];

const MOCK_CHORES: Chore[] = [
  { id: '1', title: 'Clean room', xp: 20, childId: '1', isCompleted: false, frequency: 'daily' },
  { id: '2', title: 'Take out trash', xp: 15, childId: '2', isCompleted: true, frequency: 'daily' },
  { id: '3', title: 'Do homework', xp: 30, childId: '1', isCompleted: false, frequency: 'daily' },
];

const MOCK_REWARDS: Reward[] = [
  { id: '1', name: 'Ice cream', icon: '🍦', cost: 50 },
  { id: '2', name: 'Movie night', icon: '🎬', cost: 100 },
  { id: '3', name: 'Video game time', icon: '🎮', cost: 75 },
];

interface AppContextType {
  state: AppState;
  addChild: (name: string) => void;
  updateChild: (id: string, data: Partial<Child>) => void;
  deleteChild: (id: string) => void;
  addChore: (chore: Omit<Chore, 'id'>) => void;
  updateChore: (id: string, data: Partial<Chore>) => void;
  deleteChore: (id: string) => void;
  completeChore: (id: string) => void;
  addReward: (reward: Omit<Reward, 'id'>) => void;
  updateReward: (id: string, data: Partial<Reward>) => void;
  deleteReward: (id: string) => void;
  claimReward: (rewardId: string, childId: string) => void;
  switchToChild: (childId: string, childName: string, childXp: number) => void;
  switchToParent: () => void;
}

const initialState: AppState = {
  children: MOCK_CHILDREN,
  chores: MOCK_CHORES,
  rewards: MOCK_REWARDS,
  currentChildId: null,
  currentChildName: null,
  currentChildXp: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const addChild = (name: string) => {
    const newChild: Child = {
      id: Date.now().toString(),
      name,
      xp: 0,
    };
    setState(prev => ({
      ...prev,
      children: [...prev.children, newChild],
    }));
  };

  const updateChild = (id: string, data: Partial<Child>) => {
    setState(prev => ({
      ...prev,
      children: prev.children.map(child =>
        child.id === id ? { ...child, ...data } : child
      ),
    }));
  };

  const deleteChild = (id: string) => {
    setState(prev => ({
      ...prev,
      children: prev.children.filter(child => child.id !== id),
      chores: prev.chores.filter(chore => chore.childId !== id),
    }));
  };

  const addChore = (chore: Omit<Chore, 'id'>) => {
    const newChore: Chore = {
      ...chore,
      id: Date.now().toString(),
    };
    setState(prev => ({
      ...prev,
      chores: [...prev.chores, newChore],
    }));
  };

  const updateChore = (id: string, data: Partial<Chore>) => {
    setState(prev => ({
      ...prev,
      chores: prev.chores.map(chore =>
        chore.id === id ? { ...chore, ...data } : chore
      ),
    }));
  };

  const deleteChore = (id: string) => {
    setState(prev => ({
      ...prev,
      chores: prev.chores.filter(chore => chore.id !== id),
    }));
  };

  const completeChore = (id: string) => {
    const chore = state.chores.find(c => c.id === id);
    if (!chore) return;

    // Mark chore as completed
    updateChore(id, { isCompleted: true });

    // Add XP to child
    const child = state.children.find(c => c.id === chore.childId);
    if (child) {
      updateChild(child.id, { xp: child.xp + chore.xp });
    }
  };

  const addReward = (reward: Omit<Reward, 'id'>) => {
    const newReward: Reward = {
      ...reward,
      id: Date.now().toString(),
    };
    setState(prev => ({
      ...prev,
      rewards: [...prev.rewards, newReward],
    }));
  };

  const updateReward = (id: string, data: Partial<Reward>) => {
    setState(prev => ({
      ...prev,
      rewards: prev.rewards.map(reward =>
        reward.id === id ? { ...reward, ...data } : reward
      ),
    }));
  };

  const deleteReward = (id: string) => {
    setState(prev => ({
      ...prev,
      rewards: prev.rewards.filter(reward => reward.id !== id),
    }));
  };

  const claimReward = (rewardId: string, childId: string) => {
    const reward = state.rewards.find(r => r.id === rewardId);
    const child = state.children.find(c => c.id === childId);

    if (!reward || !child || child.xp < reward.cost) return;

    // Update reward as claimed
    updateReward(rewardId, {
      claimedBy: childId,
      claimedOn: new Date(),
    });

    // Deduct XP from child
    updateChild(childId, { xp: child.xp - reward.cost });
  };

  const switchToChild = (childId: string, childName: string, childXp: number) => {
    setState(prev => ({
      ...prev,
      currentChildId: childId,
      currentChildName: childName,
      currentChildXp: childXp,
    }));
  };

  const switchToParent = () => {
    setState(prev => ({
      ...prev,
      currentChildId: null,
      currentChildName: null,
      currentChildXp: null,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addChild,
        updateChild,
        deleteChild,
        addChore,
        updateChore,
        deleteChore,
        completeChore,
        addReward,
        updateReward,
        deleteReward,
        claimReward,
        switchToChild,
        switchToParent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};