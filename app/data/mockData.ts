
import { Child, Chore, Reward } from '../types';

export const children: Child[] = [
  { id: '1', name: 'Emma', xp: 120 },
  { id: '2', name: 'Noah', xp: 85 },
  { id: '3', name: 'Olivia', xp: 200 }
];

export const chores: Chore[] = [
  {
    id: '1', 
    title: 'Make bed', 
    description: 'Straighten sheets and arrange pillows', 
    xp: 10, 
    childId: '1', 
    isCompleted: false,
    frequency: 'daily'
  },
  {
    id: '2', 
    title: 'Take out trash', 
    description: 'Empty all trash cans and take to curb', 
    xp: 15, 
    childId: '2', 
    isCompleted: true,
    frequency: 'weekly'
  },
  {
    id: '3', 
    title: 'Feed pet', 
    xp: 5, 
    childId: '3', 
    isCompleted: false,
    frequency: 'daily'
  },
  {
    id: '4', 
    title: 'Clean room', 
    description: 'Vacuum, dust, and organize', 
    xp: 25, 
    childId: '1', 
    isCompleted: false,
    frequency: 'weekly'
  }
];

export const rewards: Reward[] = [
  {
    id: '1',
    name: 'Extra screen time',
    icon: '📱',
    cost: 50
  },
  {
    id: '2',
    name: 'Special treat',
    icon: '🍦',
    cost: 30
  },
  {
    id: '3',
    name: 'Movie night',
    icon: '🎬',
    cost: 100,
    claimedBy: '3',
    claimedOn: new Date('2025-03-15')
  }
];
