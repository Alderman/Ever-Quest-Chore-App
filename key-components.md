# KidXP - Key Components

## Child Card Component
```typescript
interface ChildCardProps {
  child: {
    id: string;
    name: string;
    xp: number;
  };
  choreStats?: {
    completed: number;
    total: number;
  };
  nextRewardCost?: number;
}
```
- Displays child's name, XP, and progress
- Shows progress bars for XP towards next reward and chore completion
- Provides buttons to view child's chores and dashboard
- Includes options to edit and delete the child profile (for parent view)

## Chore List Component
```typescript
interface ChoreListProps {
  chores: {
    id: string;
    title: string;
    description?: string;
    xp: number;
    childId: string;
    isCompleted: boolean;
    frequency: string;
    frequencyDays?: number;
  }[];
  children: {
    id: string;
    name: string;
  }[];
  showChildColumn?: boolean;
  onEditChore?: (choreId: string) => void;
}
```
- Displays a list of chores in a table/list format
- Shows chore title, assigned child, XP value, and completion status
- Provides actions to mark chores as complete, edit, or delete
- Optionally shows the child column depending on the view context

## Reward Card Component
```typescript
interface RewardCardProps {
  reward: {
    id: string;
    name: string;
    icon?: string;
    cost: number;
    claimedBy?: string;
    claimedOn?: any;
  };
  children?: {
    id: string;
    name: string;
  }[];
  childView?: boolean;
  childId?: string;
  childXp?: number;
  onEditReward?: (rewardId: string) => void;
}
```
- Displays reward name, icon, and XP cost
- Shows reward status (available or claimed)
- Provides claim button in child view if the child has enough XP
- Includes options to edit and delete the reward (for parent view)

## Dialog Components
### Add Child Dialog
- Form to create a new child profile with name field
- Validation to ensure name is provided
- Creates child with default 0 XP

### Add Chore Dialog
```typescript
interface AddChoreDialogProps {
  children: {
    id: string;
    name: string;
  }[];
  onSuccess?: () => void;
}
```
- Form to create a new chore
- Fields for title, description, child assignment, XP value, and frequency
- Conditional fields based on frequency type
- Validation for required fields

### Add Reward Dialog
- Form to create a new reward
- Fields for name, icon selection, and XP cost
- Validation for required fields

### PIN Setup Dialog
```typescript
interface PinSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
```
- Form to set up or change parent PIN
- PIN input with confirmation
- Used for securing parent-only functions

## Layout Components
### Layout
- Main application layout with sidebar navigation
- Content area for page components

### Child Layout
```typescript
interface ChildLayoutProps {
  children: ReactNode;
  onBackToParent: () => void;
  childName?: string;
}
```
- Special layout for child dashboard view
- Back button to return to parent view
- Child-specific navigation options