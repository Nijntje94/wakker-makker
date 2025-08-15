import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';

import { useSettings } from '../context/SettingsContext';
import { useAlarms } from '../context/AlarmsContext';

export default function CreateAlarmScreen({ navigation }) {
  const { t } = useSettings();
  const { addAlarm } = useAlarms();

  const [hours, setHours] = useState('07');
  const [minutes, setMinutes] = useState('30');
  const [days, setDays] = useState([true, true, true, true, true, false, false]);
  const [alarmText, setAlarmText] = useState('');
  const [volumeType, setVolumeType] = useState('gradual'); // 'gradual' or 'full'
  const [stopMethod, setStopMethod] = useState('normal'); // 'normal', 'barcode', 'math', 'shake'
  const [barcodeData, setBarcodeData] = useState('');

  const dayLabels = [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')];

  const toggleDay = (index) => {
    const newDays = [...days];
    newDays[index] = !newDays[index];
    setDays(newDays);
  };

  const saveAlarm = () => {
    // Validaties
    if (!days.some(day => day)) {
      alert('Selecteer minstens één dag voor de wekker.');
      return;
    }

    if (parseInt(hours) < 0 || parseInt(hours) > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59) {
      alert('Voer een geldige tijd in (00:00 - 23:59).');
      return;
    }

    const alarmData = {
      time: `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`,
      days,
      text: alarmText,
      volumeType,
      stopMethod,
      barcodeData: stopMethod === 'barcode' ? barcodeData : '',
      sound: 'default',
    };

    addAlarm(alarmData);
    alert('Wekker opgeslagen!');
    navigation.goBack();
  };

  const stopMethodOptions = [
    { key: 'normal', label: t('normalStop'), icon: '✓' },
    { key: 'barcode', label: t('barcodeStop'), icon: '📷' },
    { key: 'math', label: t('mathStop'), icon: '🧮' },
    { key: 'shake', label: t('shakeStop'), icon: '📱' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Tijd Instelling */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('alarmTime')}</Text>
          <View style={styles.timeContainer}>
            <TextInput
              style={styles.timeInput}
              value={hours}
              onChangeText={setHours}
              placeholder="07"
              maxLength={2}
              keyboardType="numeric"
            />
            <Text style={styles.timeSeparator}>:</Text>
            <TextInput
              style={styles.timeInput}
              value={minutes}
              onChangeText={setMinutes}
              placeholder="30"
              maxLength={2}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Dagen Selectie */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('alarmDays')}</Text>
          <View style={styles.daysContainer}>
            {dayLabels.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dayButton, days[index] && styles.dayButtonActive]}
                onPress={() => toggleDay(index)}
              >
                <Text style={[styles.dayText, days[index] && styles.dayTextActive]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Volume Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('volumeType')}</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setVolumeType('gradual')}
            >
              <Text style={styles.radioIcon}>
                {volumeType === 'gradual' ? '●' : '○'}
              </Text>
              <Text style={styles.radioText}>{t('gradualVolume')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setVolumeType('full')}
            >
              <Text style={styles.radioIcon}>
                {volumeType === 'full' ? '●' : '○'}
              </Text>
              <Text style={styles.radioText}>{t('fullVolume')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stop Methode */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('stopMethod')}</Text>
          <View style={styles.stopMethodContainer}>
            {stopMethodOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.stopMethodButton,
                  stopMethod === option.key && styles.stopMethodButtonActive
                ]}
                onPress={() => setStopMethod(option.key)}
              >
                <Text style={styles.stopMethodIcon}>{option.icon}</Text>
                <Text style={[
                  styles.stopMethodText,
                  stopMethod === option.key && styles.stopMethodTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {stopMethod === 'barcode' && (
            <View style={styles.barcodeSection}>
              <Text style={styles.barcodeLabel}>Barcode Data:</Text>
              <TextInput
                style={styles.barcodeInput}
                value={barcodeData}
                onChangeText={setBarcodeData}
                placeholder="Voer barcode in of scan..."
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => alert('Barcode scanner - komt binnenkort!')}
              >
                <Text style={styles.scanButtonText}>📷 Scan Barcode</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Wekker Tekst */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('alarmText')}</Text>
          <TextInput
            style={styles.textInput}
            value={alarmText}
            onChangeText={setAlarmText}
            placeholder="Optionele wekker tekst..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            multiline
          />
        </View>

        {/* Geluid Selectie */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('alarmSound')}</Text>
          <TouchableOpacity 
            style={styles.soundButton}
            onPress={() => alert('Geluid selectie - komt binnenkort!')}
          >
            <Text style={styles.soundIcon}>🎵</Text>
            <Text style={styles.soundText}>Standaard wekker geluid</Text>
            <Text style={styles.soundArrow}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveAlarm}>
          <Text style={styles.saveButtonText}>Wekker Opslaan</Text>
        </TouchableOpacity>

      </ScrollView>
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
  section: {
    marginBottom: 25,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 20,
    borderRadius: 12,
  },
  timeInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 80,
    color: '#6200ee',
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: 'white',
  },
  dayText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dayTextActive: {
    color: '#6200ee',
  },
  radioGroup: {
    gap: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioIcon: {
    color: 'white',
    fontSize: 20,
    marginRight: 10,
  },
  radioText: {
    color: 'white',
    fontSize: 16,
  },
  stopMethodContainer: {
    gap: 10,
  },
  stopMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 12,
  },
  stopMethodButtonActive: {
    backgroundColor: 'white',
  },
  stopMethodIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  stopMethodText: {
    color: 'white',
    fontSize: 16,
  },
  stopMethodTextActive: {
    color: '#6200ee',
  },
  barcodeSection: {
    marginTop: 15,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  barcodeLabel: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
  },
  barcodeInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
  },
  scanButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 15,
    color: 'white',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  soundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 12,
  },
  soundIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  soundText: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  soundArrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#6200ee',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
