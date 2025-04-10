
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Child, Chore, Reward } from '../types';
import { children as initialChildren, chores as initialChores, rewards as initialRewards } from '../data/mockData';

interface AppContextType {
  children: Child[];
  chores: Chore[];
  rewards: Reward[];
  addChild: (name: string) => void;
  addChore: (chore: Omit<Chore, 'id'>) => void;
  addReward: (reward: Omit<Reward, 'id'>) => void;
  updateChore: (id: string, updates: Partial<Chore>) => void;
  deleteChore: (id: string) => void;
  updateChild: (id: string, updates: Partial<Child>) => void;
  deleteChild: (id: string) => void;
  updateReward: (id: string, updates: Partial<Reward>) => void;
  deleteReward: (id: string) => void;
  claimReward: (rewardId: string, childId: string) => void;
  markChoreComplete: (choreId: string) => void;
  parentMode: boolean;
  setParentMode: (mode: boolean) => void;
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [childrenState, setChildren] = useState<Child[]>(initialChildren);
  const [choresState, setChores] = useState<Chore[]>(initialChores);
  const [rewardsState, setRewards] = useState<Reward[]>(initialRewards);
  const [parentMode, setParentMode] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  // Helper to generate unique IDs
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addChild = (name: string) => {
    const newChild: Child = {
      id: generateId(),
      name,
      xp: 0
    };
    setChildren([...childrenState, newChild]);
  };

  const updateChild = (id: string, updates: Partial<Child>) => {
    setChildren(childrenState.map(child => 
      child.id === id ? { ...child, ...updates } : child
    ));
  };

  const deleteChild = (id: string) => {
    setChildren(childrenState.filter(child => child.id !== id));
    // Also clean up chores for this child
    setChores(choresState.filter(chore => chore.childId !== id));
  };

  const addChore = (chore: Omit<Chore, 'id'>) => {
    const newChore: Chore = {
      ...chore,
      id: generateId(),
      isCompleted: false
    };
    setChores([...choresState, newChore]);
  };

  const updateChore = (id: string, updates: Partial<Chore>) => {
    setChores(choresState.map(chore => 
      chore.id === id ? { ...chore, ...updates } : chore
    ));
  };

  const deleteChore = (id: string) => {
    setChores(choresState.filter(chore => chore.id !== id));
  };

  const markChoreComplete = (choreId: string) => {
    const chore = choresState.find(c => c.id === choreId);
    if (chore && !chore.isCompleted) {
      // Mark chore as completed
      updateChore(choreId, { isCompleted: true });
      
      // Add XP to the child
      const child = childrenState.find(c => c.id === chore.childId);
      if (child) {
        updateChild(child.id, { xp: child.xp + chore.xp });
      }
    }
  };

  const addReward = (reward: Omit<Reward, 'id'>) => {
    const newReward: Reward = {
      ...reward,
      id: generateId()
    };
    setRewards([...rewardsState, newReward]);
  };

  const updateReward = (id: string, updates: Partial<Reward>) => {
    setRewards(rewardsState.map(reward => 
      reward.id === id ? { ...reward, ...updates } : reward
    ));
  };

  const deleteReward = (id: string) => {
    setRewards(rewardsState.filter(reward => reward.id !== id));
  };

  const claimReward = (rewardId: string, childId: string) => {
    const reward = rewardsState.find(r => r.id === rewardId);
    const child = childrenState.find(c => c.id === childId);
    
    if (reward && child && !reward.claimedBy && child.xp >= reward.cost) {
      // Update the reward
      updateReward(rewardId, { 
        claimedBy: childId, 
        claimedOn: new Date() 
      });
      
      // Deduct XP from child
      updateChild(childId, { xp: child.xp - reward.cost });
    }
  };

  const value = {
    children: childrenState,
    chores: choresState,
    rewards: rewardsState,
    addChild,
    updateChild,
    deleteChild,
    addChore,
    updateChore,
    deleteChore,
    markChoreComplete,
    addReward,
    updateReward,
    deleteReward,
    claimReward,
    parentMode,
    setParentMode,
    selectedChildId,
    setSelectedChildId
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
