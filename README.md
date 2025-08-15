# 🚨 Wakker-Makker

> Een krachtige, open-source wekker app met geavanceerde stop-methodes en smart reminders

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-51-black.svg)](https://expo.dev/)
[![Web Compatible](https://img.shields.io/badge/Web-Compatible-green.svg)](https://expo.dev/tools#web)

![Wakker-Makker App Screenshot](https://via.placeholder.com/800x400/6200ee/ffffff?text=Wakker-Makker+Screenshots)

## ✨ Features

### 🔥 Geavanceerde Wekker Opties
- **📷 Barcode Stop** - Scan een specifieke barcode om de wekker uit te zetten
- **🧮 Rekensom Challenge** - Los een wiskundige vergelijking op om wakker te worden
- **📱 Schud Functie** - Schud je telefoon 5 seconden om de wekker te stoppen
- **✅ Normale Stop** - Klassieke stop knop voor eenvoudig gebruik

### ⏰ Smart Wekker Features
- **📅 Weekdag Selectie** - Stel verschillende dagen in per wekker
- **🔊 Volume Opties** - Geleidelijk harder worden of direct vol volume
- **💬 Aangepaste Tekst** - Persoonlijke boodschappen bij je wekker
- **🎵 Geluid Keuze** - Selecteer uit lokale muziek of Spotify playlists

### 📝 Intelligent Reminder Systeem
- **📅 Datum & Tijd Planner** - Flexibele planning met datum suggesties
- **🔔 Volume Instellingen** - Aanpasbare volume voor notificaties
- **📋 Uitgebreide Beschrijvingen** - Voeg context toe aan je reminders
- **⏭️ Morgen Functie** - Verschuif reminders eenvoudig naar de volgende dag

### ⚙️ Aanpassingen
- **🕐 Tijdformaat** - 24-uurs of 12-uurs (AM/PM) weergave
- **🌍 Meertalig** - Nederlands en Engels ondersteuning
- **⏱️ Sluimer Instellingen** - Aanpasbare sluimertijden voor wekkers en reminders
- **💾 Lokale Opslag** - Al je instellingen worden lokaal opgeslagen

## 🚀 Aan de slag

### Vereisten
- [Node.js](https://nodejs.org/) (v16 of hoger)
- [npm](https://www.npmjs.com/) of [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installatie

1. **Clone de repository**
   ```bash
   git clone https://github.com/Nijntje94/wakker-makker.git
   cd wakker-makker
   ```

2. **Installeer dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start de development server**
   ```bash
   npx expo start
   ```

### 🌐 Web Development
Voor web development (perfecte voor testen):
```bash
npx expo start --web
```

### 📱 Mobile Development
Voor echte telefoon testing:

**Android:**
```bash
# Download Expo Go app en scan QR code
npx expo start --android
```

**iOS:**
```bash
# Download Expo Go app en scan QR code  
npx expo start --ios
```

## 🏗️ Project Structuur

```
wakker-makker/
├── components/          # Herbruikbare UI componenten
│   ├── Clock.js         # Real-time klok weergave
│   ├── AlarmItem.js     # Wekker lijst item
│   └── ReminderItem.js  # Reminder lijst item
├── context/             # State management
│   ├── SettingsContext.js   # App instellingen
│   ├── AlarmsContext.js     # Wekkers beheer
│   └── RemindersContext.js  # Reminders beheer
├── screens/             # App schermen
│   ├── HomeScreen.js        # Hoofdscherm met overzicht
│   ├── SettingsScreen.js    # Instellingen pagina
│   ├── CreateAlarmScreen.js # Nieuwe wekker maken
│   ├── CreateReminderScreen.js # Nieuwe reminder maken
│   ├── AlarmRingingScreen.js   # Wekker afgaan scherm
│   └── [...]               # Overige schermen
├── App.js              # Hoofd app component
├── package.json        # Project dependencies
└── README.md          # Dit bestand
```

## 🛠️ Technische Stack

- **Framework:** React Native met Expo
- **Navigatie:** React Navigation v6
- **State Management:** React Context + useState
- **Styling:** StyleSheet (React Native)
- **Opslag:** localStorage (web) / AsyncStorage (mobile)
- **Platforms:** iOS, Android, Web

## 📋 Roadmap

### 🎯 Volgende Features (v1.1)
- [ ] 🎵 **Muziek Integratie** - Lokale muziek bibliotheek ondersteuning
- [ ] 🎧 **Spotify Connect** - Gebruik Spotify playlists als wekker geluid
- [ ] 📷 **Camera Integratie** - Echte barcode scanner functionaliteit
- [ ] 🔢 **Dynamische Rekensommen** - Moeilijkheidsgraad aanpassing
- [ ] 📱 **Shake Detectie** - Gyroscoop/accelerometer integratie

## 🤝 Bijdragen

Bijdragen zijn van harte welkom! Hier is hoe je kunt helpen:

1. **Fork** de repository
2. **Clone** je fork lokaal
3. **Maak** een feature branch (`git checkout -b feature/geweldige-functie`)
4. **Commit** je wijzigingen (`git commit -m 'Voeg geweldige functie toe'`)
5. **Push** naar de branch (`git push origin feature/geweldige-functie`)
6. **Open** een Pull Request

### 🐛 Bug Reports
Vond je een bug? [Open een issue](https://github.com/Nijntje94/wakker-makker/issues) met:
- Beschrijving van het probleem
- Stappen om te reproduceren
- Verwacht vs. werkelijk gedrag
- Screenshots (indien van toepassing)

### 💡 Feature Requests
Heb je een idee? [Deel het met ons](https://github.com/Nijntje94/wakker-makker/issues) door een feature request aan te maken.

## 📱 App Store Releases

### Google Play Store
*Coming Soon* - Momenteel in development

### Apple App Store  
*Coming Soon* - Momenteel in development

## 📄 Licentie

Dit project is gelicenseerd onder de **GNU Affero General Public License v3.0 (AGPL-3.0)**.

Dit betekent dat:
- ✅ Je de app vrij kunt gebruiken
- ✅ Je de broncode kunt bekijken en wijzigen
- ✅ Je je eigen versie kunt maken
- ⚠️ Als je de app distribueert, moet je ook de broncode beschikbaar maken
- ⚠️ Als je de app gebruikt in een netwerk service, moet je de broncode delen

Zie het [LICENSE](LICENSE) bestand voor volledige details.

## 💬 Community & Support

- **🐛 Bug Reports:** [GitHub Issues](https://github.com/Nijntje94/wakker-makker/issues)
- **💬 Discussies:** [GitHub Discussions](https://github.com/Nijntje94/wakker-makker/discussions)

## ☕ Steun het Project

Vind je Wakker-Makker nuttig? Overweeg om de ontwikkeling te steunen:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-orange?style=for-the-badge&logo=buy-me-a-coffee)](https://buymeacoffee.com/nijntje94)

## 🙏 Acknowledgments

- **React Native Team** voor het geweldige framework
- **Expo Team** voor de ontwikkeltools
- **Open Source Community** voor inspiratie en feedback
- **Beta Testers** voor het vroegtijdig testen

---

<div align="center">

**Gemaakt met ❤️ voor betere ochtenden**

[⭐ Star deze repo](https://github.com/Nijntje94/wakker-makker) als het je heeft geholpen!

</div>
