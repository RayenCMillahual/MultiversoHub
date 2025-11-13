// src/components/OfflineNotice.tsx

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export default function OfflineNotice() {
  const { isOffline } = useNetworkStatus();

  if (!isOffline) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline" size={20} color="#fff" />
      <Text style={styles.text}>Sin conexión a Internet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d63d2e',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
});