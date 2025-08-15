import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import CreateAlarmScreen from './screens/CreateAlarmScreen';
import CreateReminderScreen from './screens/CreateReminderScreen';
import AlarmRingingScreen from './screens/AlarmRingingScreen';
import ReminderNotificationScreen from './screens/ReminderNotificationScreen';
import EditAlarmScreen from './screens/EditAlarmScreen';
import EditReminderScreen from './screens/EditReminderScreen';

import { SettingsProvider } from './context/SettingsContext';
import { AlarmsProvider } from './context/AlarmsContext';
import { RemindersProvider } from './context/RemindersContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SettingsProvider>
      <AlarmsProvider>
        <RemindersProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator 
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#6200ee',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: 'Wakker-Makker' }}
              />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen} 
                options={{ title: 'Instellingen' }}
              />
              <Stack.Screen 
                name="CreateAlarm" 
                component={CreateAlarmScreen} 
                options={{ title: 'Nieuwe Wekker' }}
              />
              <Stack.Screen 
                name="CreateReminder" 
                component={CreateReminderScreen} 
                options={{ title: 'Nieuwe Reminder' }}
              />
              <Stack.Screen 
                name="EditAlarm" 
                component={EditAlarmScreen} 
                options={{ title: 'Wekker Bewerken' }}
              />
              <Stack.Screen 
                name="EditReminder" 
                component={EditReminderScreen} 
                options={{ title: 'Reminder Bewerken' }}
              />
              <Stack.Screen 
                name="AlarmRinging" 
                component={AlarmRingingScreen} 
                options={{ 
                  title: 'Wekker',
                  headerShown: false,
                }}
              />
              <Stack.Screen 
                name="ReminderNotification" 
                component={ReminderNotificationScreen} 
                options={{ 
                  title: 'Reminder',
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </RemindersProvider>
      </AlarmsProvider>
    </SettingsProvider>
  );
}
