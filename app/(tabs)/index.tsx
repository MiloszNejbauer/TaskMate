import { FontAwesome } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import ProgressBar from '@/components/TaskProgressBar';
import WebDatePicker from '@/components/WebDatePicker';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePushPermissions } from '@/hooks/usePushPermissions';
import { getGlobalStyles } from '@/styles/globalStyles';
import type { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/store';
import {
  addTask,
  removeTask,
  Task,
  togglePin,
  toggleTask,
} from '../../redux/tasksSlice';

export default function HomeScreen() {
  const [newTask, setNewTask] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [hasDeadline, setHasDeadline] = useState(true);
  const [hasTime, setHasTime] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [showForm, setShowForm] = useState(false);
  

  const {
    notificationsEnabled,
    notifyHourBefore,
    notifyDayBefore,
  } = useSelector((state: RootState) => state.notificationSettings);

  const theme = useColorScheme() ?? 'light';
  const styles = getGlobalStyles(theme).home;
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const initialDate = useRef(new Date()).current;


  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const pinned = tasks.filter(t => t.pinned).sort((a, b) => new Date(a.deadline ?? 0).getTime() - new Date(b.deadline ?? 0).getTime());
  const today = tasks.filter(t => t.deadline && !t.pinned && new Date(t.deadline) >= todayStart && new Date(t.deadline) <= todayEnd).sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
  const upcoming = tasks.filter(t => t.deadline && !t.pinned && new Date(t.deadline) > todayEnd).sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
  const past = tasks.filter(t => t.deadline && !t.pinned && new Date(t.deadline) < todayStart).sort((a, b) => new Date(b.deadline!).getTime() - new Date(a.deadline!).getTime());
  const noDeadline = tasks.filter(t => !t.deadline && !t.pinned).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  usePushPermissions();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    if (!hasTime && deadline) deadline.setHours(23, 59, 59, 999);

    const isoDeadline = hasDeadline && deadline ? deadline.toISOString() : undefined;
    dispatch(addTask({ title: newTask, deadline: isoDeadline }));

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

    setNewTask('');
    setDeadline(undefined);
    setHasDeadline(true);
    setShowForm(false);
  };

  const pinScales = useRef<{ [key: string]: Animated.Value }>({}).current;

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>TaskMate</Text>

        {!showForm && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
            <Text style={styles.addButtonText}>➕ Dodaj nowe zadanie</Text>
          </TouchableOpacity>
        )}

        {showForm && (
          <>
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
                  <TouchableOpacity style={styles.deadlineButton} onPress={() => setShowDatePicker(true)}>
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
                  <TouchableOpacity style={styles.deadlineButton} onPress={() => setShowTimePicker(true)}>
                    <Text style={styles.deadlineButtonText}>
                      {deadline ? `Godzina: ${deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Ustaw godzinę'}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
              <Text style={styles.addButtonText}>✅ Dodaj zadanie</Text>
            </TouchableOpacity>
          </>
        )}

        <ScrollView style={styles.container}>
          {renderSection('📌 Ważne', pinned)}
          {renderSection('📅 Dzisiejsze', today)}
          {renderSection('⏳ Nadchodzące', upcoming)}
          {renderSection('🕓 Przeszłe', past)}
          {renderSection("Bez deadline'u", noDeadline)}
        </ScrollView>

        {/* Modal Date Picker */}
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          date={deadline || initialDate}
          onConfirm={selected => {
            const updated = new Date(selected);
            if (hasTime && deadline) {
              updated.setHours(deadline.getHours(), deadline.getMinutes());
            }
            setDeadline(updated);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
          themeVariant={theme}
          confirmTextIOS='zatwierdź'
          cancelTextIOS='anuluj'
          pickerStyleIOS={{ alignSelf: 'center' }}

        />

        {/* Modal Time Picker */}
        <DateTimePickerModal
          isVisible={showTimePicker}
          mode="time"
          date={deadline ?? new Date()}
          onConfirm={selected => {
            const updated = new Date(deadline ?? new Date());
            updated.setHours(selected.getHours(), selected.getMinutes());
            setDeadline(updated);
            setShowTimePicker(false);
          }}
          onCancel={() => setShowTimePicker(false)}
          themeVariant={theme}
          confirmTextIOS='zatwierdź'
          cancelTextIOS='anuluj'
          pickerStyleIOS={{ alignSelf: 'center' }}

        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}