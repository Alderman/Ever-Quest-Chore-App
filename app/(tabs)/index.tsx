
import { StyleSheet, FlatList, Pressable, View } from 'react-native';
import React, { useState } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import ChildCard from '@/components/ChildCard';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function HomeScreen() {
  const { 
    children, 
    chores,
    rewards,
    addChild,
    updateChild,
    deleteChild,
    parentMode,
    setSelectedChildId
  } = useAppContext();
  
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [editChildName, setEditChildName] = useState('');
  
  const primaryColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');

  // Calculate stats for each child
  const getChildStats = (childId: string) => {
    const childChores = chores.filter(chore => chore.childId === childId);
    const completed = childChores.filter(chore => chore.isCompleted).length;
    const total = childChores.length;
    
    // Find the cheapest unclaimed reward
    const availableRewards = rewards.filter(reward => !reward.claimedBy);
    const nextReward = availableRewards.sort((a, b) => a.cost - b.cost)[0];
    
    return {
      choreStats: { completed, total },
      nextRewardCost: nextReward?.cost
    };
  };

  const handleAddChild = () => {
    if (newChildName.trim()) {
      addChild(newChildName.trim());
      setNewChildName('');
      setIsAddingChild(false);
    }
  };

  const handleEditChild = (id: string) => {
    const child = children.find(c => c.id === id);
    if (child) {
      setEditingChildId(id);
      setEditChildName(child.name);
    }
  };

  const handleUpdateChild = () => {
    if (editingChildId && editChildName.trim()) {
      updateChild(editingChildId, { name: editChildName.trim() });
      setEditingChildId(null);
      setEditChildName('');
    }
  };

  const handleDeleteChild = (id: string) => {
    deleteChild(id);
  };

  const handleChildSelect = (childId: string) => {
    if (!parentMode) {
      setSelectedChildId(childId);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={children}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const stats = getChildStats(item.id);
          
          return (
            <Pressable onPress={() => handleChildSelect(item.id)}>
              <ChildCard 
                child={item}
                choreStats={stats.choreStats}
                nextRewardCost={stats.nextRewardCost}
                onEdit={() => handleEditChild(item.id)}
                onDelete={() => handleDeleteChild(item.id)}
                isParentMode={parentMode}
              />
            </Pressable>
          );
        }}
        ListHeaderComponent={
          parentMode ? (
            <View style={styles.header}>
              <ThemedText type="heading">Children</ThemedText>
              <Pressable 
                style={[styles.addButton, { backgroundColor: primaryColor }]}
                onPress={() => setIsAddingChild(true)}
              >
                <FontAwesome name="plus" size={18} color="white" />
                <ThemedText style={{ color: 'white', marginLeft: 6 }}>Add Child</ThemedText>
              </Pressable>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <ThemedView style={styles.emptyState}>
            <FontAwesome name="child" size={48} color={primaryColor} />
            <ThemedText type="heading" style={styles.emptyStateText}>No children yet</ThemedText>
            <ThemedText style={styles.emptyStateDescription}>
              Add your first child to start tracking chores and rewards
            </ThemedText>
          </ThemedView>
        }
        contentContainerStyle={styles.listContent}
      />
      
      {isAddingChild && (
        <ThemedView style={styles.modal}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="heading">Add Child</ThemedText>
            <ThemedText style={styles.label}>Name</ThemedText>
            <ThemedView style={styles.input}>
              <ThemedText 
                type="input"
                value={newChildName}
                onChangeText={setNewChildName}
                placeholder="Enter child's name"
              />
            </ThemedView>
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsAddingChild(false);
                  setNewChildName('');
                }}
              >
                <ThemedText>Cancel</ThemedText>
              </Pressable>
              <Pressable 
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: primaryColor }]}
                onPress={handleAddChild}
              >
                <ThemedText style={{ color: 'white' }}>Add</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </ThemedView>
      )}
      
      {editingChildId && (
        <ThemedView style={styles.modal}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="heading">Edit Child</ThemedText>
            <ThemedText style={styles.label}>Name</ThemedText>
            <ThemedView style={styles.input}>
              <ThemedText 
                type="input"
                value={editChildName}
                onChangeText={setEditChildName}
                placeholder="Enter child's name"
              />
            </ThemedView>
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setEditingChildId(null);
                  setEditChildName('');
                }}
              >
                <ThemedText>Cancel</ThemedText>
              </Pressable>
              <Pressable 
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: primaryColor }]}
                onPress={handleUpdateChild}
              >
                <ThemedText style={{ color: 'white' }}>Update</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    padding: 20,
  },
  emptyStateText: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    textAlign: 'center',
    opacity: 0.7,
    maxWidth: 300,
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
  },
  label: {
    marginTop: 16,
    marginBottom: 4,
    opacity: 0.8,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
});
