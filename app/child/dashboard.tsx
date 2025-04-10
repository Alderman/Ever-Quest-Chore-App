
import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { Card, Checkbox } from 'react-native-paper';

import ChildLayout from '@/components/layout/ChildLayout';
import { useAppContext } from '@/context/AppContext';
import { Chore } from '@/context/AppContext';

export default function ChildDashboardScreen() {
  const { 
    chores, 
    activeChildId, 
    activeChildName, 
    activeChildXp, 
    switchToParentMode,
    toggleChoreCompletion 
  } = useAppContext();
  
  // Get chores for this child
  const childChores = chores.filter(chore => chore.childId === activeChildId);
  
  const renderChoreItem = ({ item }: { item: Chore }) => (
    <Card style={styles.choreCard}>
      <Card.Content>
        <View style={styles.choreHeader}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={item.isCompleted ? 'checked' : 'unchecked'}
              onPress={() => toggleChoreCompletion(item.id, !item.isCompleted)}
            />
          </View>
          
          <View style={styles.choreDetails}>
            <Text style={[
              styles.choreTitle,
              item.isCompleted && styles.completedChore
            ]}>
              {item.title}
            </Text>
            
            {item.description && (
              <Text style={styles.choreDescription}>{item.description}</Text>
            )}
            
            <View style={styles.choreInfo}>
              <Text style={styles.choreInfoText}>
                {item.xp} XP
              </Text>
              
              <Text style={styles.choreInfoText}>
                {item.frequency === 'once' ? 'One-time' : 
                 item.frequency === 'daily' ? 'Daily' : 
                 `Weekly (${item.frequencyDays || 0} days)`}
              </Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
  
  return (
    <ChildLayout 
      childName={activeChildName} 
      xp={activeChildXp} 
      onBackToParent={switchToParentMode}
    >
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>My Chores</Text>
        
        {childChores.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No chores yet!</Text>
            <Text style={styles.emptyStateSubText}>
              Your parent will add chores for you soon.
            </Text>
          </View>
        ) : (
          <FlatList
            data={childChores}
            renderItem={renderChoreItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.choreList}
          />
        )}
      </View>
    </ChildLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  choreList: {
    paddingBottom: 16,
  },
  choreCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  choreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 8,
  },
  choreDetails: {
    flex: 1,
  },
  choreTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  completedChore: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  choreDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  choreInfo: {
    flexDirection: 'row',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  choreInfoText: {
    fontSize: 12,
    color: '#4B5563',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
    marginTop: 4,
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
  },
});
