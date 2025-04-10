
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { FAB, Dialog, Button, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChildCard from '@/components/cards/ChildCard';
import { useAppContext } from '@/context/AppContext';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { 
    children, 
    addChild, 
    deleteChild, 
    getChoreStats, 
    getNextRewardCost,
    switchToChildMode
  } = useAppContext();
  
  // Dialog state
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [currentChild, setCurrentChild] = useState<string | null>(null);
  const [childName, setChildName] = useState('');

  const showAddDialog = () => {
    setChildName('');
    setAddDialogVisible(true);
  };

  const showEditDialog = (childId: string) => {
    const child = children.find(c => c.id === childId);
    if (child) {
      setChildName(child.name);
      setCurrentChild(childId);
      setEditDialogVisible(true);
    }
  };

  const showDeleteDialog = (childId: string) => {
    setCurrentChild(childId);
    setDeleteDialogVisible(true);
  };

  const handleAddChild = () => {
    if (childName.trim()) {
      addChild({
        name: childName.trim(),
        xp: 0
      });
      setAddDialogVisible(false);
    }
  };

  const handleEditChild = () => {
    if (childName.trim() && currentChild) {
      const child = children.find(c => c.id === currentChild);
      if (child) {
        // Update child name
        child.name = childName.trim();
        setEditDialogVisible(false);
      }
    }
  };

  const handleDeleteChild = () => {
    if (currentChild) {
      deleteChild(currentChild);
      setDeleteDialogVisible(false);
    }
  };

  const handleViewChildDashboard = (child: { id: string; name: string; xp: number }) => {
    switchToChildMode(child.id, child.name, child.xp);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>KidXP</Text>
          <Text style={styles.subtitle}>Manage your children's chores and rewards</Text>
        </View>
        
        {children.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No children added yet.</Text>
            <Text style={styles.emptyStateSubText}>
              Add a child to get started with assigning chores and rewards.
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton} 
              onPress={showAddDialog}
            >
              <Text style={styles.emptyStateButtonText}>Add Child</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.childrenContainer}>
            {children.map(child => (
              <ChildCard
                key={child.id}
                child={child}
                choreStats={getChoreStats(child.id)}
                nextRewardCost={getNextRewardCost(child.id)}
                onViewChores={() => {}} // Will implement later
                onViewDashboard={() => handleViewChildDashboard(child)}
                onEdit={() => showEditDialog(child.id)}
                onDelete={() => showDeleteDialog(child.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
      
      {children.length > 0 && (
        <FAB
          icon="plus"
          style={[styles.fab, { bottom: insets.bottom + 16 }]}
          onPress={showAddDialog}
        />
      )}
      
      {/* Add Child Dialog */}
      <Dialog visible={addDialogVisible} onDismiss={() => setAddDialogVisible(false)}>
        <Dialog.Title>Add Child</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Child's Name"
            value={childName}
            onChangeText={setChildName}
            mode="outlined"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setAddDialogVisible(false)}>Cancel</Button>
          <Button onPress={handleAddChild}>Add</Button>
        </Dialog.Actions>
      </Dialog>
      
      {/* Edit Child Dialog */}
      <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
        <Dialog.Title>Edit Child</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Child's Name"
            value={childName}
            onChangeText={setChildName}
            mode="outlined"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
          <Button onPress={handleEditChild}>Save</Button>
        </Dialog.Actions>
      </Dialog>
      
      {/* Delete Child Dialog */}
      <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
        <Dialog.Title>Delete Child</Dialog.Title>
        <Dialog.Content>
          <Text>Are you sure you want to delete this child? This will remove all associated chores and progress.</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
          <Button onPress={handleDeleteChild} textColor="red">Delete</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#6366F1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  childrenContainer: {
    paddingVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#6366F1',
  },
});
