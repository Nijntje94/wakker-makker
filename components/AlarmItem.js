import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import { useAlarms } from '../context/AlarmsContext';

export default function AlarmItem({ alarm, onAction }) {
  const { formatTime, t } = useSettings();
  const { getNextAlarmTime } = useAlarms();
  const [showOptions, setShowOptions] = useState(false);

  const dayLabels = [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')];
  
  const getActiveDays = () => {
    return alarm.days
      .map((isActive, index) => isActive ? dayLabels[index] : null)
      .filter(day => day !== null)
      .join(', ');
  };

  const getStopMethodIcon = () => {
    switch (alarm.stopMethod) {
      case 'barcode': return 'barcode-outline';
      case 'math': return 'calculator-outline';
      case 'shake': return 'phone-portrait-outline';
      default: return 'checkmark-circle-outline';
    }
  };

  const getStopMethodText = () => {
    switch (alarm.stopMethod) {
      case 'barcode': return 'Barcode';
      case 'math': return 'Rekensom';
      case 'shake': return 'Schudden';
      default: return 'Normaal';
    }
  };

  const nextAlarmTime = getNextAlarmTime(alarm);
  const alarmTime = new Date();
  const [hours, minutes] = alarm.time.split(':').map(Number);
  alarmTime.setHours(hours, minutes, 0, 0);

  return (
    <View style={[styles.container, !alarm.isEnabled && styles.disabledContainer]}>
      <TouchableOpacity
        style={styles.mainContent}
        onPress={() => setShowOptions(true)}
        disabled={!alarm.isEnabled}
      >
        <View style={styles.leftSection}>
          <Text style={[styles.time, !alarm.isEnabled && styles.disabledText]}>
            {formatTime(alarmTime)}
          </Text>
          <Text style={[styles.days, !alarm.isEnabled && styles.disabledText]}>
            {getActiveDays()}
          </Text>
          {alarm.text && (
            <Text style={[styles.alarmText, !alarm.isEnabled && styles.disabledText]}>
              {alarm.text}
            </Text>
          )}
          <View style={styles.infoRow}>
            <Ionicons 
              name={getStopMethodIcon()} 
              size={16} 
              color={alarm.isEnabled ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)"} 
            />
            <Text style={[styles.infoText, !alarm.isEnabled && styles.disabledText]}>
              {getStopMethodText()}
            </Text>
            <Ionicons 
              name={alarm.volumeType === 'gradual' ? 'volume-low-outline' : 'volume-high-outline'} 
              size={16} 
              color={alarm.isEnabled ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)"} 
              style={styles.volumeIcon}
            />
          </View>
          {nextAlarmTime && alarm.isEnabled && (
            <Text style={styles.nextAlarm}>
              Volgende alarm: {formatTime(nextAlarmTime)} op {nextAlarmTime.toLocaleDateString('nl-NL', { weekday: 'long' })}
            </Text>
          )}
        </View>

        <View style={styles.rightSection}>
          <Switch
            value={alarm.isEnabled}
            onValueChange={() => onAction('toggle')}
            trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#4CAF50' }}
            thumbColor={alarm.isEnabled ? '#ffffff' : '#f4f3f4'}
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
            <Text style={styles.optionsTitle}>Wekker Opties</Text>
            
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
  time: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  days: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  alarmText: {
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
  volumeIcon: {
    marginLeft: 15,
  },
  nextAlarm: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 5,
    fontStyle: 'italic',
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
});
