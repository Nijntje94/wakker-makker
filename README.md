# 🌅 Wakker-Makker

<div align="center">
  <img src="assets/icon.png" alt="Wakker-Makker Logo" width="200"/>
  
  ### Jouw Slimme Wek-Maatje! ⏰
  ### 100% GRATIS - GEEN ADVERTENTIES - OPEN SOURCE
  
 [![License](https://img.shields.io/badge/license-AGPLv3-blue.svg)](LICENSE)
 [![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)](https://expo.dev)
  [![React Native](https://img.shields.io/badge/React%20Native-0.72.6-blue.svg)](https://reactnative.dev)
  [![Expo](https://img.shields.io/badge/Expo-49.0.0-black.svg)](https://expo.dev)
  [![Price](https://img.shields.io/badge/price-FREE-green.svg)](https://github.com/jouw-gebruikersnaam/wakker-makker)
</div>

## 📱 Over Wakker-Makker

Wakker-Makker is een **100% gratis** wekker app zonder advertenties, zonder in-app aankopen, en zonder verborgen kosten. Het is jouw persoonlijke ochtend-assistent die ervoor zorgt dat je écht wakker wordt! Met unieke uitzetmethodes zoals barcode scanning, rekensommen en schudden, blijf je niet meer snoozen.

### 🎁 Altijd Gratis
- **Geen advertenties** - Nooit
- **Geen in-app aankopen** - Alles is gratis
- **Geen data verzameling** - Je privacy is veilig
- **Open source** - Bekijk en verbeter de code

### ✨ Features

#### 🎯 Slimme Uitzetmethodes
- **Normaal** - Klassiek stoppen met één tik
- **Barcode Scanner** - Scan een specifieke barcode om uit te zetten
- **Rekensommen** - Los een som op om wakker te worden
- **Shake-It** - Schud je telefoon 5 seconden lang

#### 🎵 Muziek Integratie
- Kies muziek van je telefoon
- Spotify integratie voor playlists en nummers
- Geleidelijk of direct volume
- Preview functie voor het testen van geluiden

#### ⚙️ Aanpasbare Instellingen
- 24-uurs of 12-uurs (AM/PM) klok
- Nederlands (NL) en Engels (ENG) taalondersteuning
- Instelbare snooze tijden voor wekkers en reminders
- Donker thema voor 's nachts

#### 📅 Wekkers & Reminders
- Wekkers met specifieke dagen van de week
- Eenmalige reminders met titel en beschrijving
- Aan/uit toggle voor individuele items
- Bewerk of verwijder met één tik

## 🚀 Installatie

### Vereisten
- Node.js (v16 of hoger)
- npm of yarn
- Expo CLI
- iOS Simulator (Mac) of Android Emulator

### Stappen

1. **Clone de repository**
```bash
git clone https://github.com/jouw-gebruikersnaam/wakker-makker.git
cd wakker-makker
```

2. **Installeer dependencies**
```bash
npm install
# of
yarn install
```

3. **Start de development server**
```bash
npm start
# of
yarn start
```

4. **Run op je apparaat**
- Download de Expo Go app
- Scan de QR code
- Of gebruik een emulator:
```bash
npm run ios     # Voor iOS
npm run android # Voor Android
```

## 🛠 Development

### Project Structuur
```
wakker-makker/
├── App.js                    # Hoofdcomponent
├── components/              
│   ├── AlarmDismissScreen.js # Wekker dismiss scherm
│   ├── MusicSelector.js      # Muziek selectie
│   └── WakkerMakkerSplash.js # Splash screen
├── assets/                   # Afbeeldingen en geluiden
├── utils/                    # Helper functies
└── constants/               # App constanten
```

### Spotify Setup
1. Maak een app op [Spotify Developer Dashboard](https://developer.spotify.com)
2. Voeg redirect URI toe: `exp://localhost:19000/--/spotify-redirect`
3. Kopieer je Client ID naar `MusicSelector.js`

## 🐛 Bekende Issues & Oplossingen

**Barcode scanner is zwart**
- Camera permissies checken
- Herstart de app na permissie toekenning

## 🤝 Bijdragen

Bijdragen zijn welkom! 

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je wijzigingen (`git commit -m 'Add AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 Licentie

Dit project is gelicenseerd onder de GNU Affero General Public License v3.0 (AGPLv3) – zie het [LICENSE](LICENSE) bestand voor details.

## 👏 Credits

Gemaakt met ❤️ door Nijntje94

**Deze app is en blijft voor altijd gratis als een service aan de community!**

### Gebruikte Libraries
- [React Native](https://reactnative.dev)
- [Expo](https://expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)

## 📞 Contact & Support

- **Bug Reports**: [GitHub Issues](https://github.com/nijntje94/wakker-makker/issues)
- **Website**: [brainfork.makkers.net](https://brainfork.makkers.net)

---

<div align="center">
  <b>Wakker-Makker</b> - Omdat opstaan een kunst is! 🎨
</div>
