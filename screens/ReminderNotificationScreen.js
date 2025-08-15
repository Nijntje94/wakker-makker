import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ReminderNotificationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Reminder</Text>
      <Text style={styles.subtitle}>Reminder notificatie scherm - Coming Soon!</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Terug</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
