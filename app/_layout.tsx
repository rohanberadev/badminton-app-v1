import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SQLite from "expo-sqlite";
import { useEffect } from "react";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      <Stack.Screen name="player/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    initializeDb();
  }, []);

  return <AppLayout />;
}

const initializeDb = async () => {
  try {
    console.log("start");
    const db = await SQLite.openDatabaseAsync("badminton.db");
    await db.execAsync(`PRAGMA journal_mode = WAL;`); // Execute this first, outside of a transaction
    console.log("end");

    // Now start the transaction for table creation
    await db.execAsync(`
      -- Create players table if it doesn't exist
      CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        currentRating INTEGER DEFAULT 1500,
        previousRating INTEGER DEFAULT 1500,
        matchesPlayed INTEGER DEFAULT 0,
        matchesWon INTEGER DEFAULT 0,
        matchesLost INTEGER DEFAULT 0
      );
    `);

    await db.execAsync(`
      -- Create matches table if it doesn't exist
      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY NOT NULL,
        winnerId TEXT NOT NULL,
        loserId TEXT NOT NULL,
        durationInMinutes INTEGER,
        winnerPoints INTEGER NOT NULL,
        loserPoints INTEGER NOT NULL,
        initialTarget INTEGER NOT NULL,
        target INTEGER NOT NULL,
        winnerBeforeRating INTEGER NOT NULL,
        winnerAfterRating INTEGER NOT NULL,
        loserBeforeRating INTEGER NOT NULL,
        loserAfterRating INTEGER NOT NULL,
        dateTime TEXT NOT NULL
      );
    `);

    await db.execAsync(`
      -- Create the ranked table view for sorting players based on ranking criteria
      CREATE VIEW IF NOT EXISTS ranked_table AS
      SELECT
        *,
        DENSE_RANK() OVER (ORDER BY currentRating DESC, matchesWon DESC, matchesLost ASC) AS rank
      FROM players;
    `);

    console.log("Database initialized and tables created");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
