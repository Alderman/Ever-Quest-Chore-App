
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Child } from '@/app/types';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ChildCardProps {
  child: Child;
  choreStats?: {
    completed: number;
    total: number;
  };
  nextRewardCost?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  isParentMode?: boolean;
}

export default function ChildCard({ 
  child, 
  choreStats, 
  nextRewardCost, 
  onEdit, 
  onDelete, 
  isParentMode = true
}: ChildCardProps) {
  const primaryColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  const backgroundColor = useThemeColor({ light: '#F2F2F7', dark: '#1C1C1E' }, 'background');

  // Calculate XP progress
  const xpProgress = nextRewardCost ? Math.min(child.xp / nextRewardCost, 1) : 0;
  
  // Calculate chore progress
  const choreProgress = choreStats ? 
    (choreStats.total > 0 ? choreStats.completed / choreStats.total : 0) : 0;

  return (
    <ThemedView style={styles.card}>
      <View style={styles.header}>
        <View>
          <ThemedText type="heading">{child.name}</ThemedText>
          <ThemedText>{child.xp} XP</ThemedText>
        </View>
        
        {isParentMode && (
          <View style={styles.actions}>
            {onEdit && (
              <Pressable onPress={onEdit} style={styles.iconButton}>
                <FontAwesome name="pencil" size={18} color={primaryColor} />
              </Pressable>
            )}
            {onDelete && (
              <Pressable onPress={onDelete} style={styles.iconButton}>
                <FontAwesome name="trash" size={18} color="#FF3B30" />
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* XP Progress */}
      {nextRewardCost && (
        <View style={styles.progressSection}>
          <ThemedText type="caption">Progress to next reward</ThemedText>
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${xpProgress * 100}%`, backgroundColor: primaryColor }
              ]} 
            />
          </View>
          <ThemedText type="caption">
            {child.xp} / {nextRewardCost} XP
          </ThemedText>
        </View>
      )}

      {/* Chore Progress */}
      {choreStats && (
        <View style={styles.progressSection}>
          <ThemedText type="caption">Chore completion</ThemedText>
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${choreProgress * 100}%`, backgroundColor: primaryColor }
              ]} 
            />
          </View>
          <ThemedText type="caption">
            {choreStats.completed} / {choreStats.total} chores
          </ThemedText>
        </View>
      )}

      <View style={styles.buttons}>
        <Link href={`/children/${child.id}/chores`} asChild>
          <Pressable style={[styles.button, { backgroundColor }]}>
            <ThemedText>Chores</ThemedText>
          </Pressable>
        </Link>
        
        <Link href={`/children/${child.id}`} asChild>
          <Pressable style={[styles.button, { backgroundColor: primaryColor }]}>
            <ThemedText style={{ color: 'white' }}>Dashboard</ThemedText>
          </Pressable>
        </Link>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  progressSection: {
    marginVertical: 8,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginVertical: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
});
