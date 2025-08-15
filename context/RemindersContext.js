import React, { createContext, useContext, useState, useEffect } from 'react';

const RemindersContext = createContext();

export const useReminders = () => {
  const context = useContext(RemindersContext);
  if (!context) {
    throw new Error('useReminders must be used within a RemindersProvider');
  }
  return context;
};

export const RemindersProvider = ({ children }) => {
  const [reminders, setReminders] = useState([
    // Demo data
    {
      id: '1',
      title: 'Doktersafspraak',
      description: 'Vergeet niet om 15 minuten eerder te vertrekken',
      date: '2025-08-16',
      time: '14:30',
      isEnabled: true,
      volumeType: 'full'
    },
    {
      id: '2',
      title: 'Boodschappen doen',
      description: 'Melk, brood, kaas en fruit',
      date: '2025-08-17',
      time: '10:00',
      isEnabled: true,
      volumeType: 'gradual'
    }
  ]);
  
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveReminders();
    }
  }, [reminders, isLoaded]);

  const loadReminders = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedReminders = localStorage.getItem('wakker_makker_reminders');
        if (savedReminders) {
          setReminders(JSON.parse(savedReminders));
        }
      }
    } catch (error) {
      console.error('Fout bij laden reminders:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveReminders = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('wakker_makker_reminders', JSON.stringify(reminders));
      }
    } catch (error) {
      console.error('Fout bij opslaan reminders:', error);
    }
  };

  const addReminder = (reminderData) => {
    const newReminder = {
      id: Date.now().toString(),
      ...reminderData,
      isEnabled: true,
      createdAt: new Date().toISOString(),
    };
    
    setReminders(prev => [...prev, newReminder]);
    return newReminder.id;
  };

  const updateReminder = (id, updates) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id ? { ...reminder, ...updates } : reminder
      )
    );
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const toggleReminder = (id) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id ? { ...reminder, isEnabled: !reminder.isEnabled } : reminder
      )
    );
  };

  const moveToTomorrow = (id) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      const currentDate = new Date(reminder.date);
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      updateReminder(id, {
        date: tomorrow.toISOString().split('T')[0] // YYYY-MM-DD format
      });
    }
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    return reminders
      .filter(reminder => {
        if (!reminder.isEnabled) return false;
        
        const [hours, minutes] = reminder.time.split(':').map(Number);
        const reminderDateTime = new Date(reminder.date);
        reminderDateTime.setHours(hours, minutes, 0, 0);
        
        return reminderDateTime > now;
      })
      .sort((a, b) => {
        const aDate = new Date(a.date + 'T' + a.time);
        const bDate = new Date(b.date + 'T' + b.time);
        return aDate - bDate;
      });
  };

  const value = {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    moveToTomorrow,
    getUpcomingReminders,
    isLoaded,
  };

  return (
    <RemindersContext.Provider value={value}>
      {children}
    </RemindersContext.Provider>
  );
};
