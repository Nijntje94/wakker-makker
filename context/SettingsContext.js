import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    use24HourFormat: true,
    alarmSnoozeMinutes: 5,
    reminderSnoozeMinutes: 5,
    language: 'nl', // 'nl' of 'en'
  });

  const [isLoaded, setIsLoaded] = useState(true); // Voor web altijd true

  // Voor web gebruik localStorage in plaats van AsyncStorage
  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveSettings();
    }
  }, [settings, isLoaded]);

  const loadSettings = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedSettings = localStorage.getItem('wakker_makker_settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      }
    } catch (error) {
      console.error('Fout bij laden instellingen:', error);
    }
  };

  const saveSettings = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('wakker_makker_settings', JSON.stringify(settings));
      }
    } catch (error) {
      console.error('Fout bij opslaan instellingen:', error);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Tekst vertalingen
  const translations = {
    nl: {
      // Algemeen
      settings: 'Instellingen',
      alarms: 'Wekkers',
      reminders: 'Reminders',
      cancel: 'Annuleren',
      save: 'Opslaan',
      delete: 'Verwijderen',
      edit: 'Bewerken',
      stop: 'Stop',
      snooze: 'Sluimeren',
      tomorrow: 'Morgen',
      
      // Dagen
      monday: 'Maandag',
      tuesday: 'Dinsdag', 
      wednesday: 'Woensdag',
      thursday: 'Donderdag',
      friday: 'Vrijdag',
      saturday: 'Zaterdag',
      sunday: 'Zondag',
      
      // Kort
      mon: 'Ma',
      tue: 'Di',
      wed: 'Wo',
      thu: 'Do',
      fri: 'Vr',
      sat: 'Za',
      sun: 'Zo',
      
      // Instellingen
      timeFormat: 'Tijdformaat',
      alarmSnooze: 'Wekker sluimertijd',
      reminderSnooze: 'Reminder sluimertijd',
      language: 'Taal',
      minutes: 'minuten',
      
      // Wekker
      newAlarm: 'Nieuwe Wekker',
      alarmTime: 'Wekker Tijd',
      alarmDays: 'Dagen',
      alarmSound: 'Geluid',
      volumeType: 'Volume Type',
      gradualVolume: 'Geleidelijk harder',
      fullVolume: 'Vol volume',
      alarmText: 'Wekker Tekst',
      stopMethod: 'Stop Methode',
      normalStop: 'Normaal',
      barcodeStop: 'Barcode',
      mathStop: 'Rekensom',
      shakeStop: 'Schudden',
      
      // Reminder  
      newReminder: 'Nieuwe Reminder',
      reminderTitle: 'Titel',
      reminderDescription: 'Beschrijving',
      reminderDate: 'Datum',
      reminderTime: 'Tijd',
      reminderSound: 'Geluid',
    },
    en: {
      // General
      settings: 'Settings',
      alarms: 'Alarms',
      reminders: 'Reminders',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      stop: 'Stop',
      snooze: 'Snooze',
      tomorrow: 'Tomorrow',
      
      // Days
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday', 
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      
      // Short
      mon: 'Mon',
      tue: 'Tue', 
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      sun: 'Sun',
      
      // Settings
      timeFormat: 'Time Format',
      alarmSnooze: 'Alarm Snooze Time',
      reminderSnooze: 'Reminder Snooze Time',
      language: 'Language',
      minutes: 'minutes',
      
      // Alarm
      newAlarm: 'New Alarm',
      alarmTime: 'Alarm Time',
      alarmDays: 'Days',
      alarmSound: 'Sound',
      volumeType: 'Volume Type',
      gradualVolume: 'Gradual Volume',
      fullVolume: 'Full Volume',
      alarmText: 'Alarm Text',
      stopMethod: 'Stop Method',
      normalStop: 'Normal',
      barcodeStop: 'Barcode',
      mathStop: 'Math Problem',
      shakeStop: 'Shake',
      
      // Reminder
      newReminder: 'New Reminder',
      reminderTitle: 'Title',
      reminderDescription: 'Description', 
      reminderDate: 'Date',
      reminderTime: 'Time',
      reminderSound: 'Sound',
    }
  };

  const t = (key) => {
    return translations[settings.language]?.[key] || key;
  };

  const formatTime = (date) => {
    if (settings.use24HourFormat) {
      return date.toLocaleTimeString('nl-NL', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
  };

  const value = {
    settings,
    updateSetting,
    t, // translation function
    formatTime,
    isLoaded,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
