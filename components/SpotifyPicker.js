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
  TextInput,
  Image,
} from 'react-native';

import spotifyService from '../services/SpotifyService';

export default function SpotifyPicker({ 
  visible, 
  onClose, 
  onSelectTrack, 
  selectedTrackId = null 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('playlists'); // 'playlists', 'liked', 'search'
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playingPreview, setPlayingPreview] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (visible) {
      initializeSpotify();
    }
    return () => {
      stopPreview();
    };
  }, [visible]);

  const initializeSpotify = async () => {
    setLoading(true);
    await spotifyService.initialize();
    
    if (spotifyService.isAuthenticated()) {
      setIsAuthenticated(true);
      await loadInitialData();
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  const loadInitialData = async () => {
    try {
      const [profile, playlistsData] = await Promise.all([
        spotifyService.getUserProfile(),
        spotifyService.getPlaylists()
      ]);
      
      setUserProfile(profile);
      setPlaylists(playlistsData);
    } catch (error) {
      console.error('Fout bij laden Spotify data:', error);
      Alert.alert('Fout', 'Kon Spotify data niet laden');
    }
  };

  const handleSpotifyLogin = () => {
    // Voor demo tonen we direct een keuze
    Alert.alert(
      'Spotify Login',
      'Voor deze demo kun je kiezen tussen echte Spotify login of demo mode.',
      [
        {
          text: 'Demo Mode',
          onPress: () => {
            simulateSuccessfulAuth();
          }
        },
        {
          text: 'Echte Spotify (vereist setup)',
          onPress: () => {
            tryRealSpotifyAuth();
          }
        },
        { text: 'Annuleren' }
      ]
    );
  };

  const tryRealSpotifyAuth = () => {
    const authUrl = spotifyService.getAuthUrl();
    
    Alert.alert(
      'Spotify Setup Vereist',
      `Om echte Spotify login te gebruiken moet je:\n\n1. Een Spotify app maken op developer.spotify.com\n2. De redirect URI toevoegen: ${spotifyService.redirectUri}\n3. De client ID vervangen in SpotifyService.js\n\nVoor nu kun je de demo mode gebruiken!`,
      [
        {
          text: 'Open Spotify Login (kan falen)',
          onPress: () => {
            if (typeof window !== 'undefined') {
              window.open(authUrl, '_blank');
            }
          }
        },
        {
          text: 'Gebruik Demo Mode',
          onPress: () => {
            simulateSuccessfulAuth();
          }
        }
      ]
    );
  };

  const simulateSuccessfulAuth = async () => {
    // Demo data voor als Spotify OAuth niet beschikbaar is
    setIsAuthenticated(true);
    setUserProfile({
      display_name: 'Demo User',
      id: 'demo_user'
    });
    
    // Uitgebreide demo playlists
    setPlaylists([
      {
        id: 'demo_playlist_1',
        name: 'Chill Morning',
        description: 'Rustige muziek voor de ochtend',
        trackCount: 25,
        imageUrl: 'https://via.placeholder.com/300x300/1DB954/ffffff?text=Chill',
        type: 'spotify_playlist'
      },
      {
        id: 'demo_playlist_2', 
        name: 'Wake Up Energy',
        description: 'Energieke nummers om wakker te worden',
        trackCount: 30,
        imageUrl: 'https://via.placeholder.com/300x300/FF6B6B/ffffff?text=Energy',
        type: 'spotify_playlist'
      },
      {
        id: 'demo_playlist_3',
        name: 'Focus Music',
        description: 'Instrumentale muziek om bij te concentreren',
        trackCount: 40,
        imageUrl: 'https://via.placeholder.com/300x300/4ECDC4/ffffff?text=Focus',
        type: 'spotify_playlist'
      },
      {
        id: 'demo_playlist_4',
        name: 'Workout Hits',
        description: 'Motiverende muziek voor je workout',
        trackCount: 50,
        imageUrl: 'https://via.placeholder.com/300x300/FFE66D/000000?text=Workout',
        type: 'spotify_playlist'
      },
      {
        id: 'demo_playlist_5',
        name: 'Sleep Sounds',
        description: 'Rustgevende geluiden en ambient muziek',
        trackCount: 20,
        imageUrl: 'https://via.placeholder.com/300x300/A8E6CF/000000?text=Sleep',
        type: 'spotify_playlist'
      }
    ]);
  };

  const handleLogout = async () => {
    await spotifyService.clearTokens();
    setIsAuthenticated(false);
    setUserProfile(null);
    setPlaylists([]);
    setTracks([]);
    setSelectedPlaylist(null);
  };

  const loadPlaylistTracks = async (playlist) => {
    setLoading(true);
    setSelectedPlaylist(playlist);
    
    try {
      let tracksData;
      if (playlist.id.startsWith('demo_')) {
        // Uitgebreide demo tracks per playlist
        const demoTracks = {
          demo_playlist_1: [ // Chill Morning
            {
              id: 'demo_track_1_1',
              name: 'Morning Sunshine',
              artist: 'Chill Vibes Collective',
              album: 'Peaceful Mornings',
              duration: 240000,
              preview_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
              imageUrl: 'https://via.placeholder.com/300x300/1DB954/ffffff?text=MS',
              type: 'spotify_track'
            },
            {
              id: 'demo_track_1_2',
              name: 'Gentle Awakening',
              artist: 'Ambient Dreams',
              album: 'Dawn Collection',
              duration: 180000,
              preview_url: 'https://www.soundjay.com/misc/sounds/chime-01.wav',
              imageUrl: 'https://via.placeholder.com/300x300/87CEEB/000000?text=GA',
              type: 'spotify_track'
            }
          ],
          demo_playlist_2: [ // Wake Up Energy
            {
              id: 'demo_track_2_1',
              name: 'Energy Boost',
              artist: 'Morning Motivation',
              album: 'Wake Up Call',
              duration: 220000,
              preview_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav',
              imageUrl: 'https://via.placeholder.com/300x300/FF6B6B/ffffff?text=EB',
              type: 'spotify_track'
            },
            {
              id: 'demo_track_2_2',
              name: 'Rise and Shine',
              artist: 'Power Morning',
              album: 'Daily Energy',
              duration: 195000,
              preview_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
              imageUrl: 'https://via.placeholder.com/300x300/FFA500/ffffff?text=RS',
              type: 'spotify_track'
            }
          ],
          demo_playlist_3: [ // Focus Music
            {
              id: 'demo_track_3_1',
              name: 'Deep Focus',
              artist: 'Concentration Station',
              album: 'Productivity Sounds',
              duration: 360000,
              preview_url: 'https://www.soundjay.com/misc/sounds/chime-01.wav',
              imageUrl: 'https://via.placeholder.com/300x300/4ECDC4/ffffff?text=DF',
              type: 'spotify_track'
            }
          ],
          demo_playlist_4: [ // Workout Hits
            {
              id: 'demo_track_4_1',
              name: 'Pump It Up',
              artist: 'Gym Heroes',
              album: 'Workout Warriors',
              duration: 210000,
              preview_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav',
              imageUrl: 'https://via.placeholder.com/300x300/FFE66D/000000?text=PIU',
              type: 'spotify_track'
            }
          ],
          demo_playlist_5: [ // Sleep Sounds
            {
              id: 'demo_track_5_1',
              name: 'Ocean Waves',
              artist: 'Nature Sounds',
              album: 'Sleep Collection',
              duration: 600000,
              preview_url: 'https://www.soundjay.com/misc/sounds/chime-01.wav',
              imageUrl: 'https://via.placeholder.com/300x300/A8E6CF/000000?text=OW',
              type: 'spotify_track'
            }
          ]
        };
        
        tracksData = demoTracks[playlist.id] || [
          {
            id: 'demo_default_track',
            name: 'Demo Track',
            artist: 'Demo Artist',
            album: 'Demo Album',
            duration: 180000,
            preview_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            imageUrl: 'https://via.placeholder.com/300x300/1DB954/ffffff?text=Demo',
            type: 'spotify_track'
          }
        ];
      } else {
        tracksData = await spotifyService.getPlaylistTracks(playlist.id);
      }
      
      setTracks(tracksData);
      setActiveTab('tracks');
    } catch (error) {
      console.error('Fout bij laden playlist tracks:', error);
      Alert.alert('Fout', 'Kon playlist niet laden');
    } finally {
      setLoading(false);
    }
  };

  const loadLikedSongs = async () => {
    setLoading(true);
    setActiveTab('liked');
    
    try {
      const likedTracks = await spotifyService.getSavedTracks();
      setTracks(likedTracks);
    } catch (error) {
      console.error('Fout bij laden liked songs:', error);
      Alert.alert('Fout', 'Kon liked songs niet laden');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await spotifyService.searchTracks(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Fout bij zoeken:', error);
    }
  };

  const playPreview = async (track) => {
    try {
      // Stop huidige preview
      stopPreview();

      if (!track.preview_url) {
        Alert.alert('Geen preview', 'Voor dit nummer is geen preview beschikbaar');
        return;
      }

      const { audio, stop } = await spotifyService.playPreview(track.preview_url);
      setCurrentAudio({ audio, stop });
      setPlayingPreview(track.id);

      // Stop automatisch na 30 seconden
      setTimeout(() => {
        stopPreview();
      }, 30000);
    } catch (error) {
      console.error('Fout bij afspelen preview:', error);
      Alert.alert('Fout', 'Kon preview niet afspelen');
    }
  };

  const stopPreview = () => {
    if (currentAudio) {
      currentAudio.stop();
      setCurrentAudio(null);
    }
    setPlayingPreview(null);
  };

  const selectTrack = (track) => {
    stopPreview();
    onSelectTrack({
      id: track.id,
      name: track.name,
      artist: track.artist,
      uri: track.uri || `spotify:track:${track.id}`,
      preview_url: track.preview_url,
      imageUrl: track.imageUrl,
      type: 'spotify_track'
    });
    onClose();
  };

  const selectPlaylist = (playlist) => {
    stopPreview();
    onSelectTrack({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      uri: playlist.uri || `spotify:playlist:${playlist.id}`,
      imageUrl: playlist.imageUrl,
      trackCount: playlist.trackCount,
      type: 'spotify_playlist'
    });
    onClose();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Spotify Muziek</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoginScreen = () => (
    <View style={styles.loginContainer}>
      <Text style={styles.spotifyLogo}>🎵</Text>
      <Text style={styles.loginTitle}>Verbind met Spotify</Text>
      <Text style={styles.loginSubtitle}>
        Log in om je playlists en muziek te gebruiken als wekkergeluid
      </Text>
      
      <TouchableOpacity style={styles.loginButton} onPress={handleSpotifyLogin}>
        <Text style={styles.loginButtonText}>Log in met Spotify</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'playlists' && styles.activeTab]}
        onPress={() => {
          setActiveTab('playlists');
          setSelectedPlaylist(null);
        }}
      >
        <Text style={[styles.tabText, activeTab === 'playlists' && styles.activeTabText]}>
          Playlists
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'liked' && styles.activeTab]}
        onPress={loadLikedSongs}
      >
        <Text style={[styles.tabText, activeTab === 'liked' && styles.activeTabText]}>
          Liked Songs
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'search' && styles.activeTab]}
        onPress={() => setActiveTab('search')}
      >
        <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
          Zoeken
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity style={styles.playlistItem} onPress={() => loadPlaylistTracks(item)}>
      <View style={styles.playlistImageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.playlistImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🎵</Text>
          </View>
        )}
      </View>
      
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistMeta}>{item.trackCount} nummers</Text>
        {item.description && (
          <Text style={styles.playlistDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => selectPlaylist(item)}
      >
        <Text style={styles.selectButtonText}>Gebruik Playlist</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderTrackItem = ({ item }) => (
    <View style={styles.trackItem}>
      <TouchableOpacity
        style={styles.trackButton}
        onPress={() => selectTrack(item)}
      >
        <View style={styles.trackImageContainer}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.trackImage} />
          ) : (
            <View style={styles.placeholderTrackImage}>
              <Text style={styles.placeholderText}>🎵</Text>
            </View>
          )}
        </View>
        
        <View style={styles.trackInfo}>
          <Text style={styles.trackName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.trackArtist} numberOfLines={1}>{item.artist}</Text>
          <Text style={styles.trackDuration}>
            {spotifyService.formatDuration(item.duration)}
          </Text>
        </View>
        
        {selectedTrackId === item.id && (
          <Text style={styles.selectedIcon}>✓</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.previewButton}
        onPress={() => playingPreview === item.id ? stopPreview() : playPreview(item)}
      >
        <Text style={styles.previewIcon}>
          {playingPreview === item.id ? '⏸️' : '▶️'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSearchTab = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Zoek naar nummers..."
        value={searchQuery}
        onChangeText={handleSearch}
        autoFocus
      />
      
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={renderTrackItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Geen resultaten gevonden' : 'Typ om te zoeken'}
            </Text>
          </View>
        )}
      />
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
          <Text style={styles.loadingText}>Laden...</Text>
        </View>
      );
    }

    if (activeTab === 'search') {
      return renderSearchTab();
    }

    if (activeTab === 'tracks' && selectedPlaylist) {
      return (
        <View style={styles.tracksContainer}>
          <View style={styles.playlistHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                setActiveTab('playlists');
                setSelectedPlaylist(null);
              }}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.playlistHeaderTitle}>{selectedPlaylist.name}</Text>
          </View>
          
          <FlatList
            data={tracks}
            keyExtractor={(item) => item.id}
            renderItem={renderTrackItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    }

    const data = activeTab === 'liked' ? tracks : playlists;
    const renderItem = activeTab === 'liked' ? renderTrackItem : renderPlaylistItem;

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎵</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'liked' ? 'Geen liked songs gevonden' : 'Geen playlists gevonden'}
            </Text>
          </View>
        )}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {renderHeader()}
        
        {!isAuthenticated ? (
          renderLoginScreen()
        ) : (
          <>
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>
                Welkom, {userProfile?.display_name || 'Spotify User'}!
              </Text>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Uitloggen</Text>
              </TouchableOpacity>
            </View>
            
            {renderTabs()}
            {renderContent()}
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1DB954',
    paddingTop: 60,
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
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  spotifyLogo: {
    fontSize: 64,
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#282828',
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: '#535353',
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#282828',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1DB954',
  },
  tabText: {
    color: '#b3b3b3',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#1DB954',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  playlistItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  playlistImageContainer: {
    marginRight: 15,
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#535353',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playlistMeta: {
    color: '#b3b3b3',
    fontSize: 14,
    marginBottom: 4,
  },
  playlistDescription: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  selectButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  selectButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  trackItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackImageContainer: {
    marginRight: 12,
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  placeholderTrackImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    backgroundColor: '#535353',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackArtist: {
    color: '#b3b3b3',
    fontSize: 12,
    marginBottom: 2,
  },
  trackDuration: {
    color: '#b3b3b3',
    fontSize: 11,
  },
  selectedIcon: {
    color: '#1DB954',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  previewButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#535353',
    borderRadius: 20,
  },
  previewIcon: {
    fontSize: 16,
  },
  searchContainer: {
    flex: 1,
    padding: 15,
  },
  searchInput: {
    backgroundColor: '#535353',
    color: 'white',
    padding: 15,
    borderRadius: 25,
    fontSize: 16,
    marginBottom: 15,
  },
  tracksContainer: {
    flex: 1,
  },
  playlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#282828',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  backIcon: {
    color: '#1DB954',
    fontSize: 20,
    fontWeight: 'bold',
  },
  playlistHeaderTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    color: '#b3b3b3',
    fontSize: 16,
    textAlign: 'center',
  },
});
