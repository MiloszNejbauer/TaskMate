import tasksReducer, { addTask, toggleTask, removeTask, togglePin, Task } from '../redux/tasksSlice';

describe('tasksSlice', () => {
  let initialState: { tasks: Task[]; archived: Task[] };

  beforeEach(() => {
    initialState = {
      tasks: [],
      archived: [],
    };
  });

  it('should handle addTask', () => {
    const state = tasksReducer(initialState, addTask({ title: 'Nowe zadanie', deadline: '2025-06-01T12:00:00Z' }));
    expect(state.tasks.length).toBe(1);
    expect(state.tasks[0].title).toBe('Nowe zadanie');
    expect(state.tasks[0].done).toBe(false);
    expect(state.tasks[0].deadline).toBe('2025-06-01T12:00:00Z');
  });

  it('should toggle task completion', () => {
    const added = tasksReducer(initialState, addTask({ title: 'Zadanie', deadline: undefined }));
    const taskId = added.tasks[0].id;

    const toggled = tasksReducer(added, toggleTask(taskId));
    expect(toggled.tasks[0].done).toBe(true);

    const untoggled = tasksReducer(toggled, toggleTask(taskId));
    expect(untoggled.tasks[0].done).toBe(false);
  });

  it('should remove task and move to archive', () => {
    const added = tasksReducer(initialState, addTask({ title: 'Do usunięcia' }));
    const taskId = added.tasks[0].id;

    const removed = tasksReducer(added, removeTask(taskId));

    expect(removed.tasks.length).toBe(0);
    expect(removed.archived.length).toBe(1);
    expect(removed.archived[0].title).toBe('Do usunięcia');
  });

  it('should toggle pin on task', () => {
    const added = tasksReducer(initialState, addTask({ title: 'Ważne' }));
    const taskId = added.tasks[0].id;

    const pinned = tasksReducer(added, togglePin(taskId));
    expect(pinned.tasks[0].pinned).toBe(true);

    const unpinned = tasksReducer(pinned, togglePin(taskId));
    expect(unpinned.tasks[0].pinned).toBe(false);
  });
});
