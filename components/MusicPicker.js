import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';

import musicService from '../services/MusicService';

export default function MusicPicker({ 
  visible, 
  onClose, 
  onSelectSound, 
  selectedSoundId = null 
}) {
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  useEffect(() => {
    if (visible) {
      loadSounds();
      musicService.initialize();
    }
    return () => {
      musicService.stopPreview();
    };
  }, [visible]);

  const loadSounds = async () => {
    setLoading(true);
    try {
      const allSounds = await musicService.getAllSounds();
      setSounds(allSounds);
    } catch (error) {
      console.error('Fout bij laden geluiden:', error);
      Alert.alert('Fout', 'Kon geluiden niet laden');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPreview = async (sound) => {
    try {
      if (playingId === sound.id) {
        // Stop als hetzelfde geluid al speelt
        await musicService.stopPreview();
        setPlayingId(null);
      } else {
        // Speel nieuw geluid
        const success = await musicService.playPreview(sound.uri);
        if (success) {
          setPlayingId(sound.id);
          // Stop automatisch na 10 seconden
          setTimeout(() => {
            setPlayingId(null);
          }, 10000);
        } else {
          Alert.alert('Fout', 'Kon geluid niet afspelen');
        }
      }
    } catch (error) {
      console.error('Fout bij afspelen:', error);
      Alert.alert('Fout', 'Kon geluid niet afspelen');
    }
  };

  const handleSelectSound = async (sound) => {
    await musicService.stopPreview();
    setPlayingId(null);
    onSelectSound(sound);
    onClose();
  };

  const handlePickCustomFile = async () => {
    setLoadingPermissions(true);
    try {
      const customSound = await musicService.pickAudioFile();
      if (customSound) {
        setSounds(prev => [...prev, customSound]);
        Alert.alert('Succes', 'Audiobestand toegevoegd!');
      }
    } catch (error) {
      console.error('Fout bij kiezen bestand:', error);
      Alert.alert('Fout', 'Kon bestand niet toevoegen');
    } finally {
      setLoadingPermissions(false);
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return '';
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSoundIcon = (type) => {
    switch (type) {
      case 'default': return '🔔';
      case 'local': return '🎵';
      case 'custom': return '📁';
      default: return '🎶';
    }
  };

  const renderSoundItem = ({ item }) => (
    <View style={styles.soundItem}>
      <TouchableOpacity
        style={[
          styles.soundButton,
          selectedSoundId === item.id && styles.selectedSound
        ]}
        onPress={() => handleSelectSound(item)}
      >
        <View style={styles.soundInfo}>
          <Text style={styles.soundIcon}>{getSoundIcon(item.type)}</Text>
          <View style={styles.soundDetails}>
            <Text style={styles.soundName}>{item.name}</Text>
            <Text style={styles.soundMeta}>
              {item.artist} {item.duration ? `• ${formatDuration(item.duration)}` : ''}
            </Text>
          </View>
        </View>
        
        {selectedSoundId === item.id && (
          <Text style={styles.selectedIcon}>✓</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.playButton}
        onPress={() => handlePlayPreview(item)}
      >
        <Text style={styles.playIcon}>
          {playingId === item.id ? '⏸️' : '▶️'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Kies Geluid</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.customButton}
        onPress={handlePickCustomFile}
        disabled={loadingPermissions}
      >
        {loadingPermissions ? (
          <ActivityIndicator size="small" color="#6200ee" />
        ) : (
          <>
            <Text style={styles.customIcon}>📁</Text>
            <Text style={styles.customText}>Kies Eigen Bestand</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {renderHeader()}
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text style={styles.loadingText}>Laden van geluiden...</Text>
          </View>
        ) : (
          <FlatList
            data={sounds}
            keyExtractor={(item) => item.id}
            renderItem={renderSoundItem}
            style={styles.soundsList}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🎵</Text>
                <Text style={styles.emptyText}>Geen geluiden gevonden</Text>
                <Text style={styles.emptySubtext}>
                  Probeer een eigen bestand te kiezen
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#6200ee',
    paddingTop: 60, // Voor status bar
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 5,
  },
  closeIcon: {
    fontSize: 20,
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  soundsList: {
    flex: 1,
    padding: 15,
  },
  soundItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  soundButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  selectedSound: {
    backgroundColor: '#e3f2fd',
  },
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  soundIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  soundDetails: {
    flex: 1,
  },
  soundName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  soundMeta: {
    fontSize: 14,
    color: '#666',
  },
  selectedIcon: {
    fontSize: 20,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  playButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    backgroundColor: '#f0f0f0',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  playIcon: {
    fontSize: 20,
  },
  footer: {
    padding: 15,
    marginTop: 10,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6200ee',
    borderStyle: 'dashed',
  },
  customIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  customText: {
    fontSize: 16,
    color: '#6200ee',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
