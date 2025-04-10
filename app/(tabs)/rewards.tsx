
import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { FAB, Dialog, Button, TextInput, Menu, Divider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import RewardCard from '@/components/cards/RewardCard';
import { useAppContext } from '@/context/AppContext';

const ICON_OPTIONS = [
  'gift', 'trophy', 'ice-cream', 'gamepad-variant', 'tablet', 'bicycle', 
  'movie', 'toy-brick', 'music', 'cake'
];

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();
  const { children, rewards, addReward, updateReward, deleteReward } = useAppContext();
  
  // Dialog state
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [iconMenuVisible, setIconMenuVisible] = useState(false);
  
  // Reward state
  const [currentRewardId, setCurrentRewardId] = useState<string | null>(null);
  const [rewardName, setRewardName] = useState('');
  const [rewardIcon, setRewardIcon] = useState('gift');
  const [rewardCost, setRewardCost] = useState('50');
  
  const showAddDialog = () => {
    setRewardName('');
    setRewardIcon('gift');
    setRewardCost('50');
    setAddDialogVisible(true);
  };
  
  const showEditDialog = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward) {
      setCurrentRewardId(rewardId);
      setRewardName(reward.name);
      setRewardIcon(reward.icon || 'gift');
      setRewardCost(reward.cost.toString());
      setEditDialogVisible(true);
    }
  };
  
  const showDeleteDialog = (rewardId: string) => {
    setCurrentRewardId(rewardId);
    setDeleteDialogVisible(true);
  };
  
  const handleAddReward = () => {
    if (rewardName.trim()) {
      addReward({
        name: rewardName.trim(),
        icon: rewardIcon,
        cost: parseInt(rewardCost) || 50,
      });
      setAddDialogVisible(false);
    }
  };
  
  const handleEditReward = () => {
    if (rewardName.trim() && currentRewardId) {
      updateReward(currentRewardId, {
        name: rewardName.trim(),
        icon: rewardIcon,
        cost: parseInt(rewardCost) || 50,
      });
      setEditDialogVisible(false);
    }
  };
  
  const handleDeleteReward = () => {
    if (currentRewardId) {
      deleteReward(currentRewardId);
      setDeleteDialogVisible(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {rewards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No rewards added yet</Text>
            <Text style={styles.emptyStateSubText}>
              Add rewards that children can earn with their XP
            </Text>
          </View>
        ) : (
          rewards.map(reward => (
            <RewardCard
              key={reward.id}
              reward={reward}
              children={children}
              onEditReward={() => showEditDialog(reward.id)}
              onDeleteReward={() => showDeleteDialog(reward.id)}
            />
          ))
        )}
      </ScrollView>
      
      <FAB
        icon="plus"
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        onPress={showAddDialog}
      />
      
      {/* Add Reward Dialog */}
      <Dialog visible={addDialogVisible} onDismiss={() => setAddDialogVisible(false)}>
        <Dialog.Title>Add Reward</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Reward Name"
            value={rewardName}
            onChangeText={setRewardName}
            mode="outlined"
            style={styles.input}
          />
          
          <View style={styles.iconSelector}>
            <Text style={styles.iconSelectorLabel}>Icon:</Text>
            <Button
              mode="outlined"
              onPress={() => setIconMenuVisible(true)}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons name={rewardIcon} size={24} color="#6366F1" />
            </Button>
            
            <Menu
              visible={iconMenuVisible}
              onDismiss={() => setIconMenuVisible(false)}
              anchor={{ x: 0, y: 0 }}
              style={styles.iconMenu}
            >
              <View style={styles.iconGrid}>
                {ICON_OPTIONS.map(icon => (
                  <Button
                    key={icon}
                    onPress={() => {
                      setRewardIcon(icon);
                      setIconMenuVisible(false);
                    }}
                    style={styles.iconGridItem}
                  >
                    <MaterialCommunityIcons name={icon} size={24} color="#6366F1" />
                  </Button>
                ))}
              </View>
            </Menu>
          </View>
          
          <TextInput
            label="XP Cost"
            value={rewardCost}
            onChangeText={setRewardCost}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setAddDialogVisible(false)}>Cancel</Button>
          <Button onPress={handleAddReward}>Add</Button>
        </Dialog.Actions>
      </Dialog>
      
      {/* Edit Reward Dialog */}
      <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
        <Dialog.Title>Edit Reward</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Reward Name"
            value={rewardName}
            onChangeText={setRewardName}
            mode="outlined"
            style={styles.input}
          />
          
          <View style={styles.iconSelector}>
            <Text style={styles.iconSelectorLabel}>Icon:</Text>
            <Button
              mode="outlined"
              onPress={() => setIconMenuVisible(true)}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons name={rewardIcon} size={24} color="#6366F1" />
            </Button>
          </View>
          
          <TextInput
            label="XP Cost"
            value={rewardCost}
            onChangeText={setRewardCost}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
          <Button onPress={handleEditReward}>Save</Button>
        </Dialog.Actions>
      </Dialog>
      
      {/* Delete Reward Dialog */}
      <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
        <Dialog.Title>Delete Reward</Dialog.Title>
        <Dialog.Content>
          <Text>Are you sure you want to delete this reward?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
          <Button onPress={handleDeleteReward} textColor="red">Delete</Button>
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#6366F1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 8,
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
  fab: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#6366F1',
  },
  input: {
    marginBottom: 12,
  },
  iconSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconSelectorLabel: {
    fontSize: 16,
    marginRight: 16,
  },
  iconButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconMenu: {
    width: 280,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  iconGridItem: {
    width: 50,
    height: 50,
    margin: 4,
  },
});
