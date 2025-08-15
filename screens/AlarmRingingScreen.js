import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AlarmRingingScreen({ navigation }) {
  const stopAlarm = () => {
    navigation.goBack();
  };

  const snoozeAlarm = () => {
    alert('Sluimer voor 5 minuten!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚨 WEKKER</Text>
      <Text style={styles.time}>07:30</Text>
      <Text style={styles.text}>Opstaan voor werk!</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.snoozeButton} onPress={snoozeAlarm}>
          <Text style={styles.snoozeText}>😴 Sluimeren</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.stopButton} onPress={stopAlarm}>
          <Text style={styles.stopText}>⏹️ Stop</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subtitle}>Demo - Wekker functionaliteit</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  time: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  snoozeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
  },
  snoozeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  stopText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 30,
  },
});
