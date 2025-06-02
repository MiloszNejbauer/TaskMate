import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
// możesz dodać ustawienia do Redux w przyszłości
import { getGlobalStyles } from '@/styles/globalStyles';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifyHourBefore, setNotifyHourBefore] = useState(false);
  const [notifyDayBefore, setNotifyDayBefore] = useState(false);

  const theme = useColorScheme() ?? 'light';
  const styles = getGlobalStyles(theme).settings;


  const handleArchivePress = () => {
    router.push('/archive');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ustawienia</Text>

      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Powiadomienia</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      {/* Sekcja szczegółowych ustawień powiadomień */}
      {notificationsEnabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kiedy powiadamiać?</Text>

          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Godzinę przed deadlinem</Text>
            <Switch
              value={notifyHourBefore}
              onValueChange={setNotifyHourBefore}
            />
          </View>

          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Dzień przed deadlinem</Text>
            <Switch
              value={notifyDayBefore}
              onValueChange={setNotifyDayBefore}
            />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <TouchableOpacity style={styles.optionButton} onPress={handleArchivePress}>
                <Text style={styles.optionLabel}>📁 Archiwum zadań</Text>
              </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inne</Text>
        <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionLabel}>🔁 Resetuj dane (wkrótce) </Text>
              </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
}