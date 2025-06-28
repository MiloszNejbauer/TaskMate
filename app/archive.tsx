import { useColorScheme } from '@/hooks/useColorScheme'; // Hook do wyboru jasny/ciemny motyw
import { getGlobalStyles } from '@/styles/globalStyles'; // Style zależne od motywu
import { useRouter } from 'expo-router'; // Nawigacja 
import React from 'react';
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Bezpieczne obszary na telefonach
import { useDispatch, useSelector } from 'react-redux'; // Dostęp do stanu Redux
import { RootState } from '../redux/store'; // Typowanie stanu globalnego
import { clearArchive } from '../redux/tasksSlice'; // Akcja do czyszczenia archiwum

export default function ArchiveScreen() {
  const router = useRouter(); // Dostęp do nawigacji
  const dispatch = useDispatch(); // Funkcja do wywoływania akcji Redux

  // Styl zależny od motywu
  const theme = useColorScheme() ?? 'light';
  const styles = getGlobalStyles(theme).archive;

  // Pobranie zarchiwizowanych zadań ze stanu Redux
  const archivedTasks = useSelector((state: RootState) => state.tasks.archived);

  // Funkcja czyszcząca archiwum zadań
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
