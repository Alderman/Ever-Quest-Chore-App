
import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';

import ChildLayout from '@/components/layout/ChildLayout';
import RewardCard from '@/components/cards/RewardCard';
import { useAppContext } from '@/context/AppContext';
import { Reward } from '@/context/AppContext';

export default function ChildRewardsScreen() {
  const { 
    rewards, 
    activeChildId, 
    activeChildName, 
    activeChildXp, 
    switchToParentMode,
    claimReward 
  } = useAppContext();
  
  const handleClaimReward = (rewardId: string) => {
    if (activeChildId) {
      claimReward(rewardId, activeChildId);
    }
  };
  
  const renderItem = ({ item }: { item: Reward }) => (
    <RewardCard
      reward={item}
      childView={true}
      childId={activeChildId || ''}
      childXp={activeChildXp}
      onClaimReward={handleClaimReward}
    />
  );
  
  return (
    <ChildLayout 
      childName={activeChildName} 
      xp={activeChildXp} 
      onBackToParent={switchToParentMode}
    >
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Available Rewards</Text>
        
        {rewards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No rewards yet!</Text>
            <Text style={styles.emptyStateSubText}>
              Your parent will add rewards soon.
            </Text>
          </View>
        ) : (
          <FlatList
            data={rewards}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.rewardList}
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
  rewardList: {
    paddingBottom: 16,
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
