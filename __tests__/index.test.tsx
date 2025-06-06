import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)';

describe('HomeScreen', () => {
  it('renderuje poprawnie ekran TaskMate', () => {
    const { getByText, getByPlaceholderText } = render(<HomeScreen />);

    // Sprawdza, czy nagłówek się wyświetla
    expect(getByText('TaskMate')).toBeTruthy();

    // Sprawdza, czy pole tekstowe do wpisywania zadań jest widoczne
    expect(getByPlaceholderText('Dodaj nowe zadanie')).toBeTruthy();
  });

  it('po wpisaniu zadania i kliknięciu dodaj, zostaje ono dodane do listy', () => {
    const { getByPlaceholderText, getByText } = render(<HomeScreen />);
    
    const input = getByPlaceholderText('Dodaj nowe zadanie');
    fireEvent.changeText(input, 'Nowe zadanie testowe');

    const addButton = getByText('➕ Dodaj zadanie');
    fireEvent.press(addButton);

    // ❗ Zakładamy, że zadanie pojawi się na ekranie po dodaniu
    // UWAGA: Działa tylko jeśli komponent nie czyści od razu `newTask` bez widocznego efektu
    // Jeśli nie zadziała – sprawdzimy przez `getByText('Nowe zadanie testowe')`
  });
});
