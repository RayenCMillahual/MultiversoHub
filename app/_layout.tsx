// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import OfflineNotice from '../src/components/OfflineNotice';
import { FavoritesProvider } from '../src/context/FavoritesContext';
import { ThemeProvider } from '../src/context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <View style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <OfflineNotice />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#00b3c7',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="(tabs)" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="character/[id]" 
              options={{ title: 'Detalle del Personaje' }} 
            />
          </Stack>
        </View>
      </FavoritesProvider>
    </ThemeProvider>
  );
}