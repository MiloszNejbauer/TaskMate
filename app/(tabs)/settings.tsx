import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, router } from 'expo-router'; // Nawigacja między ekranami
import { useSelector, useDispatch } from 'react-redux'; // Dostęp do store Redux
import { RootState } from '../../redux/store'; // Typy dla stanu
import { getGlobalStyles } from '@/styles/globalStyles'; // Style zależne od motywu
import { useColorScheme } from '@/hooks/useColorScheme'; // Hak do wykrywania motywu (ciemny/jasny)
import { SafeAreaView } from 'react-native-safe-area-context'; // Bezpieczna przestrzeń (notchy itp.)
import {
  setNotificationsEnabled,
  setNotifyDayBefore,
  setNotifyHourBefore
} from '@/redux/notificationSettingsSlice'; // Akcje Redux do ustawień powiadomień

export default function SettingsScreen() {
  const navigation = useNavigation();

  // Pobieranie wartości z reduxa
  const notificationsEnabled = useSelector((state: RootState) => state.notificationSettings.notificationsEnabled);
  const notifyHourBefore = useSelector((state: RootState) => state.notificationSettings.notifyHourBefore);
  const notifyDayBefore = useSelector((state: RootState) => state.notificationSettings.notifyDayBefore);

  const dispatch = useDispatch();

  // Stylowanie w zależności od motywu
  const theme = useColorScheme() ?? 'light';
  const styles = getGlobalStyles(theme).settings;

  // Obsługa przejścia do archiwum
  const handleArchivePress = () => {
    router.push('/archive');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Nagłówek ekranu */}
      <Text style={styles.title}>Ustawienia</Text>

      {/* Przełącznik globalny powiadomień */}
      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Powiadomienia</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={(val) => { dispatch(setNotificationsEnabled(val)); }}
        />
      </View>

      {/* Sekcja: opcje powiadomień tylko jeśli powiadomienia są włączone */}
      {notificationsEnabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kiedy powiadamiać?</Text>

          {/* Przełącznik: godzinę przed */}
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Godzinę przed deadlinem</Text>
            <Switch
              value={notifyHourBefore}
              onValueChange={(val) => { dispatch(setNotifyHourBefore(val)); }}
            />
          </View>

          {/* Przełącznik: dzień przed */}
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Dzień przed deadlinem</Text>
            <Switch
              value={notifyDayBefore}
              onValueChange={(val) => { dispatch(setNotifyDayBefore(val)); }}
            />
          </View>
        </View>
      )}

      {/* Przycisk do przejścia do archiwum zadań */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.optionButton} onPress={handleArchivePress}>
          <Text style={styles.optionLabel}>📁 Archiwum zadań</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
