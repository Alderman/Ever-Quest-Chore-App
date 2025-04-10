
import { Redirect } from 'expo-router';
import { useAppContext } from '../context/AppContext';

export default function Index() {
  const { currentChildId } = useAppContext();
  
  // Return a redirect as a fallback
  return currentChildId ? 
    <Redirect href="/child/dashboard" /> : 
    <Redirect href="/(tabs)" />;
}
