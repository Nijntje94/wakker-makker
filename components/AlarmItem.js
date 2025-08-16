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
      case 'barcode': return '📷';
      case 'math': return '🧮';
      case 'shake': return '📱';
      default: return '✓';
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

  const getSoundIcon = () => {
    switch (alarm.sound?.type) {
      case 'local': return '🎵';
      case 'custom': return '📁';
      default: return '🔔';
    }
  };

  const nextAlarmTime = getNextAlarmTime(alarm);
  const alarmTime = new Date();
  const [hours, minutes] = alarm.time.split(':').map(Number);
  alarmTime.setHours(hours, minutes, 0, 0);

  const testAlarm = () => {
    setShowOptions(false);
    alert(`Test wekker: ${alarm.sound?.name || 'Geen geluid'} wordt afgespeeld!`);
  };

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
            <Text style={[styles.infoIcon, !alarm.isEnabled && styles.disabledText]}>
              {getStopMethodIcon()}
            </Text>
            <Text style={[styles.infoText, !alarm.isEnabled && styles.disabledText]}>
              {getStopMethodText()}
            </Text>
            <Text style={[styles.infoIcon, !alarm.isEnabled && styles.disabledText]}>
              {alarm.volumeType === 'gradual' ? '🔉' : '🔊'}
            </Text>
          </View>
          {alarm.sound && (
            <View style={styles.soundRow}>
              <Text style={[styles.soundIcon, !alarm.isEnabled && styles.disabledText]}>
                {getSoundIcon()}
              </Text>
              <Text style={[styles.soundText, !alarm.isEnabled && styles.disabledText]}>
                {alarm.sound.name}
              </Text>
            </View>
          )}
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
              onPress={testAlarm}
            >
              <Text style={styles.optionIcon}>🧪</Text>
              <Text style={styles.optionText}>Test Wekker</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptions(false);
                onAction('edit');
              }}
            >
              <Text style={styles.optionIcon}>✏️</Text>
              <Text style={styles.optionText}>{t('edit')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.optionItem, styles.deleteOption]}
              onPress={() => {
                setShowOptions(false);
                onAction('delete');
              }}
            >
              <Text style={styles.optionIcon}>🗑️</Text>
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
  infoIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginRight: 15,
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  soundIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  soundText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
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
  optionIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  deleteOption: {
    marginTop: 5,
  },
  deleteText: {
    color: '#f44336',
  },
});
