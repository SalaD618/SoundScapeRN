# SoundScape React Native TypeScript

Versiune React Native / Expo pentru proiectul Android Native SoundScape.

## Functionalitati

- Login local
- Home cu trending artists din Last.fm
- Search artists
- Artist details cu biography, tags si similar artists
- Favorites salvate local cu AsyncStorage
- Settings cu dark mode, default genre, language si logout
- Stats pentru artistii favoriti

## Rulare in Visual Studio Code

```powershell
npm install
copy .env.example .env
```

Editeaza `.env`:

```env
EXPO_PUBLIC_LASTFM_API_KEY=cheia_ta_lastfm
```

Pornire cu QR code:

```powershell
npx expo start
```

Pornire pe emulator Android:

```powershell
npx expo start --android
```

Pentru browser:

```powershell
npx expo install react-native-web react-dom @expo/metro-runtime
npx expo start --web
```
