import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function EditReminderScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reminder Bewerken</Text>
      <Text style={styles.subtitle}>Deze functie wordt binnenkort toegevoegd!</Text>
      
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
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
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
    color: '#6200ee',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
