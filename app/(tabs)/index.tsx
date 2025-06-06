// index.tsx (po zmianach)

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  Switch,
  Animated,
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
  const [newTask, setNewTask] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [showPicker, setShowPicker] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [hasDeadline, setHasDeadline] = useState(true);
  const [hasTime, setHasTime] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const {
    notificationsEnabled,
    notifyHourBefore,
    notifyDayBefore,
  } = useSelector((state: RootState) => state.notificationSettings);

  const theme = useColorScheme() ?? 'light';
  const styles = getGlobalStyles(theme).home;

  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const currentDate = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const pinned = tasks
    .filter(t => t.pinned)
    .sort((a, b) => new Date(a.deadline ?? 0).getTime() - new Date(b.deadline ?? 0).getTime());

  const today = tasks
    .filter(t =>
      t.deadline &&
      !t.pinned &&
      new Date(t.deadline) >= todayStart &&
      new Date(t.deadline) <= todayEnd
    )
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

  const upcoming = tasks
    .filter(t => t.deadline && !t.pinned && new Date(t.deadline) > todayEnd)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

  const past = tasks
    .filter(t => t.deadline && !t.pinned && new Date(t.deadline) < todayStart)
    .sort((a, b) => new Date(b.deadline!).getTime() - new Date(a.deadline!).getTime());

  const noDeadline = tasks
    .filter(t => !t.deadline && !t.pinned)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  usePushPermissions();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTask = async () => {
    console.log("dodawanie zadania");
    if (!newTask.trim()) return;

    if (!hasTime && deadline) {
      deadline.setHours(23, 59, 59, 999);
    }

    const isoDeadline = hasDeadline && deadline ? deadline.toISOString() : undefined;

    try {
      dispatch(addTask({
        title: newTask,
        deadline: isoDeadline,
      }));
    } catch (error) {
      console.error("Błąd przy dispatch(addTask):", error);
    }

    if (
      notificationsEnabled &&
      Platform.OS !== 'web' &&
      deadline &&
      deadline > new Date()
    ) {
      const now = new Date();
      const triggers: { seconds: number; body: string }[] = [];


      const addNotification = (targetTime: Date, message: string) => {
        const seconds = Math.floor((targetTime.getTime() - now.getTime()) / 1000);
        if (seconds > 10) {
          console.log(`🔔 Zaplanowano: "${message}" za ${seconds} sekund`);
          triggers.push({ seconds, body: message });
        } else {
          console.warn(`⚠️ Pominięto powiadomienie "${message}" (za ${seconds}s) — zbyt wcześnie.`);
        }
      };

      if (notifyHourBefore) {
        const hourBefore = new Date(deadline.getTime() - 60 * 60 * 1000);
        addNotification(hourBefore, `Zadanie "${newTask}" kończy się za godzinę!`);
      }

      if (notifyDayBefore) {
        const dayBefore = new Date(deadline.getTime() - 24 * 60 * 60 * 1000);
        addNotification(dayBefore, `Zadanie "${newTask}" kończy się jutro!`);
      }

      addNotification(deadline, `Zadanie "${newTask}" ma teraz deadline!`);

      for (const trigger of triggers) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Przypomnienie',
            body: trigger.body,
          },
          trigger: {
            seconds: trigger.seconds,
            channelId: 'default',
          },
        });
      }
    }

    setNewTask('');
    setDeadline(undefined);
    setHasDeadline(true);
  };

  const handleChangeDate = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDeadline(selectedDate);
  };

  const formatForInput = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const pinScales = useRef<{ [key: string]: Animated.Value }>({}).current;

  const renderSection = (title: string, data: Task[]) => (
    <>
      {data.length > 0 && <Text style={styles.sectionTitle}>{title}</Text>}
      {data.map(item => {
        if (!pinScales[item.id]) {
          pinScales[item.id] = new Animated.Value(1);
        }

        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.taskItem, item.pinned && styles.pinnedTask]}
            onPress={() => dispatch(toggleTask(item.id))}
            onLongPress={() => dispatch(removeTask(item.id))}
          >
            <Text style={[styles.taskText, item.done && styles.taskDone]}>
              {item.title}
            </Text>

            {item.deadline && (
              <Text style={styles.deadline}>
                🕒 {new Date(item.deadline).toLocaleString()}
              </Text>
            )}

            <ProgressBar
              progress={(() => {
                const created = new Date(item.createdAt).getTime();
                const end = new Date(item.deadline!).getTime();
                const nowTime = now;

                if (end <= created) return 1;
                const ratio = (nowTime - created) / (end - created);
                return Math.min(Math.max(ratio, 0), 1);
              })()}
            />

            <TouchableOpacity
              onPress={() => {
                Animated.sequence([
                  Animated.timing(pinScales[item.id], {
                    toValue: 1.4,
                    duration: 150,
                    useNativeDriver: true,
                  }),
                  Animated.timing(pinScales[item.id], {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                  }),
                ]).start();

                dispatch(togglePin(item.id));
              }}
              style={styles.pinButton}
            >
              <Animated.View style={{ transform: [{ scale: pinScales[item.id] }] }}>
                <FontAwesome
                  name={item.pinned ? 'star' : 'star-o'}
                  size={24}
                  color={item.pinned ? '#f1c40f' : '#999'}
                />
              </Animated.View>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>TaskMate</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Dodaj nowe zadanie"
          value={newTask}
          onChangeText={setNewTask}
          style={styles.input}
        />
      </View>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Zadanie z deadlinem:</Text>
        <Switch value={hasDeadline} onValueChange={setHasDeadline} />
      </View>

      {hasDeadline && (
        <>
          <View style={styles.datetimeRow}>
            <TouchableOpacity style={styles.deadlineButton} onPress={() => setShowPicker(true)}>
              <Text style={styles.deadlineButtonText}>🕒 Ustaw deadline</Text>
            </TouchableOpacity>

            <Text style={[styles.datetimeText, !deadline && { color: 'red' }]}>
              {deadline
                ? hasTime
                  ? deadline.toLocaleString()
                  : deadline.toLocaleDateString()
                : 'Wybierz datę'}
            </Text>
          </View>

          {Platform.OS === 'web' ? (
            <View style={styles.webPickerContainer}>
              <WebDatePicker deadline={deadline} setDeadline={setDeadline} />
            </View>
          ) : (
            <>
              {showPicker && (
                <DateTimePicker
                  value={deadline || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowPicker(false);
                    if (selectedDate) {
                      const updated = new Date(selectedDate);
                      if (deadline && hasTime) {
                        updated.setHours(deadline.getHours(), deadline.getMinutes());
                      }
                      setDeadline(updated);
                    }
                  }}
                />
              )}

              {hasTime && showTimePicker && (
                <DateTimePicker
                  value={deadline || new Date()}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(false);
                    if (selectedTime && deadline) {
                      const updated = new Date(deadline);
                      updated.setHours(selectedTime.getHours(), selectedTime.getMinutes());
                      setDeadline(updated);
                    }
                  }}
                />
              )}
            </>
          )}
        </>
      )}

      {hasDeadline && (
        <View style={styles.toggleRow}>
          <Text style={{ fontSize: 14, color: styles.taskText.color }}>
            Zadanie z godziną:
          </Text>
          <Switch value={hasTime} onValueChange={setHasTime} />
        </View>
      )}

      {hasTime && hasDeadline && (
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={styles.deadlineButton}
        >
          <Text style={styles.deadlineButtonText}>
            {deadline
              ? `Godzina: ${deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : 'Ustaw godzinę'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>➕ Dodaj zadanie</Text>
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        {renderSection('📌 Ważne', pinned)}
        {renderSection('📅 Dzisiejsze', today)}
        {renderSection('⏳ Nadchodzące', upcoming)}
        {renderSection('🕓 Przeszłe', past)}
        {renderSection("Bez deadline'u", noDeadline)}
      </ScrollView>
    </SafeAreaView>
  );
}
