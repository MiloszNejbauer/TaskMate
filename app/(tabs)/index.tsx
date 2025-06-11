// Importy niezbędnych bibliotek i komponentów
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Platform, ScrollView,
  Switch, Animated, Keyboard, TouchableWithoutFeedback, Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, store } from '../../redux/store';
import { addTask, toggleTask, removeTask, togglePin, Task } from '../../redux/tasksSlice';
import { usePushPermissions } from '@/hooks/usePushPermissions';
import * as Notifications from 'expo-notifications';
import WebDatePicker from '@/components/WebDatePicker';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getGlobalStyles } from '@/styles/globalStyles';
import ProgressBar from '@/components/TaskProgressBar';
import { FontAwesome } from '@expo/vector-icons';
import type { AppDispatch } from '../../redux/store';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  // Lokalny stan komponentu
  const [newTask, setNewTask] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [showPicker, setShowPicker] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [hasDeadline, setHasDeadline] = useState(true);
  const [hasTime, setHasTime] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);


  // Ustawienia powiadomień z reduxa
  const {
    notificationsEnabled,
    notifyHourBefore,
    notifyDayBefore,
  } = useSelector((state: RootState) => state.notificationSettings);

  // Styl i kolorystyka na podstawie motywu (ciemny/jasny)
  const theme = useColorScheme() ?? 'light';
  const styles = getGlobalStyles(theme).home;
  const colors = getGlobalStyles(theme);
  const pickerStyles = getGlobalStyles(theme).pickers;

  // Dostęp do dispatcha i listy zadań
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  // Ustawienia czasowe do filtrowania zadań wg daty
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Filtrowanie zadań wg kategorii
  const pinned = tasks.filter(t => t.pinned).sort((a, b) => new Date(a.deadline ?? 0).getTime() - new Date(b.deadline ?? 0).getTime());
  const today = tasks.filter(t => t.deadline && !t.pinned && new Date(t.deadline) >= todayStart && new Date(t.deadline) <= todayEnd).sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
  const upcoming = tasks.filter(t => t.deadline && !t.pinned && new Date(t.deadline) > todayEnd).sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
  const past = tasks.filter(t => t.deadline && !t.pinned && new Date(t.deadline) < todayStart).sort((a, b) => new Date(b.deadline!).getTime() - new Date(a.deadline!).getTime());
  const noDeadline = tasks.filter(t => !t.deadline && !t.pinned).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Ustawienia uprawnień do powiadomień
  usePushPermissions();

  // Odświeżanie czasu co sekundę
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Obsługa dodawania zadania
  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    if (!hasTime && deadline) deadline.setHours(23, 59, 59, 999);

    const isoDeadline = hasDeadline && deadline ? deadline.toISOString() : undefined;
    dispatch(addTask({ title: newTask, deadline: isoDeadline }));

    // Powiadomienia lokalne
    if (notificationsEnabled && Platform.OS !== 'web' && deadline && deadline > new Date()) {
      const now = new Date();
      const triggers: { time: Date; body: string }[] = [];

      const addNotification = (targetTime: Date, message: string) => {
        if (targetTime.getTime() > now.getTime() + 10000) {
          triggers.push({ time: targetTime, body: message });
        }
      };

      if (notifyHourBefore) addNotification(new Date(deadline.getTime() - 3600000), `Zadanie "${newTask}" kończy się za godzinę!`);
      if (notifyDayBefore) addNotification(new Date(deadline.getTime() - 86400000), `Zadanie "${newTask}" kończy się jutro!`);
      addNotification(deadline, `Zadanie "${newTask}" ma teraz deadline!`);

      for (const trigger of triggers) {
        await Notifications.scheduleNotificationAsync({
          content: { title: 'Przypomnienie', body: trigger.body },
          trigger: trigger.time as unknown as Notifications.NotificationTriggerInput,
        });
      }
    }

    // Resetowanie stanu po dodaniu
    setNewTask('');
    setDeadline(undefined);
    setHasDeadline(true);
    setShowForm(false);
  };

  // Animacja skalowania gwiazdek (pinów)
  const pinScales = useRef<{ [key: string]: Animated.Value }>({}).current;

  // Renderowanie sekcji zadań wg kategorii
  const renderSection = (title: string, data: Task[]) => (
    <>
      {data.length > 0 && <Text style={styles.sectionTitle}>{title}</Text>}
      {data.map(item => {
        if (!pinScales[item.id]) pinScales[item.id] = new Animated.Value(1);

        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.taskItem, item.pinned && styles.pinnedTask]}
            onPress={() => dispatch(toggleTask(item.id))}
            onLongPress={() => dispatch(removeTask(item.id))}
          >
            <Text style={[styles.taskText, item.done && styles.taskDone]}>{item.title}</Text>
            {item.deadline && <Text style={styles.deadline}>🕒 {new Date(item.deadline).toLocaleString()}</Text>}
            <ProgressBar progress={(now - new Date(item.createdAt).getTime()) / (new Date(item.deadline!).getTime() - new Date(item.createdAt).getTime())} />
            <TouchableOpacity onPress={() => {
              Animated.sequence([
                Animated.timing(pinScales[item.id], { toValue: 1.4, duration: 150, useNativeDriver: true }),
                Animated.timing(pinScales[item.id], { toValue: 1, duration: 150, useNativeDriver: true }),
              ]).start();
              dispatch(togglePin(item.id));
            }} style={styles.pinButton}>
              <Animated.View style={{ transform: [{ scale: pinScales[item.id] }] }}>
                <FontAwesome name={item.pinned ? 'star' : 'star-o'} size={24} color={item.pinned ? '#f1c40f' : '#999'} />
              </Animated.View>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
    </>
  );

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setShowPicker(false);
      setShowTimePicker(false);
    }}>
      <SafeAreaView style={styles.container}>
        {/* Tytuł aplikacji */}
        <Text style={styles.title}>TaskMate</Text>

        {/*Przycisk otwierający form tworzenia zadania */}
        {!showForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.addButtonText}>➕ Dodaj nowe zadanie</Text>
          </TouchableOpacity>
        )}


        {/* Pole tekstowe do wpisania nowego zadania */}
        {showForm && (
          <>
            {/* Pole tekstowe do wpisania nowego zadania */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Dodaj nowe zadanie"
                value={newTask}
                onChangeText={setNewTask}
                style={styles.input}
              />
            </View>

            {/* Przełącznik deadline'u */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Zadanie z deadlinem:</Text>
              <Switch value={hasDeadline} onValueChange={setHasDeadline} />
            </View>

            {/* Wybór daty i godziny jeśli deadline jest włączony */}
            {hasDeadline && (
              <>
                <View style={styles.datetimeRow}>
                  <TouchableOpacity
                    style={styles.deadlineButton}
                    onPress={() => {
                      if (!deadline) {
                        const now = new Date();
                        if (!hasTime) now.setHours(23, 59, 59, 999);
                        setDeadline(now);
                      }
                      setShowPicker(prev => !prev);
                    }}
                  >
                    <Text style={styles.deadlineButtonText}>🕒 Ustaw deadline</Text>
                  </TouchableOpacity>
                  <Text style={[styles.datetimeText, !deadline && { color: 'red' }]}>
                    {deadline ? (hasTime ? deadline.toLocaleString() : deadline.toLocaleDateString()) : 'Wybierz datę'}
                  </Text>
                </View>

                {Platform.OS === 'web' && (
                  <View style={styles.webPickerContainer}>
                    <WebDatePicker deadline={deadline} setDeadline={setDeadline} />
                  </View>
                )}

                <View style={styles.toggleRow}>
                  <Text style={{ fontSize: 14, color: styles.taskText.color }}>Zadanie z godziną:</Text>
                  <Switch value={hasTime} onValueChange={setHasTime} />
                </View>

                {hasTime && (
                  <TouchableOpacity onPress={() => {
                    if (!deadline) setDeadline(new Date());
                    setTempTime(deadline || new Date());
                    setShowTimePicker(true);
                  }} style={styles.deadlineButton}>
                    <Text style={styles.deadlineButtonText}>
                      {deadline ? `Godzina: ${deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Ustaw godzinę'}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* Przycisk dodania zadania */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
              <Text style={styles.addButtonText}>✅ Dodaj zadanie</Text>
            </TouchableOpacity>
          </>
        )}


        {/* Lista zadań w scrollview */}
        <ScrollView style={styles.container}>
          {renderSection('📌 Ważne', pinned)}
          {renderSection('📅 Dzisiejsze', today)}
          {renderSection('⏳ Nadchodzące', upcoming)}
          {renderSection('🕓 Przeszłe', past)}
          {renderSection("Bez deadline'u", noDeadline)}
        </ScrollView>

        {/* Modal z pickerami daty i czasu (tylko native) */}
        {(showPicker || showTimePicker) && Platform.OS !== 'web' && (
          <Modal transparent animationType="fade" visible>
            <TouchableWithoutFeedback onPress={() => { setShowPicker(false); setShowTimePicker(false); }}>
              <View style={pickerStyles.overlay}>
                <TouchableWithoutFeedback>
                  <View style={[pickerStyles.modal, { backgroundColor: styles.container.backgroundColor }]}>
                    {showPicker && (
                      <DateTimePicker
                        value={deadline || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={(event, selectedDate) => {
                          if (event.type === 'set' && selectedDate) {
                            const updated = new Date(selectedDate);
                            if (deadline && hasTime) {
                              updated.setHours(deadline.getHours(), deadline.getMinutes());
                            }
                            setDeadline(updated);
                          }
                          setShowPicker(false);
                        }}
                        themeVariant={theme}
                      />
                    )}

                    {showTimePicker && (
                      <>
                        <View style={pickerStyles.confirmRow}>
                          <TouchableOpacity onPress={() => {
                            if (tempTime && deadline) {
                              const updated = new Date(deadline);
                              updated.setHours(tempTime.getHours(), tempTime.getMinutes());
                              setDeadline(updated);
                            }
                            setShowTimePicker(false);
                            setTempTime(null);
                          }}>
                            <Text style={[pickerStyles.confirmText, { color: styles.addButton.backgroundColor }]}>Zatwierdź</Text>
                          </TouchableOpacity>
                        </View>

                        <DateTimePicker
                          value={tempTime || deadline || new Date()}
                          mode="time"
                          display="spinner"
                          onChange={(event, selectedTime) => {
                            if (event.type === 'set' && selectedTime) {
                              setTempTime(selectedTime);
                            }
                          }}
                          themeVariant={theme}
                        />
                      </>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}

      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
