
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Reward, Child } from '../../context/AppContext';

interface RewardCardProps {
  reward: Reward;
  children?: Child[];
  childView?: boolean;
  childId?: string;
  childXp?: number;
  onEditReward?: (rewardId: string) => void;
  onDeleteReward?: (rewardId: string) => void;
  onClaimReward?: (rewardId: string) => void;
}

const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  children,
  childView = false,
  childId,
  childXp = 0,
  onEditReward,
  onDeleteReward,
  onClaimReward,
}) => {
  const isClaimable = childView && childXp >= reward.cost && !reward.claimedBy;
  const isClaimed = Boolean(reward.claimedBy);
  const claimedByChild = children?.find(child => child.id === reward.claimedBy);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name={reward.icon || "gift"} 
              size={32} 
              color="#6366F1" 
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{reward.name}</Text>
            <Text style={styles.cost}>{reward.cost} XP</Text>
          </View>
        </View>
        
        {isClaimed && !childView && (
          <View style={styles.claimedInfo}>
            <Text style={styles.claimedText}>
              Claimed by {claimedByChild?.name || 'a child'}
            </Text>
          </View>
        )}
        
        {childView && (
          <TouchableOpacity 
            style={[
              styles.claimButton, 
              !isClaimable && styles.disabledButton
            ]} 
            onPress={() => isClaimable && onClaimReward?.(reward.id)}
            disabled={!isClaimable}
          >
            <Text style={styles.claimButtonText}>
              {isClaimed 
                ? 'Claimed' 
                : isClaimable 
                  ? 'Claim Reward' 
                  : `Need ${reward.cost - childXp} more XP`}
            </Text>
          </TouchableOpacity>
        )}
      </Card.Content>
      
      {!childView && (
        <Card.Actions style={styles.cardActions}>
          <IconButton icon="pencil" onPress={() => onEditReward?.(reward.id)} />
          <IconButton icon="delete" onPress={() => onDeleteReward?.(reward.id)} />
        </Card.Actions>
      )}
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
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cost: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  claimedInfo: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  claimedText: {
    color: '#4B5563',
    fontStyle: 'italic',
  },
  claimButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  claimButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
});

export default RewardCard;
