
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types
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

export interface ChoreStats {
  completed: number;
  total: number;
}

interface AppContextType {
  // Child management
  children: Child[];
  addChild: (child: Omit<Child, 'id'>) => void;
  updateChild: (id: string, child: Partial<Child>) => void;
  deleteChild: (id: string) => void;
  
  // Chore management
  chores: Chore[];
  addChore: (chore: Omit<Chore, 'id'>) => void;
  updateChore: (id: string, chore: Partial<Chore>) => void;
  deleteChore: (id: string) => void;
  toggleChoreCompletion: (id: string, isCompleted: boolean) => void;
  
  // Reward management
  rewards: Reward[];
  addReward: (reward: Omit<Reward, 'id'>) => void;
  updateReward: (id: string, reward: Partial<Reward>) => void;
  deleteReward: (id: string) => void;
  claimReward: (rewardId: string, childId: string) => void;
  
  // Child view state
  isChildMode: boolean;
  activeChildId: string | null;
  activeChildName: string;
  activeChildXp: number;
  switchToChildMode: (childId: string, childName: string, childXp: number) => void;
  switchToParentMode: () => void;
  
  // Helper functions
  getChoreStats: (childId: string) => ChoreStats;
  getNextRewardCost: (childId: string) => number | null;
}

// Create context with default values
const AppContext = createContext<AppContextType>({
  children: [],
  addChild: () => {},
  updateChild: () => {},
  deleteChild: () => {},
  
  chores: [],
  addChore: () => {},
  updateChore: () => {},
  deleteChore: () => {},
  toggleChoreCompletion: () => {},
  
  rewards: [],
  addReward: () => {},
  updateReward: () => {},
  deleteReward: () => {},
  claimReward: () => {},
  
  isChildMode: false,
  activeChildId: null,
  activeChildName: '',
  activeChildXp: 0,
  switchToChildMode: () => {},
  switchToParentMode: () => {},
  
  getChoreStats: () => ({ completed: 0, total: 0 }),
  getNextRewardCost: () => null,
});

// Mock initial data for development
const MOCK_CHILDREN: Child[] = [
  { id: '1', name: 'Emma', xp: 120 },
  { id: '2', name: 'Noah', xp: 85 },
];

const MOCK_CHORES: Chore[] = [
  { 
    id: '1', 
    title: 'Clean bedroom', 
    description: 'Make bed and put away toys', 
    xp: 20, 
    childId: '1', 
    isCompleted: false, 
    frequency: 'daily' 
  },
  { 
    id: '2', 
    title: 'Take out trash', 
    xp: 15, 
    childId: '1', 
    isCompleted: true, 
    frequency: 'weekly',
    frequencyDays: 2
  },
  { 
    id: '3', 
    title: 'Homework', 
    description: 'Complete math worksheet', 
    xp: 30, 
    childId: '2', 
    isCompleted: false, 
    frequency: 'daily' 
  },
];

