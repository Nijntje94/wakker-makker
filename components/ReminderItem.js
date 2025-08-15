import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';

export default function ReminderItem({ reminder, onAction }) {
  const { formatTime, t } = useSettings();
  const [showOptions, setShowOptions] = useState(false);

  const reminderTime = new Date();
  const [hours, minutes] = reminder.time.split(':').map(Number);
  reminderTime.setHours(hours, minutes, 0, 0);

  const reminderDate = new Date(reminder.date);
  const isToday = reminderDate.toDateString() === new Date().toDateString();
  const isTomorrow = reminderDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
  
  const getDateText = () => {
    if (isToday) return 'Vandaag';
    if (isTomorrow) return 'Morgen';
    return reminderDate.toLocaleDateString('nl-NL', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const isPastDue = new Date(reminder.date + 'T' + reminder.time) < new Date() && reminder.isEnabled;

  return (
    <View style={[
      styles.container, 
      !reminder.isEnabled && styles.disabledContainer,
      isPastDue && styles.pastDueContainer
    ]}>
      <TouchableOpacity
        style={styles.mainContent}
        onPress={() => setShowOptions(true)}
        disabled={!reminder.isEnabled}
      >
        <View style={styles.leftSection}>
          <Text style={[styles.title, !reminder.isEnabled && styles.disabledText]}>
            {reminder.title}
          </Text>
          <Text style={[styles.time, !reminder.isEnabled && styles.disabledText]}>
            {formatTime(reminderTime)} - {getDateText()}
          </Text>
          {reminder.description && (
            <Text style={[styles.description, !reminder.isEnabled && styles.disabledText]}>
              {reminder.description}
            </Text>
          )}
          <View style={styles.infoRow}>
            <Ionicons 
              name={reminder.volumeType === 'gradual' ? 'volume-low-outline' : 'volume-high-outline'} 
              size={16} 
              color={reminder.isEnabled ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)"} 
            />
            <Text style={[styles.infoText, !reminder.isEnabled && styles.disabledText]}>
              {reminder.volumeType === 'gradual' ? 'Geleidelijk volume' : 'Vol volume'}
            </Text>
          </View>
          {isPastDue && (
            <Text style={styles.pastDueText}>
              Verlopen reminder
            </Text>
          )}
        </View>

        <View style={styles.rightSection}>
          <Switch
            value={reminder.isEnabled}
            onValueChange={() => onAction('toggle')}
            trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#4CAF50' }}
            thumbColor={reminder.isEnabled ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </TouchableOpacity>

      {/* Options Modal */}
      <Modal
        visible={showOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsMenu}>
            <Text style={styles.optionsTitle}>Reminder Opties</Text>
            
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptions(false);
                onAction('edit');
              }}
            >
              <Ionicons name="create-outline" size={24} color="#6200ee" />
              <Text style={styles.optionText}>{t('edit')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.optionItem, styles.deleteOption]}
              onPress={() => {
                setShowOptions(false);
                onAction('delete');
              }}
            >
              <Ionicons name="trash-outline" size={24} color="#f44336" />
              <Text style={[styles.optionText, styles.deleteText]}>{t('delete')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  disabledContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  pastDueContainer: {
    backgroundColor: 'rgba(255,152,0,0.2)',
  },
  mainContent: {
    flexDirection: 'row',
    padding: 15,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  time: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 5,
  },
  pastDueText: {
    fontSize: 11,
    color: '#ff9800',
    marginTop: 5,
    fontWeight: 'bold',
  },
  disabledText: {
    color: 'rgba(255,255,255,0.3)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsMenu: {
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
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  deleteOption: {
    marginTop: 5,
  },
  deleteText: {
    color: '#f44336',
  },
});
