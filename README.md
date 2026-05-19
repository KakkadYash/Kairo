# Kairo

Kairo is a portfolio-grade personal cloud music locker app for uploading, storing, streaming, and organizing a private music library across devices.

The product direction is premium, dark, and mobile-first: a black interface, golden yellow accents, glassy cards, rounded album art, and clean controls built around fast access to the music you own.

## MVP Goal

Build a usable end-to-end music locker where a user can upload personal audio files, store them securely in the cloud, stream them from a mobile app, and organize their library with playlists, favorites, search, and offline access.

## MVP Features

- Personal music upload
- Cloud music storage
- Online streaming
- Search library
- Create playlists
- Favorites
- Offline downloads
- Background playback on mobile

## Tech Stack

| Area | Technology |
| --- | --- |
| Backend | FastAPI |
| Mobile App | React Native + Expo |
| Admin Panel | React + Vite |
| Database/Auth | Firebase Auth + Firestore |
| Storage | Google Cloud Storage |
| Deployment | Google Cloud Run |

## Project Structure

```text
Kairo/
+-- backend/       # FastAPI API, upload logic, streaming endpoints, cloud integrations
+-- mobile/        # React Native + Expo mobile app
+-- admin-panel/   # React + Vite admin/upload dashboard
+-- docs/          # Architecture notes, planning docs, API specs, design references
`-- README.md      # Project overview
```

## Development Status

Kairo is currently in early MVP development.

The first milestone is to establish the core architecture and prove the main product loop:

1. User signs in.
2. User uploads music.
3. Music is stored in Google Cloud Storage.
4. Metadata is saved in Firestore.
5. The mobile app can browse, search, and stream the library.

## Product Direction

Kairo is designed to feel like a focused personal media product rather than a generic file manager.

Key interface principles:

- Dark/black premium visual system
- Golden yellow as the primary accent color
- Glassy surfaces for library cards and controls
- Rounded album artwork
- Clean, mobile-first layouts
- Fast access to playback, favorites, playlists, and downloads

## RTSA Learning + Portfolio Relevance

Kairo is being built as a serious full-stack learning project with long-term portfolio value. It connects directly to RTSA-style software engineering growth by practicing:

- Real product planning and MVP scoping
- Backend API design with FastAPI
- Cloud storage and deployment workflows
- Firebase authentication and Firestore data modeling
- Mobile app development with React Native and Expo
- Admin tooling with React and Vite
- Media upload, streaming, offline access, and background playback flows
- Clean documentation, architecture thinking, and portfolio presentation

The goal is for Kairo to become a polished showcase project that demonstrates practical full-stack engineering, mobile development, cloud architecture, and product design judgment.
