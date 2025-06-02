import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  deadline: Date | undefined;
  setDeadline: (date: Date) => void;
};

export default function WebDatePicker({ deadline, setDeadline }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(deadline ?? new Date());

  const handleConfirm = () => {
    setDeadline(tempDate);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.touchable}>
        <Text style={styles.text}>
          {deadline ? deadline.toLocaleString() : 'Wybierz datę i godzinę'}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.picker}>
          <DatePicker
            selected={tempDate}
            onChange={(d: Date | null) => {
              if (d) setTempDate(d);
            }}
            inline
            showTimeSelect
            timeIntervals={1}
            timeFormat="HH:mm"
            dateFormat="dd.MM.yyyy HH:mm"
          />
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>✅ Zatwierdź</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  touchable: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  picker: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 8,
  },
  confirmButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#0a7ea4',
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});
