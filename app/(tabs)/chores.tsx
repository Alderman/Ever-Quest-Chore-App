
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { FAB, Dialog, Button, TextInput, SegmentedButtons, Menu, Divider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

import ChoreList from '@/components/lists/ChoreList';
import { useAppContext } from '@/context/AppContext';

export default function ChoresScreen() {
  const insets = useSafeAreaInsets();
  const { 
    children, 
    chores, 
    addChore, 
    updateChore, 
    deleteChore,
    toggleChoreCompletion
  } = useAppContext();
  
  // Dialog state
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  
  // Chore state
  const [currentChoreId, setCurrentChoreId] = useState<string | null>(null);
  const [choreTitle, setChoreTitle] = useState('');
  const [choreDescription, setChoreDescription] = useState('');
  const [choreXp, setChoreXp] = useState('10');
  const [choreChildId, setChoreChildId] = useState<string>('');
  const [choreFrequency, setChoreFrequency] = useState<'daily' | 'weekly' | 'once'>('daily');
  
  // Filter state
  const [filterChildId, setFilterChildId] = useState<string | null>(null);
  
  const showAddDialog = () => {
    setChoreTitle('');
    setChoreDescription('');
    setChoreXp('10');
    setChoreChildId(children[0]?.id || '');
    setChoreFrequency('daily');
    setAddDialogVisible(true);
  };
  
  const showEditDialog = (choreId: string) => {
    const chore = chores.find(c => c.id === choreId);
    if (chore) {
      setCurrentChoreId(choreId);
      setChoreTitle(chore.title);
      setChoreDescription(chore.description || '');
      setChoreXp(chore.xp.toString());
      setChoreChildId(chore.childId);
      setChoreFrequency(chore.frequency);
      setEditDialogVisible(true);
    }
  };
  
  const showDeleteDialog = (choreId: string) => {
    setCurrentChoreId(choreId);
    setDeleteDialogVisible(true);
  };
  
  const handleAddChore = () => {
    if (choreTitle.trim() && choreChildId) {
      addChore({
        title: choreTitle.trim(),
        description: choreDescription.trim() || undefined,
        xp: parseInt(choreXp) || 10,
        childId: choreChildId,
        isCompleted: false,
        frequency: choreFrequency,
      });
      setAddDialogVisible(false);
    }
  };
  
  const handleEditChore = () => {
    if (choreTitle.trim() && choreChildId && currentChoreId) {
      updateChore(currentChoreId, {
        title: choreTitle.trim(),
        description: choreDescription.trim() || undefined,
        xp: parseInt(choreXp) || 10,
        childId: choreChildId,
        frequency: choreFrequency,
      });
      setEditDialogVisible(false);
    }
  };
  
  const handleDeleteChore = () => {
    if (currentChoreId) {
      deleteChore(currentChoreId);
      setDeleteDialogVisible(false);
    }
  };
  
  // Filter chores based on selected child
  const filteredChores = filterChildId
    ? chores.filter(chore => chore.childId === filterChildId)
    : chores;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chores</Text>
        <Button 
          mode="contained" 
          onPress={() => setFilterMenuVisible(true)}
          style={styles.filterButton}
        >
          {filterChildId ? children.find(c => c.id === filterChildId)?.name || 'Filter' : 'All Children'}
        </Button>
        
        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={{ x: 0, y: 0 }}
          style={styles.menu}
        >
          <Menu.Item 
            onPress={() => {
              setFilterChildId(null);
              setFilterMenuVisible(false);
            }} 
            title="All Children" 
          />
          <Divider />
          {children.map(child => (
            <Menu.Item
              key={child.id}
              onPress={() => {
                setFilterChildId(child.id);
                setFilterMenuVisible(false);
              }}
              title={child.name}
            />
          ))}
        </Menu>
      </View>
      
      <ScrollView style={styles.content}>
        <ChoreList
          chores={filteredChores}
          children={children}
          showChildColumn={!filterChildId}
          onEditChore={showEditDialog}
          onDeleteChore={showDeleteDialog}
          onToggleComplete={toggleChoreCompletion}
        />
      </ScrollView>
      
      <FAB
        icon="plus"
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        onPress={showAddDialog}
      />
      
      {/* Add Chore Dialog */}
      <Dialog visible={addDialogVisible} onDismiss={() => setAddDialogVisible(false)}>
        <Dialog.Title>Add Chore</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Title"
            value={choreTitle}
            onChangeText={setChoreTitle}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Description (optional)"
            value={choreDescription}
            onChangeText={setChoreDescription}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="XP Value"
            value={choreXp}
            onChangeText={setChoreXp}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          
          <Text style={styles.inputLabel}>For Child:</Text>
          <SegmentedButtons
            value={choreChildId}
            onValueChange={setChoreChildId}
            buttons={children.map(child => ({
              value: child.id,
              label: child.name,
            }))}
            style={styles.segmentedButton}
          />
          
          <Text style={styles.inputLabel}>Frequency:</Text>
          <SegmentedButtons
            value={choreFrequency}
            onValueChange={value => setChoreFrequency(value as 'daily' | 'weekly' | 'once')}
            buttons={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'once', label: 'One-time' },
            ]}
            style={styles.segmentedButton}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setAddDialogVisible(false)}>Cancel</Button>
          <Button onPress={handleAddChore}>Add</Button>
        </Dialog.Actions>
      </Dialog>
      
      {/* Edit Chore Dialog */}
      <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
        <Dialog.Title>Edit Chore</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Title"
            value={choreTitle}
            onChangeText={setChoreTitle}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Description (optional)"
            value={choreDescription}
            onChangeText={setChoreDescription}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="XP Value"
            value={choreXp}
            onChangeText={setChoreXp}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          
          <Text style={styles.inputLabel}>For Child:</Text>
          <SegmentedButtons
            value={choreChildId}
            onValueChange={setChoreChildId}
            buttons={children.map(child => ({
              value: child.id,
              label: child.name,
            }))}
            style={styles.segmentedButton}
          />
          
          <Text style={styles.inputLabel}>Frequency:</Text>
          <SegmentedButtons
            value={choreFrequency}
            onValueChange={value => setChoreFrequency(value as 'daily' | 'weekly' | 'once')}
            buttons={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'once', label: 'One-time' },
            ]}
            style={styles.segmentedButton}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
          <Button onPress={handleEditChore}>Save</Button>
        </Dialog.Actions>
      </Dialog>
      
      {/* Delete Chore Dialog */}
      <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
        <Dialog.Title>Delete Chore</Dialog.Title>
        <Dialog.Content>
          <Text>Are you sure you want to delete this chore?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
          <Button onPress={handleDeleteChore} textColor="red">Delete</Button>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  menu: {
    position: 'absolute',
    top: 60,
    right: 16,
    minWidth: 150,
  },
  content: {
    flex: 1,
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#6366F1',
  },
  input: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  segmentedButton: {
    marginBottom: 12,
  },
});
