
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Reward } from '@/app/types';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface RewardCardProps {
  reward: Reward;
  childId?: string;
  childXp?: number;
  childName?: string;
  onClaim?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isParentMode?: boolean;
}

export default function RewardCard({
  reward,
  childId,
  childXp = 0,
  childName,
  onClaim,
  onEdit,
  onDelete,
  isParentMode = true
}: RewardCardProps) {
  const primaryColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  const warningColor = '#FF9500';
  
  const canClaim = childId && childXp >= reward.cost && !reward.claimedBy;
  const isClaimedByThisChild = reward.claimedBy === childId;
  
  return (
    <ThemedView style={styles.card}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <ThemedText style={styles.icon}>{reward.icon || '🎁'}</ThemedText>
        </View>
        
        <View style={styles.rewardInfo}>
          <ThemedText type="subheading">{reward.name}</ThemedText>
          
          <View style={styles.costContainer}>
            <FontAwesome name="star" size={14} color={primaryColor} />
            <ThemedText style={styles.cost}>{reward.cost} XP</ThemedText>
          </View>
          
          {reward.claimedBy && (
            <ThemedText type="caption" style={styles.claimed}>
              {isClaimedByThisChild ? 'You claimed this reward' : `Claimed by ${childName || 'someone'}`}
            </ThemedText>
          )}
          
          {!isParentMode && !reward.claimedBy && (
            <ThemedText type="caption" style={{ color: childXp >= reward.cost ? primaryColor : warningColor }}>
              {childXp >= reward.cost 
                ? 'You have enough XP to claim this reward!' 
                : `You need ${reward.cost - childXp} more XP`}
            </ThemedText>
          )}
        </View>
      </View>
      
      <View style={styles.actions}>
        {!isParentMode && canClaim && onClaim && (
          <Pressable 
            onPress={onClaim} 
            style={[styles.claimButton, { backgroundColor: primaryColor }]}
          >
            <ThemedText style={{ color: 'white' }}>Claim</ThemedText>
          </Pressable>
        )}
        
        {isParentMode && !reward.claimedBy && (
          <>
            {onEdit && (
              <Pressable onPress={onEdit} style={styles.iconButton}>
                <FontAwesome name="pencil" size={16} color={primaryColor} />
              </Pressable>
            )}
            {onDelete && (
              <Pressable onPress={onDelete} style={styles.iconButton}>
                <FontAwesome name="trash" size={16} color="#FF3B30" />
              </Pressable>
            )}
          </>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  icon: {
    fontSize: 24,
  },
  rewardInfo: {
    flex: 1,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cost: {
    marginLeft: 4,
    fontWeight: '600',
  },
  claimed: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  claimButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});
