import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { clearArchive } from '../redux/tasksSlice';
import { getGlobalStyles } from '@/styles/globalStyles';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ArchiveScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const theme = useColorScheme() ?? 'light';
  const styles = getGlobalStyles(theme).archive;

  const archivedTasks = useSelector((state: RootState) => state.tasks.archived);

  const handleClearArchive = () => {
  if (archivedTasks.length === 0) return;

  Alert.alert(
    'Potwierdzenie',
    'Na pewno usunąć całe archiwum?',
    [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () => {
          console.log('Czyszczenie archiwum...');
          dispatch(clearArchive());
        },
      },
    ]
  );
};


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📁 Archiwum zadań</Text>

      <FlatList
        data={archivedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.title}</Text>
            {item.deadline && (
              <Text style={styles.deadline}>
                🕒 {new Date(item.deadline).toLocaleString()}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Brak zarchiwizowanych zadań</Text>}
      />

      {archivedTasks.length > 0 && (
        <View style={styles.section}>
          <TouchableOpacity onPress={handleClearArchive} style={styles.backButton}>
        <Text style={styles.clearText}>🗑️ Wyczyść archiwum</Text>
      </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>⬅️ Wróć</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}