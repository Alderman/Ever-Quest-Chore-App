
import { Stack } from 'expo-router';

export default function ChildLayout() {
  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="rewards" options={{ headerShown: false }} />
    </Stack>
  );
}