const MOCK_REWARDS: Reward[] = [
  {
    id: '1',
    name: 'Extra screen time',
    icon: 'tablet',
    cost: 50,
  },
  {
    id: '2',
    name: 'Ice cream trip',
    icon: 'ice-cream',
    cost: 150,
  },
  {
    id: '3',
    name: 'New toy',
    icon: 'toy-brick',
    cost: 200,
    claimedBy: '1',
    claimedOn: new Date(),
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [childrenState, setChildrenState] = useState<Child[]>(MOCK_CHILDREN);
  const [choresState, setChoresState] = useState<Chore[]>(MOCK_CHORES);
  const [rewardsState, setRewardsState] = useState<Reward[]>(MOCK_REWARDS);
  
  // Child view state
  const [isChildMode, setIsChildMode] = useState(false);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [activeChildName, setActiveChildName] = useState<string>('');
  const [activeChildXp, setActiveChildXp] = useState<number>(0);
  
  // Child management
  const addChild = (child: Omit<Child, 'id'>) => {
    const newChild = {
      ...child,
      id: Date.now().toString(), // Simple ID generation
    };
    setChildrenState([...childrenState, newChild]);
  };
  
  const updateChild = (id: string, childUpdates: Partial<Child>) => {
    setChildrenState(
      childrenState.map(child => 
        child.id === id ? { ...child, ...childUpdates } : child
      )
    );
  };
  
  const deleteChild = (id: string) => {
    setChildrenState(childrenState.filter(child => child.id !== id));
  };
  
  // Chore management
  const addChore = (chore: Omit<Chore, 'id'>) => {
    const newChore = {
      ...chore,
      id: Date.now().toString(),
    };
    setChoresState([...choresState, newChore]);
  };
  
  const updateChore = (id: string, choreUpdates: Partial<Chore>) => {
    setChoresState(
      choresState.map(chore => 
        chore.id === id ? { ...chore, ...choreUpdates } : chore
      )
    );
  };
  
  const deleteChore = (id: string) => {
    setChoresState(choresState.filter(chore => chore.id !== id));
  };
  
  const toggleChoreCompletion = (id: string, isCompleted: boolean) => {
    const chore = choresState.find(c => c.id === id);
    if (chore) {
      setChoresState(
        choresState.map(c => 
          c.id === id ? { ...c, isCompleted } : c
        )
      );
      
      // If completing a chore, award XP to the child
      if (isCompleted && !chore.isCompleted) {
        const childToUpdate = childrenState.find(child => child.id === chore.childId);
        if (childToUpdate) {
          updateChild(childToUpdate.id, { xp: childToUpdate.xp + chore.xp });
          
          // Update active child XP if in child mode
          if (isChildMode && activeChildId === childToUpdate.id) {
            setActiveChildXp(childToUpdate.xp + chore.xp);
          }
        }
      }
      
      // If uncompleting a chore, remove XP from the child
      if (!isCompleted && chore.isCompleted) {
        const childToUpdate = childrenState.find(child => child.id === chore.childId);
        if (childToUpdate) {
          updateChild(childToUpdate.id, { xp: Math.max(0, childToUpdate.xp - chore.xp) });
          
          // Update active child XP if in child mode
          if (isChildMode && activeChildId === childToUpdate.id) {
            setActiveChildXp(Math.max(0, childToUpdate.xp - chore.xp));
          }
        }
      }
    }
  };
  
  // Reward management
  const addReward = (reward: Omit<Reward, 'id'>) => {
    const newReward = {
      ...reward,
      id: Date.now().toString(),
    };
    setRewardsState([...rewardsState, newReward]);
  };
  
  const updateReward = (id: string, rewardUpdates: Partial<Reward>) => {
    setRewardsState(
      rewardsState.map(reward => 
        reward.id === id ? { ...reward, ...rewardUpdates } : reward
      )
    );
  };
  
  const deleteReward = (id: string) => {
    setRewardsState(rewardsState.filter(reward => reward.id !== id));
  };
  
  const claimReward = (rewardId: string, childId: string) => {
    const reward = rewardsState.find(r => r.id === rewardId);
    const child = childrenState.find(c => c.id === childId);
    
    if (reward && child && child.xp >= reward.cost && !reward.claimedBy) {
      // Update the reward
      updateReward(rewardId, {
        claimedBy: childId,
        claimedOn: new Date(),
      });
      
      // Deduct XP from child
      updateChild(childId, { xp: child.xp - reward.cost });
      
      // Update active child XP if in child mode
      if (isChildMode && activeChildId === childId) {
        setActiveChildXp(child.xp - reward.cost);
      }
    }
  };
  
  // Child view management
  const switchToChildMode = (childId: string, childName: string, childXp: number) => {
    setActiveChildId(childId);
    setActiveChildName(childName);
    setActiveChildXp(childXp);
    setIsChildMode(true);
  };
  
  const switchToParentMode = () => {
    setIsChildMode(false);
  };
  
  // Helper functions
  const getChoreStats = (childId: string): ChoreStats => {
    const childChores = choresState.filter(chore => chore.childId === childId);
    const completed = childChores.filter(chore => chore.isCompleted).length;
    const total = childChores.length;
    
    return { completed, total };
  };
  
  const getNextRewardCost = (childId: string): number | null => {
    const availableRewards = rewardsState
      .filter(reward => !reward.claimedBy)
      .sort((a, b) => a.cost - b.cost);
    
    const child = childrenState.find(c => c.id === childId);
    if (!child) return null;
    
    // Find the cheapest reward the child can't yet afford
    const nextReward = availableRewards.find(reward => reward.cost > child.xp);
    return nextReward ? nextReward.cost : null;
  };
  
  const value = {
    children: childrenState,
    addChild,
    updateChild,
    deleteChild,
    
    chores: choresState,
    addChore,
    updateChore,
    deleteChore,
    toggleChoreCompletion,
    
    rewards: rewardsState,
    addReward,
    updateReward,
    deleteReward,
    claimReward,
    
    isChildMode,
    activeChildId,
    activeChildName,
    activeChildXp,
    switchToChildMode,
    switchToParentMode,
    
    getChoreStats,
    getNextRewardCost,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
