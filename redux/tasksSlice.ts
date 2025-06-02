import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type Task = {
  id: string;
  title: string;
  done: boolean;
  deadline?: string;
  createdAt: string;
  pinned?: boolean;
};

type TasksState = {
  tasks: Task[];
  archived: Task[]; // <--- NOWE
};

const initialState: TasksState = {
  tasks: [],
  archived: [], // <--- NOWE
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ title: string; deadline?: string }>) => {
      console.log("REDUCER: addTask triggered");
      state.tasks.push({
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        title: action.payload.title,
        deadline: action.payload.deadline,
        createdAt: new Date().toISOString(),
        done: false,
      });
    },

    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.done = !task.done;
      }
    },

    removeTask: (state, action: PayloadAction<string>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload);
      if (index !== -1) {
        const [removedTask] = state.tasks.splice(index, 1);
        state.archived.push(removedTask); // <--- PRZENIESIENIE DO ARCHIWUM
      }
    },

    clearArchive: (state) => {
      state.archived = []; // <--- WYCZYŚĆ ARCHIWUM
    },

    togglePin: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.pinned = !task.pinned;
      }
    },

  },
});

export const { addTask, toggleTask, removeTask, clearArchive, togglePin } = tasksSlice.actions;
export default tasksSlice.reducer;
