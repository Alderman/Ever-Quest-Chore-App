
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Checkbox, IconButton, Divider } from 'react-native-paper';
import { Chore, Child } from '../../context/AppContext';

interface ChoreListProps {
  chores: Chore[];
  children: Child[];
  showChildColumn?: boolean;
  onEditChore?: (choreId: string) => void;
  onDeleteChore?: (choreId: string) => void;
  onToggleComplete?: (choreId: string, isCompleted: boolean) => void;
}

const ChoreList: React.FC<ChoreListProps> = ({
  chores,
  children,
  showChildColumn = false,
  onEditChore,
  onDeleteChore,
  onToggleComplete,
}) => {
  const getChildName = (childId: string) => {
    const child = children.find(c => c.id === childId);
    return child ? child.name : 'Unknown';
  };

  const renderChoreItem = ({ item }: { item: Chore }) => (
    <Card style={styles.choreCard}>
      <Card.Content>
        <View style={styles.choreHeader}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={item.isCompleted ? 'checked' : 'unchecked'}
              onPress={() => onToggleComplete?.(item.id, !item.isCompleted)}
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
              {showChildColumn && (
                <Text style={styles.choreInfoText}>
                  For: {getChildName(item.childId)}
                </Text>
              )}
              
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
          
          <View style={styles.choreActions}>
            <IconButton 
              icon="pencil" 
              size={20} 
              onPress={() => onEditChore?.(item.id)} 
            />
            <IconButton 
              icon="delete" 
              size={20} 
              onPress={() => onDeleteChore?.(item.id)} 
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {chores.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No chores found</Text>
        </View>
      ) : (
        <FlatList
          data={chores}
          renderItem={renderChoreItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  choreCard: {
    marginVertical: 4,
    marginHorizontal: 16,
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
  choreActions: {
    flexDirection: 'row',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default ChoreList;
