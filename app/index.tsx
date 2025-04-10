
import { useEffect } from 'react';
import { useRouter, Redirect } from 'expo-router';
import { useAppContext } from '../context/AppContext';

export default function Index() {
  const router = useRouter();
  const { state } = useAppContext();
  
  useEffect(() => {
    // If a child is selected, go to child dashboard
    if (state.currentChildId) {
      router.replace('/child/dashboard');
    } else {
      // Otherwise go to parent dashboard
      router.replace('/(tabs)');
    }
  }, [state.currentChildId]);

  // Return a redirect as a fallback
  return state.currentChildId ? 
    <Redirect href="/child/dashboard" /> : 
    <Redirect href="/(tabs)" />;
}
