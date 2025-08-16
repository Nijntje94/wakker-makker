import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

class MusicService {
  constructor() {
    this.currentSound = null;
    this.isPlaying = false;
    this.defaultSounds = [
      {
        id: 'default-1',
        name: 'Klassieke Wekker',
        uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        type: 'default',
        duration: 3000
      },
      {
        id: 'default-2', 
        name: 'Vrolijke Bel',
        uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav',
        type: 'default',
        duration: 2000
      },
      {
        id: 'default-3',
        name: 'Rustige Toon',
        uri: 'https://www.soundjay.com/misc/sounds/chime-01.wav',
        type: 'default',
        duration: 4000
      }
    ];
  }

  // Initialiseer audio systeem
  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false
      });
    } catch (error) {
      console.error('Fout bij audio initialisatie:', error);
    }
  }

  // Vraag permissies voor media bibliotheek
  async requestPermissions() {
    try {
      if (typeof MediaLibrary.requestPermissionsAsync === 'function') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        return status === 'granted';
      }
      return false; // Voor web
    } catch (error) {
      console.error('Fout bij vragen permissies:', error);
      return false;
    }
  }

  // Haal lokale muziek op
  async getLocalMusic() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('Geen toegang tot media bibliotheek');
        return [];
      }

      if (typeof MediaLibrary.getAssetsAsync === 'function') {
        const media = await MediaLibrary.getAssetsAsync({
          mediaType: 'audio',
          first: 100, // Eerste 100 nummers
          sortBy: [[MediaLibrary.SortBy.creationTime, false]]
        });

        return media.assets.map(asset => ({
          id: asset.id,
          name: asset.filename.replace(/\.[^/.]+$/, ""), // Verwijder extensie
          artist: asset.albumId || 'Onbekende Artiest',
          uri: asset.uri,
          duration: asset.duration * 1000, // Converteer naar milliseconden
          type: 'local'
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Fout bij ophalen lokale muziek:', error);
      return [];
    }
  }

  // Kies bestand handmatig
  async pickAudioFile() {
    try {
      if (typeof DocumentPicker.getDocumentAsync === 'function') {
        const result = await DocumentPicker.getDocumentAsync({
          type: 'audio/*',
          copyToCacheDirectory: true
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
          const file = result.assets[0];
          return {
            id: 'custom-' + Date.now(),
            name: file.name.replace(/\.[^/.]+$/, ""),
            artist: 'Gekozen Bestand',
            uri: file.uri,
            duration: 0, // Onbekend
            type: 'custom'
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Fout bij kiezen bestand:', error);
      return null;
    }
  }

  // Verkrijg alle beschikbare geluiden
  async getAllSounds() {
    const localMusic = await this.getLocalMusic();
    return [
      ...this.defaultSounds,
      ...localMusic
    ];
  }

  // Speel preview van geluid af
  async playPreview(soundUri, volume = 0.5) {
    try {
      // Stop huidige geluid
      await this.stopPreview();

      // Laad nieuw geluid
      const { sound } = await Audio.Sound.createAsync(
        { uri: soundUri },
        { 
          shouldPlay: true,
          volume: volume,
          isLooping: false
        }
      );

      this.currentSound = sound;
      this.isPlaying = true;

      // Stop automatisch na 10 seconden
      setTimeout(() => {
        this.stopPreview();
      }, 10000);

      return true;
    } catch (error) {
      console.error('Fout bij afspelen preview:', error);
      return false;
    }
  }

  // Stop preview
  async stopPreview() {
    try {
      if (this.currentSound) {
        await this.currentSound.unloadAsync();
        this.currentSound = null;
        this.isPlaying = false;
      }
    } catch (error) {
      console.error('Fout bij stoppen preview:', error);
    }
  }

  // Speel wekker geluid af (voor echte wekker)
  async playAlarmSound(soundUri, volumeType = 'gradual') {
    try {
      await this.stopPreview();

      const { sound } = await Audio.Sound.createAsync(
        { uri: soundUri },
        { 
          shouldPlay: true,
          volume: volumeType === 'gradual' ? 0.1 : 1.0,
          isLooping: true
        }
      );

      this.currentSound = sound;
      this.isPlaying = true;

      // Geleidelijk volume verhogen
      if (volumeType === 'gradual') {
        this.gradualVolumeIncrease();
      }

      return sound;
    } catch (error) {
      console.error('Fout bij afspelen wekker geluid:', error);
      return null;
    }
  }

  // Geleidelijk volume verhogen
  async gradualVolumeIncrease() {
    if (!this.currentSound || !this.isPlaying) return;

    let currentVolume = 0.1;
    const volumeStep = 0.1;
    const intervalTime = 2000; // 2 seconden

    const increaseInterval = setInterval(async () => {
      if (!this.currentSound || !this.isPlaying) {
        clearInterval(increaseInterval);
        return;
      }

      currentVolume = Math.min(currentVolume + volumeStep, 1.0);
      
      try {
        await this.currentSound.setVolumeAsync(currentVolume);
      } catch (error) {
        clearInterval(increaseInterval);
      }

      if (currentVolume >= 1.0) {
        clearInterval(increaseInterval);
      }
    }, intervalTime);
  }

  // Stop wekker geluid
  async stopAlarmSound() {
    return await this.stopPreview();
  }

  // Check of er geluid aan het spelen is
  getPlayingStatus() {
    return {
      isPlaying: this.isPlaying,
      hasSound: this.currentSound !== null
    };
  }

  // Cleanup
  async cleanup() {
    await this.stopPreview();
  }
}

// Singleton instance
const musicService = new MusicService();

export default musicService;
