import { Slot} from 'expo-router';
import { SessionProvider } from './ctx';

export default function Layout() {
  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
     <Slot />
    </SessionProvider>
  );
}
