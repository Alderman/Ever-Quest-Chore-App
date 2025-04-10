
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ChildLayoutProps {
  children: ReactNode;
  onBackToParent: () => void;
  childName?: string;
  xp?: number;
}

const ChildLayout: React.FC<ChildLayoutProps> = ({
  children,
  onBackToParent,
  childName = 'Child',
  xp = 0,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.childName}>{childName}</Text>
          <View style={styles.xpContainer}>
            <MaterialCommunityIcons name="star" size={20} color="#F59E0B" />
            <Text style={styles.xpText}>{xp} XP</Text>
          </View>
        </View>
      </Appbar.Header>
      
      <View style={styles.content}>
        {children}
      </View>
      
      <TouchableOpacity 
        style={styles.parentButton}
        onPress={onBackToParent}
      >
        <Text style={styles.parentButtonText}>Back to Parent View</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#6366F1',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  childName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  xpText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 8,
  },
  parentButton: {
    backgroundColor: '#4B5563',
    padding: 12,
    alignItems: 'center',
  },
  parentButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ChildLayout;
