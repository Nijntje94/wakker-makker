import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';

import { useSettings } from '../context/SettingsContext';
import musicService from '../services/MusicService';

const { width, height } = Dimensions.get('window');

export default function AlarmRingingScreen({ route, navigation }) {
  const { alarmId, alarm } = route.params || {};
  const { settings, t } = useSettings();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [stopMethod, setStopMethod] = useState(alarm?.stopMethod || 'normal');
  const [mathProblem, setMathProblem] = useState(null);
  const [mathAnswer, setMathAnswer] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [shakeProgress, setShakeProgress] = useState(0);
  const [emergencyClicks, setEmergencyClicks] = useState(0);
  const [emergencyTimer, setEmergencyTimer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Start muziek afspelen
    startAlarmSound();

    // Initialize stop method
    initializeStopMethod();

    return () => {
      clearInterval(timer);
      stopAlarmSound();
      if (emergencyTimer) clearTimeout(emergencyTimer);
    };
  }, []);

  const startAlarmSound = async () => {
    try {
      const soundUri = alarm?.sound?.uri || 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
      const volumeType = alarm?.volumeType || 'gradual';
      
      console.log('Speel wekker geluid af:', soundUri);
      const success = await musicService.playAlarmSound(soundUri, volumeType);
      
      if (success) {
        setIsPlaying(true);
      } else {
        console.error('Kon wekker geluid niet afspelen');
      }
    } catch (error) {
      console.error('Fout bij afspelen wekker geluid:', error);
    }
  };

  const stopAlarmSound = async () => {
    try {
      await musicService.stopAlarmSound();
      setIsPlaying(false);
    } catch (error) {
      console.error('Fout bij stoppen geluid:', error);
    }
  };

  const initializeStopMethod = () => {
    if (stopMethod === 'math') {
      generateMathProblem();
    } else if (stopMethod === 'shake') {
      startShakeDetection();
    }
  };

  const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 100) + 1;
    const num2 = Math.floor(Math.random() * 100) + 1;
    const operation = Math.random() > 0.5 ? '+' : '-';
    
    let problem, answer;
    if (operation === '+') {
      problem = `${num1} + ${num2}`;
      answer = num1 + num2;
    } else {
      // Voor aftrekken, zorg dat resultaat niet negatief is
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      problem = `${larger} - ${smaller}`;
      answer = larger - smaller;
    }
    
    setMathProblem({ problem, answer });
    setMathAnswer('');
  };

  const checkMathAnswer = () => {
    const userAnswer = parseInt(mathAnswer);
    if (userAnswer === mathProblem.answer) {
      stopAlarm();
    } else {
      alert('Fout antwoord! Probeer opnieuw.');
      generateMathProblem();
    }
  };

  const skipMathProblem = () => {
    generateMathProblem();
  };

  const startShakeDetection = () => {
    // Voor web simuleren we shake met een timer
    alert('Schud functie: Op web simuleren we dit. Klik "Schudden Simuleren" om door te gaan.');
  };

  const simulateShake = () => {
    setIsShaking(true);
    setShakeProgress(0);
    
    const shakeInterval = setInterval(() => {
      setShakeProgress(prev => {
        const newProgress = prev + 20; // 20% per seconde voor 5 seconden
        if (newProgress >= 100) {
          clearInterval(shakeInterval);
          setIsShaking(false);
          stopAlarm();
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const handleBarcodeInput = (input) => {
    if (input === alarm?.barcodeData) {
      stopAlarm();
    } else {
      alert('Verkeerde barcode! Probeer opnieuw.');
    }
  };

  const handleEmergencyClick = () => {
    setEmergencyClicks(prev => prev + 1);
    
    if (emergencyClicks === 0) {
      // Start emergency timer - reset after 10 seconds
      setEmergencyTimer(setTimeout(() => {
        setEmergencyClicks(0);
      }, 10000));
    }
    
    if (emergencyClicks >= 14) { // 15 clicks total
      Alert.alert(
        'Noodstop',
        'Wekker gestopt via noodmethode',
        [{ text: 'OK', onPress: stopAlarm }]
      );
    }
  };

  const stopAlarm = async () => {
    await stopAlarmSound();
    navigation.goBack();
  };

  const snoozeAlarm = async () => {
    await stopAlarmSound();
    alert(`Sluimer voor ${settings.alarmSnoozeMinutes} minuten!`);
    // TODO: Schedule snooze notification
    navigation.goBack();
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

  const renderStopInterface = () => {
    switch (stopMethod) {
      case 'barcode':
        return (
          <View style={styles.barcodeContainer}>
            <Text style={styles.barcodeIcon}>📷</Text>
            <Text style={styles.barcodeText}>Voer de juiste barcode in:</Text>
            <TextInput
              style={styles.barcodeInput}
              placeholder="Barcode..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              onSubmitEditing={(e) => handleBarcodeInput(e.nativeEvent.text)}
              autoFocus
            />
            <Text style={styles.barcodeHint}>
              Verwacht: {alarm?.barcodeData || 'Geen barcode ingesteld'}
            </Text>
          </View>
        );

      case 'math':
        if (!mathProblem) return null;
        return (
          <View style={styles.mathContainer}>
            <Text style={styles.mathProblem}>{mathProblem.problem} = ?</Text>
            <TextInput
              style={styles.mathInput}
              value={mathAnswer}
              onChangeText={setMathAnswer}
              keyboardType="numeric"
              placeholder="Antwoord"
              placeholderTextColor="rgba(255,255,255,0.5)"
              autoFocus
            />
            <View style={styles.mathButtons}>
              <TouchableOpacity style={styles.mathButton} onPress={checkMathAnswer}>
                <Text style={styles.mathButtonText}>Controleer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.skipButton} onPress={skipMathProblem}>
                <Text style={styles.skipButtonText}>Volgende som</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'shake':
        return (
          <View style={styles.shakeContainer}>
            <Text style={styles.shakeIcon}>📱</Text>
            <Text style={styles.shakeText}>Schud je telefoon 5 seconden</Text>
            {isShaking && (
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${shakeProgress}%` }]} />
              </View>
            )}
            <Text style={styles.shakeProgress}>{Math.round(shakeProgress)}%</Text>
            
            {/* Voor web: simulatie knop */}
            <TouchableOpacity style={styles.simulateButton} onPress={simulateShake}>
              <Text style={styles.simulateButtonText}>Schudden Simuleren (Web)</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return (
          <TouchableOpacity style={styles.stopButton} onPress={stopAlarm}>
            <Text style={styles.stopIcon}>⏹️</Text>
            <Text style={styles.stopButtonText}>{t('stop')}</Text>
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🚨 WEKKER</Text>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
        {alarm?.text && (
          <Text style={styles.alarmText}>{alarm.text}</Text>
        )}
        {alarm?.sound && (
          <Text style={styles.soundInfo}>
            🎵 {alarm.sound.name}
            {isPlaying && <Text style={styles.playingIndicator}> (Speelt af...)</Text>}
          </Text>
        )}
      </View>

      <View style={styles.stopSection}>
        {renderStopInterface()}
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.snoozeButton} onPress={snoozeAlarm}>
          <Text style={styles.snoozeIcon}>😴</Text>
          <Text style={styles.snoozeText}>
            {t('snooze')} ({settings.alarmSnoozeMinutes} min)
          </Text>
        </TouchableOpacity>

        {/* Emergency stop (hidden) */}
        <TouchableOpacity
          style={styles.emergencyZone}
          onPress={handleEmergencyClick}
        >
          <Text style={styles.emergencyText}>
            {emergencyClicks > 0 && `${15 - emergencyClicks} keer meer voor noodstop`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff6b6b',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  alarmText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 10,
    textAlign: 'center',
  },
  soundInfo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
    textAlign: 'center',
  },
  playingIndicator: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  stopSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  stopButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 30,
    borderRadius: 20,
  },
  stopIcon: {
    fontSize: 64,
    marginBottom: 10,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  barcodeContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 30,
    borderRadius: 20,
    width: '100%',
  },
  barcodeIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  barcodeText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  barcodeInput: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    padding: 15,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    width: '100%',
    marginBottom: 10,
  },
  barcodeHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textAlign: 'center',
  },
  mathContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 30,
    borderRadius: 20,
    width: '100%',
  },
  mathProblem: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  mathInput: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    padding: 15,
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    width: 150,
    marginBottom: 20,
  },
  mathButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  mathButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  mathButtonText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  skipButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  shakeContainer: {
    alignItems: 'center',
  },
  shakeIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  shakeText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
  },
  progressContainer: {
    width: 200,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  shakeProgress: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  simulateButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  simulateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomSection: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  snoozeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
  },
  snoozeIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  snoozeText: {
    color: 'white',
    fontSize: 16,
  },
  emergencyZone: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    textAlign: 'center',
  },
});
