import reducer, {
  setNotificationsEnabled,
  setNotifyHourBefore,
  setNotifyDayBefore,
} from '../redux/notificationSettingsSlice';

describe('notificationSettingsSlice', () => {
  const initialState = {
    notificationsEnabled: true,
    notifyHourBefore: false,
    notifyDayBefore: false,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('should handle setNotificationsEnabled', () => {
    const result = reducer(initialState, setNotificationsEnabled(false));
    expect(result.notificationsEnabled).toBe(false);
  });

  it('should handle setNotifyHourBefore', () => {
    const result = reducer(initialState, setNotifyHourBefore(true));
    expect(result.notifyHourBefore).toBe(true);
  });

  it('should handle setNotifyDayBefore', () => {
    const result = reducer(initialState, setNotifyDayBefore(true));
    expect(result.notifyDayBefore).toBe(true);
  });
});
