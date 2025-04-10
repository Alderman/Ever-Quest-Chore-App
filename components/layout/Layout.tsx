
import React, { ReactNode } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Appbar } from 'react-native-paper';

interface LayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  showBackButton = false,
  onBack,
  rightAction,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        {showBackButton && <Appbar.BackAction onPress={onBack} />}
        <Appbar.Content title={title} />
        {rightAction}
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
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 8,
  },
});

export default Layout;
