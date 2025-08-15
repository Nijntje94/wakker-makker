import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';

import { useSettings } from '../context/SettingsContext';
import { useAlarms } from '../context/AlarmsContext';
import { useReminders } from '../context/RemindersContext';
import Clock from '../components/Clock';
import AlarmItem from '../components/AlarmItem';
import ReminderItem from '../components/ReminderItem';

export default function HomeScreen({ navigation }) {
  const { settings, t } = useSettings();
  const { alarms, deleteAlarm, toggleAlarm } = useAlarms();
  const { reminders, deleteReminder, toggleReminder } = useReminders();
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const handleCreateAlarm = () => {
    setShowCreateMenu(false);
    navigation.navigate('CreateAlarm');
  };

  const handleCreateReminder = () => {
    setShowCreateMenu(false);
    navigation.navigate('CreateReminder');
  };

  const handleAlarmAction = (alarm, action) => {
    if (action === 'delete') {
      if (confirm('Weet je zeker dat je deze wekker wilt verwijderen?')) {
        deleteAlarm(alarm.id);
      }
    } else if (action === 'edit') {
      navigation.navigate('EditAlarm', { alarmId: alarm.id });
    } else if (action === 'toggle') {
      toggleAlarm(alarm.id);
    }
  };

  const handleReminderAction = (reminder, action) => {
    if (action === 'delete') {
      if (confirm('Weet je zeker dat je deze reminder wilt verwijderen?')) {
        deleteReminder(reminder.id);
      }
    } else if (action === 'edit') {
      navigation.navigate('EditReminder', { reminderId: reminder.id });
    } else if (action === 'toggle') {
      toggleReminder(reminder.id);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header met Clock en Settings */}
        <View style={styles.header}>
          <Clock />
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.settingsText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Wekkers Sectie */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('alarms')}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowCreateMenu(true)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {alarms.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>⏰</Text>
              <Text style={styles.emptyText}>Geen wekkers ingesteld</Text>
            </View>
          ) : (
            <View>
              {alarms.map((item) => (
                <AlarmItem
                  key={item.id}
                  alarm={item}
                  onAction={(action) => handleAlarmAction(item, action)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Reminders Sectie */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('reminders')}</Text>

          {reminders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyText}>Geen reminders ingesteld</Text>
            </View>
          ) : (
            <View>
              {reminders.map((item) => (
                <ReminderItem
                  key={item.id}
                  reminder={item}
                  onAction={(action) => handleReminderAction(item, action)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Footer met app info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Wakker-Makker v1.0</Text>
          <Text style={styles.footerText}>Open Source - AGPLv3</Text>
        </View>
      </ScrollView>

      {/* Create Menu Modal */}
      <Modal
        visible={showCreateMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCreateMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCreateMenu(false)}
        >
          <View style={styles.createMenu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleCreateAlarm}
            >
              <Text style={styles.menuIcon}>⏰</Text>
              <Text style={styles.menuText}>{t('newAlarm')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleCreateReminder}
            >
              <Text style={styles.menuIcon}>🔔</Text>
              <Text style={styles.menuText}>{t('newReminder')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6200ee',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  settingsButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  settingsText: {
    fontSize: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createMenu: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    minWidth: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});
