import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { useSettings } from '../context/SettingsContext';

export default function SettingsScreen() {
  const { settings, updateSetting, t } = useSettings();

  const toggleTimeFormat = () => {
    updateSetting('use24HourFormat', !settings.use24HourFormat);
  };

  const toggleLanguage = () => {
    updateSetting('language', settings.language === 'nl' ? 'en' : 'nl');
  };

  const openGitHub = () => {
    if (typeof window !== 'undefined') {
      window.open('https://github.com/Nijntje94/wakker-makker', '_blank');
    }
  };

  const openBuyMeACoffee = () => {
    if (typeof window !== 'undefined') {
      window.open('https://buymeacoffee.com/nijntje94', '_blank');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        
        {/* Tijdformaat Instellingen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tijd & Weergave</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={toggleTimeFormat}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🕐</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('timeFormat')}</Text>
                <Text style={styles.settingSubtitle}>
                  {settings.use24HourFormat ? '24 uur formaat' : '12 uur formaat'}
                </Text>
              </View>
            </View>
            <Text style={styles.arrow}>▶</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={toggleLanguage}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌍</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('language')}</Text>
                <Text style={styles.settingSubtitle}>
                  {settings.language === 'nl' ? 'Nederlands' : 'English'}
                </Text>
              </View>
            </View>
            <Text style={styles.arrow}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Sluimer Instellingen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sluimer Instellingen</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>⏰</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('alarmSnooze')}</Text>
                <Text style={styles.settingSubtitle}>
                  {settings.alarmSnoozeMinutes} {t('minutes')}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('reminderSnooze')}</Text>
                <Text style={styles.settingSubtitle}>
                  {settings.reminderSnoozeMinutes} {t('minutes')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Over de App */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Over Wakker-Makker</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>ℹ️</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Versie</Text>
                <Text style={styles.settingSubtitle}>1.0.0</Text>
              </View>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🛡️</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Licentie</Text>
                <Text style={styles.settingSubtitle}>AGPLv3 - Open Source</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={openGitHub}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>💻</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>GitHub</Text>
                <Text style={styles.settingSubtitle}>Bekijk de broncode</Text>
              </View>
            </View>
            <Text style={styles.arrow}>🔗</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={openBuyMeACoffee}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>☕</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Steun de Ontwikkeling</Text>
                <Text style={styles.settingSubtitle}>Buy me a coffee</Text>
              </View>
            </View>
            <Text style={styles.arrow}>🔗</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Gemaakt met ❤️ voor betere ochtenden
          </Text>
        </View>

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
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    marginLeft: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 15,
    marginBottom: 2,
    borderRadius: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  settingSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 2,
  },
  arrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 20,
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
  },
});
