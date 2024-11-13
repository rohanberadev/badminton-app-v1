import PlayerComponent from "@/components/PlayerComponent";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  Appearance,
  ColorSchemeName,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePlayerStore } from "@/stores";
import { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";

export default function HomeScreen() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = generateStyles(theme, colorScheme);

  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  const { players } = usePlayerStore();

  const Seperator = () => <View style={styles.seperator}></View>;

  const getRankedTable = async () => {
    try {
      const results = await db!.getAllAsync("SELECT * from ranked_table;");
      usePlayerStore.getState().setPlayers(results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const connectDb = async () => {
      const database = await SQLite.openDatabaseAsync("badminton.db");
      setDb(database);
    };

    connectDb();
  }, []);

  useEffect(() => {
    if (db) {
      getRankedTable();
    }
  }, [db]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={[styles.text, { fontSize: 24, textAlign: "center" }]}>
          Player's Ranking
        </Text>

        <View style={[styles.input, { marginTop: 15 }]}>
          <TextInput placeholder="Search Players..." style={{ fontSize: 18 }} />
        </View>

        <Seperator />

        <FlatList
          data={players}
          ItemSeparatorComponent={Seperator}
          renderItem={({ item }) => (
            <PlayerComponent
              theme={theme}
              colorScheme={colorScheme}
              player={item}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const generateStyles = (
  theme: typeof Colors.dark | typeof Colors.light,
  colorScheme: ColorSchemeName
) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 12,
    },

    text: {
      color: theme.text,
    },

    input: {
      width: "100%",
      backgroundColor: "gray",
      padding: 6,
      borderRadius: 8,
    },

    seperator: {
      width: "100%",
      height: 1,
      backgroundColor: colorScheme === "dark" ? "gray" : "#333",
      marginVertical: 16,
    },
  });
};
