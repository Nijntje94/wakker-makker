class SpotifyService {
  constructor() {
    this.clientId = '139163dd2c5a49b2a94037a2a3ff7fda';
    // Voor web development gebruiken we localhost met de juiste poort
    this.redirectUri = this.getRedirectUri();
    this.scopes = [
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-library-read',
      'user-read-private'
    ];
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
  }

  // Dynamische redirect URI gebaseerd op huidige URL
  getRedirectUri() {
    if (typeof window !== 'undefined') {
      // Voor web gebruik de huidige origin
      return `${window.location.origin}/`;
    }
    // Fallback voor mobile
    return 'exp://localhost:19000/';
  }

  // Spotify OAuth URL genereren
  getAuthUrl() {
    const scopeString = this.scopes.join(' ');
    const state = this.generateRandomString(16);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope: scopeString,
      redirect_uri: this.redirectUri,
      state: state,
      show_dialog: 'true'
    });

    console.log('Redirect URI:', this.redirectUri);
    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  // Random string voor state parameter
  generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // Check of gebruiker is ingelogd
  isAuthenticated() {
    return this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry;
  }

  // Sla tokens op in localStorage (web) of AsyncStorage (mobile)
  async saveTokens(accessToken, refreshToken, expiresIn) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = new Date(Date.now() + (expiresIn * 1000));

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Web
        localStorage.setItem('spotify_access_token', accessToken);
        localStorage.setItem('spotify_refresh_token', refreshToken);
        localStorage.setItem('spotify_token_expiry', this.tokenExpiry.toISOString());
      }
    } catch (error) {
      console.error('Fout bij opslaan Spotify tokens:', error);
    }
  }

  // Laad tokens uit opslag
  async loadTokens() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Web
        this.accessToken = localStorage.getItem('spotify_access_token');
        this.refreshToken = localStorage.getItem('spotify_refresh_token');
        const expiryString = localStorage.getItem('spotify_token_expiry');
        
        if (expiryString) {
          this.tokenExpiry = new Date(expiryString);
        }
      }
    } catch (error) {
      console.error('Fout bij laden Spotify tokens:', error);
    }
  }

  // Verwijder tokens (logout)
  async clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        localStorage.removeItem('spotify_token_expiry');
      }
    } catch (error) {
      console.error('Fout bij verwijderen tokens:', error);
    }
  }

  // Spotify API call
  async spotifyApiCall(endpoint, options = {}) {
    if (!this.isAuthenticated()) {
      throw new Error('Niet ingelogd bij Spotify');
    }

    const url = `https://api.spotify.com/v1${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (response.status === 401) {
        // Token verlopen, probeer refresh
        await this.refreshAccessToken();
        // Retry de call
        return this.spotifyApiCall(endpoint, options);
      }

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Spotify API call error:', error);
      throw error;
    }
  }

  // Access token vernieuwen
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('Geen refresh token beschikbaar');
    }

    // Voor web development gebruiken we PKCE flow zonder client secret
    // In productie zou je een backend server nodig hebben
    console.warn('Token refresh not implemented for client-side app');
    throw new Error('Please re-authenticate with Spotify');
  }

  // Haal gebruiker profiel op
  async getUserProfile() {
    return await this.spotifyApiCall('/me');
  }

  // Haal playlists op
  async getPlaylists(limit = 50) {
    try {
      const response = await this.spotifyApiCall(`/me/playlists?limit=${limit}`);
      
      return response.items.map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        trackCount: playlist.tracks.total,
        imageUrl: playlist.images?.[0]?.url,
        uri: playlist.uri,
        external_urls: playlist.external_urls,
        type: 'spotify_playlist'
      }));
    } catch (error) {
      console.error('Fout bij ophalen playlists:', error);
      return [];
    }
  }

  // Haal tracks van een playlist op
  async getPlaylistTracks(playlistId, limit = 50) {
    try {
      const response = await this.spotifyApiCall(`/playlists/${playlistId}/tracks?limit=${limit}`);
      
      return response.items
        .filter(item => item.track && !item.track.is_local)
        .map(item => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists.map(a => a.name).join(', '),
          album: item.track.album.name,
          duration: item.track.duration_ms,
          uri: item.track.uri,
          preview_url: item.track.preview_url,
          external_urls: item.track.external_urls,
          imageUrl: item.track.album.images?.[0]?.url,
          type: 'spotify_track'
        }));
    } catch (error) {
      console.error('Fout bij ophalen playlist tracks:', error);
      return [];
    }
  }

  // Haal saved tracks op (liked songs)
  async getSavedTracks(limit = 50) {
    try {
      const response = await this.spotifyApiCall(`/me/tracks?limit=${limit}`);
      
      return response.items.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists.map(a => a.name).join(', '),
        album: item.track.album.name,
        duration: item.track.duration_ms,
        uri: item.track.uri,
        preview_url: item.track.preview_url,
        external_urls: item.track.external_urls,
        imageUrl: item.track.album.images?.[0]?.url,
        type: 'spotify_track'
      }));
    } catch (error) {
      console.error('Fout bij ophalen saved tracks:', error);
      return [];
    }
  }

  // Zoek naar muziek
  async searchTracks(query, limit = 20) {
    if (!query.trim()) return [];

    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await this.spotifyApiCall(`/search?q=${encodedQuery}&type=track&limit=${limit}`);
      
      return response.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        duration: track.duration_ms,
        uri: track.uri,
        preview_url: track.preview_url,
        external_urls: track.external_urls,
        imageUrl: track.album.images?.[0]?.url,
        type: 'spotify_track'
      }));
    } catch (error) {
      console.error('Fout bij zoeken tracks:', error);
      return [];
    }
  }

  // Speel preview af (30 seconden snippet)
  async playPreview(previewUrl) {
    if (!previewUrl) {
      throw new Error('Geen preview beschikbaar voor dit nummer');
    }

    try {
      // Voor web gebruik HTML5 Audio
      const audio = new Audio(previewUrl);
      audio.volume = 0.5;
      await audio.play();
      
      return {
        audio,
        stop: () => {
          audio.pause();
          audio.currentTime = 0;
        }
      };
    } catch (error) {
      console.error('Fout bij afspelen preview:', error);
      throw error;
    }
  }

  // Open Spotify track/playlist in Spotify app
  openInSpotify(uri) {
    if (typeof window !== 'undefined') {
      // Probeer eerst Spotify app, dan web player
      window.open(uri, '_blank') || window.open(`https://open.spotify.com/${uri.replace('spotify:', '').replace(':', '/')}`, '_blank');
    }
  }

  // Format duration
  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Initialiseer service
  async initialize() {
    await this.loadTokens();
  }
}

// Singleton instance
const spotifyService = new SpotifyService();

export default spotifyService;
