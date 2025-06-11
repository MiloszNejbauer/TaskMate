import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router'; // Nawigacja (np. router.back())
import { useSelector, useDispatch } from 'react-redux'; // Dostęp do stanu Redux
import { RootState } from '../redux/store'; // Typowanie stanu globalnego
import { clearArchive } from '../redux/tasksSlice'; // Akcja do czyszczenia archiwum
import { getGlobalStyles } from '@/styles/globalStyles'; // Style zależne od motywu
import { useColorScheme } from '@/hooks/useColorScheme'; // Hak do wyboru jasny/ciemny motyw
import { SafeAreaView } from 'react-native-safe-area-context'; // Bezpieczne obszary na telefonach

export default function ArchiveScreen() {
  const router = useRouter(); // Dostęp do nawigacji
  const dispatch = useDispatch(); // Funkcja do wywoływania akcji Redux

  // Styl zależny od motywu
  const theme = useColorScheme() ?? 'light';
  const styles = getGlobalStyles(theme).archive;

  // Pobranie zarchiwizowanych zadań ze stanu Redux
  const archivedTasks = useSelector((state: RootState) => state.tasks.archived);

  // Funkcja czyszcząca archiwum zadań z potwierdzeniem
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
      {/* Tytuł ekranu */}
      <Text style={styles.title}>📁 Archiwum zadań</Text>

      {/* Lista zadań zarchiwizowanych */}
      <FlatList
        data={archivedTasks} // Lista danych
        keyExtractor={(item) => item.id} // Klucz unikalny dla każdego zadania
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
        ListEmptyComponent={
          <Text style={styles.empty}>Brak zarchiwizowanych zadań</Text>
        }
      />

      {/* Przycisk czyszczenia archiwum (pokazuje się tylko jeśli są zadania) */}
      {archivedTasks.length > 0 && (
        <View style={styles.section}>
          <TouchableOpacity onPress={handleClearArchive} style={styles.backButton}>
            <Text style={styles.clearText}>🗑️ Wyczyść archiwum</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Przycisk powrotu */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>⬅️ Wróć</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
