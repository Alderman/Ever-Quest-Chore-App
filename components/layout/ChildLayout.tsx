import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Appbar, Text, Avatar, useTheme } from 'react-native-paper';
import { useAppContext } from '../../context/AppContext';
import { useRouter } from 'expo-router';

interface ChildLayoutProps {
  children: React.ReactNode;
  title: string;
}

const ChildLayout: React.FC<ChildLayoutProps> = ({ children, title }) => {
  const { state, switchToParent } = useAppContext();
  const theme = useTheme();
  const router = useRouter();

  const handleBack = () => {
    switchToParent();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title={title} />
        <View style={styles.childInfo}>
          <Text variant="labelLarge">{state.currentChildName}</Text>
          <View style={styles.xpContainer}>
            <Text style={{ color: theme.colors.primary }}>
              {state.currentChildXp} XP
            </Text>
          </View>
        </View>
      </Appbar.Header>
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpContainer: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
  },
});

export default ChildLayout;