import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { FileQuestion, HandCoins, Home, Notebook } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

export default function Layout() {

  const TabRoutes = [
    {
      name: 'home',
      title: 'Home',
      Icon: Home,
    },
    {
      name: 'overview',
      title: 'Overview',
      Icon: HandCoins,
    },
    {
      name: 'groups',
      title: 'Groups',
      Icon: Notebook,
    },
    {
      name: 'placeholder',
      title: 'Placeholder',
      Icon: FileQuestion
    }
  ]

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary_color,
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          position: 'absolute',
          height: 100,
          borderTopColor: Colors.main_border_color,
          borderTopWidth: 1.5,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={70}
            experimentalBlurMethod='dimezisBlurView'
            blurReductionFactor={10}
            tint='dark'
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'transparent',

            }}
          />
        )
      }}

    >
      {
        TabRoutes.map(({ name, title, Icon }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              tabBarIcon: ({ color }) => <Icon color={color} size={24} />,
            }}
          />
        ))
      }
    </Tabs>
  );
}
