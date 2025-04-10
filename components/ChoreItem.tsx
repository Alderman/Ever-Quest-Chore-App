
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Chore } from '@/app/types';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ChoreItemProps {
  chore: Chore;
  childName?: string;
  showChildColumn?: boolean;
  onComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isParentMode?: boolean;
}

export default function ChoreItem({
  chore,
  childName,
  showChildColumn = false,
  onComplete,
  onEdit,
  onDelete,
  isParentMode = true
}: ChoreItemProps) {
  const primaryColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  const successColor = '#34C759';
  
  return (
    <ThemedView style={styles.card}>
      <View style={styles.choreContent}>
        <View style={styles.choreInfo}>
          <ThemedText type="subheading" style={chore.isCompleted ? styles.completedText : undefined}>
            {chore.title}
          </ThemedText>
          
          {chore.description && (
            <ThemedText 
              style={[styles.description, chore.isCompleted ? styles.completedText : undefined]}
            >
              {chore.description}
            </ThemedText>
          )}
          
          <View style={styles.detailsRow}>
            {showChildColumn && childName && (
              <View style={styles.detail}>
                <FontAwesome name="user" size={12} color={primaryColor} />
                <ThemedText type="caption" style={styles.detailText}>{childName}</ThemedText>
              </View>
            )}
            
            <View style={styles.detail}>
              <FontAwesome name="star" size={12} color={primaryColor} />
              <ThemedText type="caption" style={styles.detailText}>{chore.xp} XP</ThemedText>
            </View>
            
            <View style={styles.detail}>
              <FontAwesome name="refresh" size={12} color={primaryColor} />
              <ThemedText type="caption" style={styles.detailText}>
                {chore.frequency.charAt(0).toUpperCase() + chore.frequency.slice(1)}
                {chore.frequencyDays ? ` (${chore.frequencyDays} days)` : ''}
              </ThemedText>
            </View>
          </View>
        </View>
        
        <View style={styles.statusSection}>
          {chore.isCompleted ? (
            <View style={[styles.statusIndicator, { backgroundColor: successColor }]}>
              <FontAwesome name="check" size={16} color="white" />
            </View>
          ) : (
            onComplete && (
              <Pressable 
                onPress={onComplete} 
                style={[styles.statusIndicator, { backgroundColor: primaryColor }]}
              >
                <FontAwesome name="check" size={16} color="white" />
              </Pressable>
            )
          )}
        </View>
      </View>
      
      {isParentMode && !chore.isCompleted && (
        <View style={styles.actions}>
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
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  choreContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  choreInfo: {
    flex: 1,
    marginRight: 16,
  },
  description: {
    marginTop: 4,
    marginBottom: 8,
    fontSize: 14,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 4,
  },
  statusSection: {
    justifyContent: 'center',
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
});
