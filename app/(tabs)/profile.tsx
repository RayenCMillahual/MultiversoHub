// app/(tabs)/profile.tsx

import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useFavorites } from '../../src/context/FavoritesContext';
import { useTheme } from '../../src/context/ThemeContext';
import { logUserAction, telemetry } from '../../src/utils/telemetry';

export default function ProfileScreen() {
  const { favorites, clearFavorites } = useFavorites();
  const { theme, toggleTheme, isDark } = useTheme();
  const [showTelemetry, setShowTelemetry] = useState(false);

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  const handleClearData = () => {
    Alert.alert(
      'Borrar Datos',
      '¿Estás seguro de que quieres borrar todos tus favoritos?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            await clearFavorites();
            logUserAction('clear_favorites', { count: favorites.length });
            Alert.alert('Éxito', 'Datos borrados correctamente');
          },
        },
      ]
    );
  };

  const handleViewTelemetry = () => {
    setShowTelemetry(!showTelemetry);
    logUserAction('view_telemetry');
  };

  const handleClearTelemetry = () => {
    Alert.alert(
      'Borrar Telemetría',
      '¿Quieres borrar todos los eventos registrados?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: () => {
            telemetry.clearEvents();
            Alert.alert('Éxito', 'Telemetría borrada');
          },
        },
      ]
    );
  };

  const telemetryEvents = telemetry.getEvents();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color="#00b3c7" />
        <Text style={styles.title}>Configuración</Text>
      </View>

      {/* Sección: Apariencia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 Apariencia</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons 
              name={isDark ? "moon" : "sunny"} 
              size={24} 
              color="#00b3c7" 
            />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Tema Oscuro</Text>
              <Text style={styles.settingDescription}>
                {isDark ? 'Activado' : 'Desactivado'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={() => {
              toggleTheme();
              logUserAction('toggle_theme', { theme: isDark ? 'light' : 'dark' });
            }}
            trackColor={{ false: '#ccc', true: '#00b3c7' }}
            thumbColor={isDark ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Sección: Datos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💾 Datos</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleClearData}>
          <Ionicons name="trash" size={24} color="#d63d2e" />
          <View style={styles.buttonText}>
            <Text style={styles.buttonLabel}>Borrar Favoritos</Text>
            <Text style={styles.buttonDescription}>
              {favorites.length} personajes guardados
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Sección: Telemetría */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Telemetría</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleViewTelemetry}>
          <Ionicons name="analytics" size={24} color="#00b3c7" />
          <View style={styles.buttonText}>
            <Text style={styles.buttonLabel}>Ver Eventos</Text>
            <Text style={styles.buttonDescription}>
              {telemetryEvents.length} eventos registrados
            </Text>
          </View>
          <Ionicons 
            name={showTelemetry ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#ccc" 
          />
        </TouchableOpacity>

        {showTelemetry && (
          <View style={styles.telemetryContainer}>
            {telemetryEvents.length === 0 ? (
              <Text style={styles.telemetryEmpty}>No hay eventos registrados</Text>
            ) : (
              <>
                {telemetryEvents.slice(-10).reverse().map((event, index) => (
                  <View key={index} style={styles.telemetryEvent}>
                    <Text style={styles.telemetryType}>[{event.type}]</Text>
                    <Text style={styles.telemetryAction}>{event.action}</Text>
                    <Text style={styles.telemetryTime}>
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                ))}
                
                <TouchableOpacity 
                  style={styles.clearButton} 
                  onPress={handleClearTelemetry}
                >
                  <Text style={styles.clearButtonText}>Borrar Telemetría</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>

      {/* Sección: Información */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Información</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="code-slash" size={24} color="#00b3c7" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Versión</Text>
            <Text style={styles.infoValue}>{appVersion}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="planet" size={24} color="#00b3c7" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>API</Text>
            <Text style={styles.infoValue}>Rick and Morty API</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="school" size={24} color="#00b3c7" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Proyecto</Text>
            <Text style={styles.infoValue}>MultiversoHub</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Hecho con ❤️ para el IES Cipolletti
        </Text>
        <Text style={styles.footerSubtext}>
          Desarrollo Móvil - 2024
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  buttonText: {
    flex: 1,
    marginLeft: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buttonDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  telemetryContainer: {
    marginTop: 15,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  telemetryEmpty: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  telemetryEvent: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  telemetryType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00b3c7',
  },
  telemetryAction: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  telemetryTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  clearButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#d63d2e',
    borderRadius: 6,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});