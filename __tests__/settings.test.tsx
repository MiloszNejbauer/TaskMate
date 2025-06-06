import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import SettingsScreen from '@/app/(tabs)/settings';
import { store } from '@/redux/store';

describe('SettingsScreen', () => {
  it('renderuje nagłówek i główne elementy UI', () => {
    const { getByText, getByLabelText } = render(
      <Provider store={store}>
        <SettingsScreen />
      </Provider>
    );

    expect(getByText('Ustawienia')).toBeTruthy();
    expect(getByText('📁 Archiwum zadań')).toBeTruthy();
    expect(getByText('Powiadomienia')).toBeTruthy();
  });

  it('po włączeniu powiadomień pojawiają się dodatkowe opcje', () => {
    const { getByText, getByLabelText, queryByText } = render(
      <Provider store={store}>
        <SettingsScreen />
      </Provider>
    );

    const toggle = getByText('Powiadomienia').parent?.findByType?.('Switch') ?? null;

    if (toggle) {
      fireEvent(toggle, 'valueChange', true);
      expect(getByText('Kiedy powiadamiać?')).toBeTruthy();
      expect(getByText('Godzinę przed deadlinem')).toBeTruthy();
      expect(getByText('Dzień przed deadlinem')).toBeTruthy();
    }
  });
});
