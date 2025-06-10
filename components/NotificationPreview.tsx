import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type NotificationPreviewProps = {
  deadline?: Date;
  notifyHourBefore: boolean;
  notifyDayBefore: boolean;
};

const NotificationPreview: React.FC<NotificationPreviewProps> = ({
  deadline,
  notifyHourBefore,
  notifyDayBefore,
}) => {
  if (!deadline) {
    return (
      <View style={styles.container}>
        <Text style={styles.warning}>📅 Brak ustawionej daty – brak powiadomień</Text>
      </View>
    );
  }

  const now = new Date();
  const hourBefore = new Date(deadline.getTime() - 60 * 60 * 1000);
  const dayBefore = new Date(deadline.getTime() - 24 * 60 * 60 * 1000);

  const format = (date: Date) => date.toLocaleString();

  const rows = [
    notifyDayBefore && dayBefore > now && {
      label: '📆 Dzień przed:',
      time: format(dayBefore),
    },
    notifyHourBefore && hourBefore > now && {
      label: '⏰ Godzinę przed:',
      time: format(hourBefore),
    },
    deadline > now && {
      label: '🔔 Główne przypomnienie:',
      time: format(deadline),
    },
  ].filter(Boolean) as { label: string; time: string }[];

  return (
    <View style={styles.container}>
      {rows.length > 0 ? (
        rows.map((row, idx) => (
          <Text key={idx} style={styles.row}>
            {row.label} <Text style={styles.time}>{row.time}</Text>
          </Text>
        ))
      ) : (
        <Text style={styles.warning}>⚠️ Żadne powiadomienie nie zostanie ustawione</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#eef2ff',
    borderRadius: 8,
    marginVertical: 10,
  },
  row: {
    fontSize: 14,
    marginVertical: 2,
  },
  time: {
    fontWeight: '600',
  },
  warning: {
    fontSize: 14,
    color: '#ff3b30',
  },
});

export default NotificationPreview;
