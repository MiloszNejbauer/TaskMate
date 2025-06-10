import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const getGlobalStyles = (theme: 'light' | 'dark') => {
  const colors = Colors[theme];

  return {
    home: StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.background,
      },
      title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
        color: colors.text,
      },
      toggleLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
      },
      inputContainer: {
        marginBottom: 12,
      },
      input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: colors.secondary,
        color: colors.text,
      },
      addButton: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
      },
      addButtonText: {
        color: colors.background,
        fontWeight: '600',
        fontSize: 16,
      },
      datetimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        justifyContent: 'space-between',
      },
      datetimeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.muted,
      },
      taskItem: {
        padding: 14,
        backgroundColor: colors.secondary,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.border,
      },
      taskText: {
        fontSize: 16,
        color: colors.text,
      },
      taskDone: {
        textDecorationLine: 'line-through',
        color: colors.muted,
      },
      deadline: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 4,
      },
      empty: {
        textAlign: 'center',
        color: colors.muted,
        marginTop: 32,
        fontSize: 16,
      },
      webPickerContainer: {
        marginBottom: 12,
      },
      toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      },
      pinnedTask: {
        backgroundColor: theme === 'dark' ? '#332f0a' : '#fffbe6',
        borderColor: '#f1c40f',
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 12,
        color: colors.text,
      },
      deadlineButton: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
      },
      deadlineButtonText: {
        color: colors.background,
        fontWeight: '600',
        fontSize: 14,
      },
      pinButton: {
        position: 'absolute',
        top: 8,
        right: 10,
        padding: 4,
        zIndex: 10,
      },
      pinIcon: {
        fontSize: 24,
      },
    }),

    settings: StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.background,
      },
      title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: colors.text,
      },
      optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      },
      optionLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
      },
      section: {
        marginVertical: 16,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: colors.text,
        padding: 10
      },
      optionButton: {
        alignItems: 'center',
        borderRadius: 20,
        borderColor: colors.text,
        borderWidth: 3,
        padding: 10,
        backgroundColor: colors.secondary,
      }
    }),

    archive: StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.background,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: colors.text,
      },
      taskItem: {
        padding: 12,
        backgroundColor: colors.secondary,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.border,
      },
      taskText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
      },
      deadline: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 4,
        fontWeight: 'bold'
      },
      empty: {
        textAlign: 'center',
        marginTop: 32,
        color: colors.muted,
        fontSize: 18
      },
      backButton: {
        marginTop: 24,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.text,
        borderRadius: 20,
        backgroundColor: colors.secondary,
        padding: 8
      },
      backText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.tint,
      },
      section: {
        marginTop: 24,
      },
      clearText: {
        fontSize: 18,
        color: colors.danger,
        fontWeight: 'bold',

      }
    }),

    tabBar: StyleSheet.create({
      tabBar: {
        backgroundColor: colors.background,
        borderTopWidth: 0.5,
        borderTopColor: colors.border,
      },
    }),

    pickers: StyleSheet.create({
      overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modal: {
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        minWidth: 320,
        maxWidth: 380,
        alignSelf: 'center',
        overflow: 'hidden',
      },

      confirmRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 8,
      },
      confirmText: {
        fontWeight: 'bold',
        fontSize: 16,
      },
    }),

  };
};
