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

  // Initialiseer audio systeem (voor web een simpele implementatie)
  async initialize() {
    try {
      if (typeof Audio !== 'undefined' && Audio.setAudioModeAsync) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false
        });
      }
    } catch (error) {
      console.log('Audio not available on this platform');
    }
  }

  // Voor web - gebruik gewoon de default sounds
  async getLocalMusic() {
    return []; // Web heeft geen toegang tot lokale muziek
  }

  // Voor web - simpele file picker
  async pickAudioFile() {
    try {
      // Maak een file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'audio/*';
      
      return new Promise((resolve) => {
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const url = URL.createObjectURL(file);
            resolve({
              id: 'custom-' + Date.now(),
              name: file.name.replace(/\.[^/.]+$/, ""),
              artist: 'Gekozen Bestand',
              uri: url,
              duration: 0,
              type: 'custom'
            });
          } else {
            resolve(null);
          }
        };
        input.click();
      });
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

  // Speel preview af (web versie)
  async playPreview(soundUri, volume = 0.5) {
    try {
      await this.stopPreview();

      // Voor web gebruik HTML5 Audio
      const audio = new Audio(soundUri);
      audio.volume = volume;
      audio.currentTime = 0;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        this.currentSound = audio;
        this.isPlaying = true;
        
        // Stop na 10 seconden
        setTimeout(() => {
          this.stopPreview();
        }, 10000);
      }
      
      return true;
    } catch (error) {
      console.error('Fout bij afspelen:', error);
      return false;
    }
  }

  // Stop preview
  async stopPreview() {
    try {
      if (this.currentSound) {
        this.currentSound.pause();
        this.currentSound.currentTime = 0;
        this.currentSound = null;
        this.isPlaying = false;
      }
    } catch (error) {
      console.error('Fout bij stoppen:', error);
    }
  }

  // Voor wekker geluid (zelfde als preview voor web)
  async playAlarmSound(soundUri, volumeType = 'gradual') {
    return await this.playPreview(soundUri, volumeType === 'full' ? 1.0 : 0.5);
  }

  async stopAlarmSound() {
    return await this.stopPreview();
  }

  getPlayingStatus() {
    return {
      isPlaying: this.isPlaying,
      hasSound: this.currentSound !== null
    };
  }

  async cleanup() {
    await this.stopPreview();
  }
}

// Singleton instance
const musicService = new MusicService();

export default musicService;
