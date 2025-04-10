
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, ProgressBar, IconButton } from 'react-native-paper';
import { Child, ChoreStats } from '../../context/AppContext';

interface ChildCardProps {
  child: Child;
  choreStats?: ChoreStats;
  nextRewardCost?: number | null;
  onViewChores?: (childId: string) => void;
  onViewDashboard?: (child: Child) => void;
  onEdit?: (childId: string) => void;
  onDelete?: (childId: string) => void;
}

const ChildCard: React.FC<ChildCardProps> = ({
  child,
  choreStats,
  nextRewardCost,
  onViewChores,
  onViewDashboard,
  onEdit,
  onDelete,
}) => {
  // Calculate progress percentage for rewards
  const rewardProgress = nextRewardCost ? Math.min(child.xp / nextRewardCost, 1) : 0;
  
  // Calculate chore completion percentage
  const choreProgress = choreStats ? 
    choreStats.total > 0 ? choreStats.completed / choreStats.total : 0 
    : 0;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.name}>{child.name}</Text>
          <Text style={styles.xp}>{child.xp} XP</Text>
        </View>
        
        {nextRewardCost && (
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>
              Next Reward: {child.xp}/{nextRewardCost} XP
            </Text>
            <ProgressBar progress={rewardProgress} color="#6366F1" style={styles.progressBar} />
          </View>
        )}
        
        {choreStats && (
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>
              Chores: {choreStats.completed}/{choreStats.total}
            </Text>
            <ProgressBar progress={choreProgress} color="#10B981" style={styles.progressBar} />
          </View>
        )}
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => onViewChores?.(child.id)}
          >
            <Text style={styles.buttonText}>View Chores</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => onViewDashboard?.(child)}
          >
            <Text style={styles.buttonText}>Dashboard</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
      
      <Card.Actions style={styles.cardActions}>
        <IconButton icon="pencil" onPress={() => onEdit?.(child.id)} />
        <IconButton icon="delete" onPress={() => onDelete?.(child.id)} />
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  xp: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366F1',
  },
  progressSection: {
    marginVertical: 6,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
});

export default ChildCard;
