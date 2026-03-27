# Mobile App Testing Guide for GymFlowSaaS

The mobile app is built with Expo React Native. Here's how to test it:

## Prerequisites

1. Node.js 20+ installed
2. Expo Go app installed on your phone (iOS App Store / Android Play Store)
3. Optional: Android Studio or Xcode for emulator/simulator testing

## Step-by-Step Testing

### Option 1: Physical Device (Recommended for Best Experience)

1. **Clone the repo** (if not already done):

   ```bash
   git clone https://github.com/Warriorlegacy/gymflow-saas.git
   cd gymflow-saas
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   # or if you don't have pnpm yet:
   npm install -g pnpm
   pnpm install
   ```

3. **Start the development server**:

   ```bash
   pnpm dev:mobile
   # or from project root:
   pnpm --filter @gymflow/mobile start
   ```

4. **Scan the QR code**:
   - After running the command, you'll see output like:
     ```
     Expo DevTools is running at http://localhost:19002
     Metro waiting for exp://192.168.1.100:19000
     ```
   - A QR code will appear in the terminal
   - Open Expo Go app on your phone
   - Tap "Scan QR Code"
   - Point camera at the QR code in terminal
   - The app will load automatically

5. **Development Experience**:
   - Changes you make to the mobile app will hot-reload instantly
   - Console logs appear in your terminal
   - Error overlays show on screen if something fails
   - Use "shake device" or press "d" in terminal to open dev menu

### Option 2: Emulator/Simulator (For Development Without Physical Device)

#### Android Emulator:

1. Install Android Studio: https://developer.android.com/studio
2. Open Android Studio → More Actions → Virtual Device Manager
3. Create a virtual device (Pixel 4 API 33 recommended)
4. Start the emulator
5. Run: `pnpm dev:mobile`
6. Press "a" in terminal to run on Android emulator
   OR
   In Expo DevTools, click "Run on Android device/emulator"

#### iOS Simulator (Mac only):

1. Install Xcode from App Store
2. Run: `pnpm dev:mobile`
3. Press "i" in terminal to run on iOS simulator
   OR
   In Expo DevTools, click "Run on iOS simulator"

### Option 3: Web Testing (For Quick UI Checks)

1. Run: `pnpm dev:mobile`
2. Press "w" in terminal to open in web browser
3. Visit http://localhost:19006 (or whatever port shows)
4. Note: Some native-only features won't work, but UI/navigation will

## Testing Flow (What to Try)

Once the app is running:

### 1. Login Screen (`/`)

- Try email: `owner@gymflow.demo` (will attempt magic link)
- Try "Enter Demo Tenant" button (uses demo session)
- Try "Create a new gym tenant" link (goes to onboarding)

### 2. Dashboard (`/dashboard`)

- Shows gym metrics from API
- Shows "Loading..." then falls back to demo data if backend not running
- Quick access cards to navigate to other sections

### 3. Members (`/members`)

- Lists demo members
- Shows member details: name, phone, status, goal, trainer

### 4. Attendance (`/attendance`)

- Shows check-in records
- Can filter by date (would need backend for full CRUD)

### 5. Payments (`/payments`)

- Shows payment history
- Displays amount with ₹ currency formatting
- Shows method and date

### 6. Workouts (`/workouts`)

- Shows assigned workout plans
- Displays title, goal, member/trainer assignments
- Shows workout schedule (days, focus, exercises)
- Shows "AI Generated" badge for AI-created plans

### 7. Diet Plans (`/diet-plans`)

- Shows assigned nutrition plans
- Displays title, objective
- Shows meal schedule with times, meals, items
- Shows "AI Generated" badge

### 8. Profile (`/profile`)

- Shows logged-in user details
- Shows gym information
- Settings placeholders
- Logout button

## Backend Connection

The mobile app connects to your backend via:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000
```

### To Test With Local Backend:

1. In one terminal: `pnpm dev:backend` (starts Fastify on :4000)
2. In another terminal: `pnpm dev:mobile`
3. The mobile app will now talk to your local backend

### To Test With Deployed Vercel Backend:

1. Get your Vercel URL (e.g., https://gymflow-saas.vercel.app)
2. Update `app.json` or create `.env`:
   ```
   EXPO_PUBLIC_API_BASE_URL=https://gymflow-saas.vercel.app
   ```
3. Restart the metro bundler: `pnpm dev:mobile`
4. Now mobile app talks to your Vercel-deployed backend

### To Test With Docker Backend:

1. Run: `docker-compose up --build backend`
2. Keeps `EXPO_PUBLIC_API_BASE_URL=http://localhost:4000` (default)
3. Mobile app talks to Dockerized backend

## Common Issues & Fixes

### "Could not connect to development server"

- Ensure phone and computer are on same WiFi network
- Check that firewall isn't blocking port 19000/19001
- In expo dev menu, try "Tunnel" connection instead of "LAN"
- Or use your computer's IP address instead of localhost

### "Failed to load JavaScript bundle"

- Usually means metro bundler crashed
- Check terminal for error messages
- Restart with `pnpm dev:mobile`
- Clear cache: `expo start -c`

### "Module not found" errors

- Ensure you ran `pnpm install` in project root
- Try deleting `node_modules` and `pnpm-lock.yaml` then reinstall
- Run `pnpm install` again

### Android: "Cleartext HTTP traffic not permitted"

- Add to `android/app/src/main/AndroidManifest.xml` inside `<application>`:
  ```xml
  android:usesCleartextTraffic="true"
  ```
- Only for development - remove for production builds

### iOS: Blank white screen

- Often due to pod install issues
- Run: `npx pod-install ios`
- Then restart expo

## Building Production Binaries

### Android APK:

```bash
pnpm --filter @gymflow/mobile build:android
# Output: apps/mobile/android/app/build/outputs/apk/release/app-release.apk
```

### iOS IPA (Mac only):

```bash
pnpm --filter @gymflow/mobile build:ios
# Requires Apple Developer account
```

### Web Build:

```bash
pnpm --filter @gymflow/mobile build:web
# Output: apps/mobile/web-build/
```

## Testing Checklist

[ ] App loads without red error screen
[ ] Navigation works between all tabs
[ ] Demo data displays correctly
[ ] Images and icons load properly
[ ] Text inputs work and accept keyboard
[ ] Buttons respond to presses
[ ] Date pickers work (where applicable)
[ ] Modal dialogs open and close
[ ] No console errors visible in terminal
[ ] Hot reloading works when making changes
[ ] Standalone/test flight build works (if attempting)

## Connecting to Your Deployed Backend

Once you have Vercel deployed:

1. Get your backend URL (same as frontend if using Vercel)
2. Update in `app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "API_BASE_URL": "https://your-vercel-app.vercel.app"
       }
     }
   }
   ```
3. Or set at runtime with:
   ```bash
   EXPO_PUBLIC_API_BASE_URL=https://your-vercel-app.vercel.app pnpm dev:mobile
   ```

## Where to Get Help

- Expo Documentation: https://docs.expo.dev/
- React Native Docs: https://reactnative.dev/
- Our mobile source: `apps/mobile/`
- API endpoints: Check `apps/backend/src/routes/index.ts`

Would you like me to:

1. Generate a pre-configured .env file for mobile testing?
2. Help you build and install the APK/IPA on your device?
3. Explain how to test specific features like WhatsApp or AI?
4. Provide troubleshooting for common Expo errors?
