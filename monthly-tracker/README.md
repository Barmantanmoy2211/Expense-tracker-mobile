# Monthly Tracker (Expo)

Offline monthly expense tracker. Data is stored locally with SQLite on your phone.

## Run on your Android phone (Expo Go)

1. Install dependencies (once):

   ```bash
   cd monthly-tracker
   npm install
   ```

2. Start the dev server (clear cache if you had a previous failed build):

   ```bash
   npx expo start -c
   ```

3. Make sure your **phone and computer are on the same Wi‑Fi**.

4. Open **Expo Go** on Android and scan the **QR code** from the terminal (or from the browser page that opens).

5. If the QR code fails, try **Tunnel** mode: press `s` in the terminal, choose tunnel, then scan again (slower but works across networks).

## Tabs

- **Overview** — Today / Week / Month / Quarter / Year / **Custom** range (‹ › except Custom)
- **Expenses** — same filters; **Edit** on each row (long-press to delete)
- **Add** — amount, date, category, note
- **Settings** — currency display (INR default)

No Android Studio required for development with Expo Go.
