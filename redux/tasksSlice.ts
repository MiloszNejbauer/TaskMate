// Importy z Redux Toolkit oraz UUID do generowania unikalnych ID
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Typ jednego zadania
export type Task = {
  id: string;          // Unikalny identyfikator
  title: string;       // Tytuł zadania
  done: boolean;       // Czy zadanie zostało ukończone
  deadline?: string;   // Opcjonalny deadline w ISO
  createdAt: string;   // Data utworzenia zadania
  pinned?: boolean;    // Czy zadanie zostało przypięte (ważne)
};

// Typ całego stanu slice’a
type TasksState = {
  tasks: Task[];       // Lista aktywnych zadań
  archived: Task[];    // Lista zarchiwizowanych zadań (po usunięciu) <--- NOWE
};

// Stan początkowy
const initialState: TasksState = {
  tasks: [],           // Początkowo brak zadań
  archived: [],        // Początkowo brak archiwum <--- NOWE
};

// Tworzenie slice’a z reducerami
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Dodaje nowe zadanie do listy
    addTask: (state, action: PayloadAction<{ title: string; deadline?: string }>) => {
      console.log("REDUCER: addTask triggered");
      state.tasks.push({
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`, // Unikalny ID
        title: action.payload.title,                              // Tytuł
        deadline: action.payload.deadline,                        // Deadline jeśli jest
        createdAt: new Date().toISOString(),                      // Data utworzenia
        done: false,                                              // Domyślnie niezrobione
      });
    },

    // Przełącza status wykonania zadania (zrobione / niezrobione)
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.done = !task.done;
      }
    },

    // Usuwa zadanie z listy i przenosi je do archiwum <--- NOWE
    removeTask: (state, action: PayloadAction<string>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload);
      if (index !== -1) {
        const [removedTask] = state.tasks.splice(index, 1); // Usuń z aktywnych
        state.archived.push(removedTask);                   // Dodaj do archiwum
      }
    },

    // Czyści całkowicie archiwum zadań <--- NOWE
    clearArchive: (state) => {
      state.archived = [];
    },

    // Przełącza przypięcie zadania (pin/unpin)
    togglePin: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.pinned = !task.pinned;
      }
    },
  },
});

// Eksport akcji do użytku w komponentach
export const {
  addTask,
  toggleTask,
  removeTask,
  clearArchive,
  togglePin
} = tasksSlice.actions;

// Eksport reduktora do podłączenia w store
export default tasksSlice.reducer;
