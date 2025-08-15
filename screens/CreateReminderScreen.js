import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import { useSettings } from '../context/SettingsContext';
import { useReminders } from '../context/RemindersContext';

export default function CreateReminderScreen({ navigation }) {
  const { t } = useSettings();
  const { addReminder } = useReminders();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2025-08-17');
  const [hours, setHours] = useState('14');
  const [minutes, setMinutes] = useState('30');
  const [volumeType, setVolumeType] = useState('gradual'); // 'gradual' or 'full'

  const saveReminder = () => {
    // Validaties
    if (!title.trim()) {
      alert('Voer een titel in voor de reminder.');
      return;
    }

    // Check date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      alert('Voer een geldige datum in (YYYY-MM-DD).');
      return;
    }

    // Check time
    if (parseInt(hours) < 0 || parseInt(hours) > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59) {
      alert('Voer een geldige tijd in (00:00 - 23:59).');
      return;
    }

    // Check if date/time is in the future
    const reminderDateTime = new Date(`${date}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`);
    
    if (reminderDateTime <= new Date()) {
      alert('Kies een datum en tijd in de toekomst.');
      return;
    }

    const reminderData = {
      title: title.trim(),
      description: description.trim(),
      date,
      time: `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`,
      volumeType,
      sound: 'default',
    };

    addReminder(reminderData);
    alert('Reminder opgeslagen!');
    navigation.goBack();
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('nl-NL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Ongeldige datum';
    }
  };

  const getDateSuggestions = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return [
      { label: 'Vandaag', value: today.toISOString().split('T')[0] },
      { label: 'Morgen', value: tomorrow.toISOString().split('T')[0] },
      { label: 'Volgende week', value: nextWeek.toISOString().split('T')[0] },
    ];
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Titel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('reminderTitle')}</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Reminder titel..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            maxLength={50}
          />
        </View>

        {/* Beschrijving */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('reminderDescription')}</Text>
          <TextInput
            style={[styles.textInput, styles.descriptionInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Optionele beschrijving..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            multiline
            maxLength={200}
          />
        </View>

        {/* Datum */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('reminderDate')}</Text>
          
          {/* Datum suggesties */}
          <View style={styles.dateSuggestions}>
            {getDateSuggestions().map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionButton,
                  date === suggestion.value && styles.suggestionButtonActive
                ]}
                onPress={() => setDate(suggestion.value)}
              >
                <Text style={[
                  styles.suggestionText,
                  date === suggestion.value && styles.suggestionTextActive
                ]}>
                  {suggestion.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Handmatige datum invoer */}
          <TextInput
            style={styles.textInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
          
          {/* Datum preview */}
          <Text style={styles.datePreview}>
            📅 {formatDate(date)}
          </Text>
        </View>

        {/* Tijd */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('reminderTime')}</Text>
          <View style={styles.timeContainer}>
            <TextInput
              style={styles.timeInput}
              value={hours}
              onChangeText={setHours}
              placeholder="14"
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

        {/* Geluid Selectie */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('reminderSound')}</Text>
          <TouchableOpacity 
            style={styles.soundButton}
            onPress={() => alert('Geluid selectie - komt binnenkort!')}
          >
            <Text style={styles.soundIcon}>🔔</Text>
            <Text style={styles.soundText}>Standaard notificatie geluid</Text>
            <Text style={styles.soundArrow}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveReminder}>
          <Text style={styles.saveButtonText}>Reminder Opslaan</Text>
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
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 15,
    color: 'white',
    fontSize: 16,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateSuggestions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  suggestionButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  suggestionButtonActive: {
    backgroundColor: 'white',
  },
  suggestionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  suggestionTextActive: {
    color: '#6200ee',
  },
  datePreview: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
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
