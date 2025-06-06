import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ArchiveScreen from '@/app/archive';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Alert } from 'react-native';



const mockStore = configureStore();

describe('ArchiveScreen', () => {
    it('shows empty text when no archived tasks', () => {
        const store = mockStore({ tasks: { archived: [] } });

        const { getByText } = render(
            <Provider store={store}>
                <ArchiveScreen />
            </Provider>
        );

        expect(getByText('Brak zarchiwizowanych zadań')).toBeTruthy();
    });

    it('calls Alert.alert when clear button is pressed', () => {
        const store = mockStore({
            tasks: {
                archived: [{ id: '1', title: 'Task A', deadline: null }],
            },
        });

        const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => { });

        const { getByText } = render(
            <Provider store={store}>
                <ArchiveScreen />
            </Provider>
        );

        fireEvent.press(getByText('🗑️ Wyczyść archiwum'));

        expect(alertSpy).toHaveBeenCalledWith(
            'Potwierdzenie',
            'Na pewno usunąć całe archiwum?',
            expect.any(Array)
        );
    });
});
