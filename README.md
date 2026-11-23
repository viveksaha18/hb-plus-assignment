# HB Plus Authentication

Cross-platform authentication application built with Expo, React Native, Express, PostgreSQL, and Google OAuth 2.0. Only verified Google accounts in the exact `@hbplus.fit` domain are authorized.

## Setup

1. Copy `backend/.env.example` to `backend/.env`.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Configure Google OAuth web, Android, and iOS client IDs.
4. Configure a Neon PostgreSQL `DATABASE_URL`.
5. Install and start:

```powershell
npm install
npm run db:migrate -w backend
npm run dev
```

The web app runs on Expo's web port (normally `http://localhost:8081`) and the API on `http://localhost:4000`.

## Scripts

- `npm run dev:backend` - start Express with hot reload
- `npm run dev:web` - start Expo Web
- `npm run build` - build backend and Expo Web
- `npm run db:migrate -w backend` - initialize PostgreSQL
- `npm test -w backend` - run domain tests

## Google OAuth

Create three OAuth 2.0 client IDs in Google Cloud.

### Web

- Application type: Web application.
- Authorized JavaScript origin: `http://localhost:8081` and the production Netlify origin.
- Authorized redirect URI: `http://localhost:8081` and the production origin.
- Set the Web client ID in `GOOGLE_WEB_CLIENT_ID` and `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.

### Android

- Application type: Android.
- Register the app package and SHA-1 certificate fingerprint.
- Set `GOOGLE_ANDROID_CLIENT_ID` and `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`.

### iOS

- Application type: iOS.
- Register the iOS bundle identifier.
- Set `GOOGLE_IOS_CLIENT_ID` and `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`.

Native OAuth configuration and EAS bundle identifiers must match the Google client registrations. Expo development builds may require custom scheme and package/bundle configuration.

## Neon PostgreSQL

Create a Neon project and copy the pooled connection string into `DATABASE_URL`. SSL is enabled when a connection string is configured.

The migration creates `users` and `application_sessions`. Sessions are stored server-side and their bearer/session cookie tokens are hashed before database storage.

## API

- `GET /api/health` - API and database health
- `POST /api/auth/google` - verify a Google ID token, authorize the exact domain, upsert the user, and create a session
- `GET /api/auth/me` - protected current-user endpoint
- `POST /api/auth/logout` - protected-session logout; invalidates the matching session

Send native bearer tokens using `Authorization: Bearer <token>`. Web uses an HttpOnly, secure-in-production, SameSite cookie.

## Security Notes

- Email ownership and verification are established only from the Google-verified ID token.
- The backend accepts only exact `hbplus.fit` as the domain portion after lowercasing.
- Protected APIs require a valid, unexpired application session.
- SQL uses parameterized queries.
- CORS uses an explicit allowlist.
- Google and application session secrets are environment-only values.

## Deployment

Deploy the backend to a Node-capable host and set all backend environment variables. Deploy `frontend/dist` to Netlify after running `npm run build -w frontend`. Set the production API URL and OAuth IDs. Add the exact Netlify origin to Google OAuth and backend `CORS_ORIGINS`.
