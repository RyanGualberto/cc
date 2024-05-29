import { Redirect, Slot, Stack } from 'expo-router';
import { useSession } from '../ctx';
import { Text } from 'react-native';


export default function Layout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (session) {
 
    return <Redirect href="/dashboard" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}
