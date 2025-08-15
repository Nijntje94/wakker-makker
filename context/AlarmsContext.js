import React, { createContext, useContext, useState, useEffect } from 'react';

const AlarmsContext = createContext();

export const useAlarms = () => {
  const context = useContext(AlarmsContext);
  if (!context) {
    throw new Error('useAlarms must be used within an AlarmsProvider');
  }
  return context;
};

export const AlarmsProvider = ({ children }) => {
  const [alarms, setAlarms] = useState([
    // Demo data
    {
      id: '1',
      time: '07:30',
      days: [true, true, true, true, true, false, false],
      text: 'Opstaan voor werk!',
      isEnabled: true,
      stopMethod: 'normal',
      volumeType: 'gradual'
    },
    {
      id: '2',
      time: '09:00',
      days: [false, false, false, false, false, true, true],
      text: 'Weekend ontbijt',
      isEnabled: false,
      stopMethod: 'math',
      volumeType: 'full'
    }
  ]);
  
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    loadAlarms();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveAlarms();
    }
  }, [alarms, isLoaded]);

  const loadAlarms = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedAlarms = localStorage.getItem('wakker_makker_alarms');
        if (savedAlarms) {
          setAlarms(JSON.parse(savedAlarms));
        }
      }
    } catch (error) {
      console.error('Fout bij laden wekkers:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveAlarms = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('wakker_makker_alarms', JSON.stringify(alarms));
      }
    } catch (error) {
      console.error('Fout bij opslaan wekkers:', error);
    }
  };

  const addAlarm = (alarmData) => {
    const newAlarm = {
      id: Date.now().toString(),
      ...alarmData,
      isEnabled: true,
      createdAt: new Date().toISOString(),
    };
    
    setAlarms(prev => [...prev, newAlarm]);
    return newAlarm.id;
  };

  const updateAlarm = (id, updates) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id ? { ...alarm, ...updates } : alarm
      )
    );
  };

  const deleteAlarm = (id) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const toggleAlarm = (id) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id ? { ...alarm, isEnabled: !alarm.isEnabled } : alarm
      )
    );
  };

  const getNextAlarmTime = (alarm) => {
    if (!alarm.isEnabled) return null;
    
    const now = new Date();
    let nextAlarm = null;
    let minDaysUntil = Infinity;
    
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      if (alarm.days[dayIndex]) {
        const alarmDate = new Date();
        const [hours, minutes] = alarm.time.split(':').map(Number);
        alarmDate.setHours(hours, minutes, 0, 0);
        
        const currentDay = now.getDay();
        const targetDay = dayIndex === 6 ? 0 : dayIndex + 1;
        
        let daysUntilAlarm = targetDay - currentDay;
        if (daysUntilAlarm < 0) {
          daysUntilAlarm += 7;
        }
        
        if (daysUntilAlarm === 0 && alarmDate <= now) {
          daysUntilAlarm = 7;
        }
        
        if (daysUntilAlarm < minDaysUntil) {
          minDaysUntil = daysUntilAlarm;
          alarmDate.setDate(now.getDate() + daysUntilAlarm);
          nextAlarm = alarmDate;
        }
      }
    }
    
    return nextAlarm;
  };

  const value = {
    alarms,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    getNextAlarmTime,
    isLoaded,
  };

  return (
    <AlarmsContext.Provider value={value}>
      {children}
    </AlarmsContext.Provider>
  );
};
