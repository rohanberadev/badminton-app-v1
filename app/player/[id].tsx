import {
  Appearance,
  ColorSchemeName,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { Player } from "@/stores/playerStores";
import * as SQLite from "expo-sqlite";

const PlayerPage = () => {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = generateStyles(theme, colorScheme);

  const { id } = useLocalSearchParams();

  const Seperator = ({ otherStyles }: { otherStyles?: {} }) => (
    <View style={[styles.seperator, otherStyles]}></View>
  );

  const [player, setPlayer] = useState<Player | any>({
    id,
    rank: 0,
    name: "",
    currentRating: 0,
    previousRating: 0,
    matchesPlayed: 0,
    matchesWon: 0,
    matchesLost: 0,
  });

  const getPlayerById = async () => {
    try {
      const db = await SQLite.openDatabaseAsync("badminton.db");
      const result = await db.getFirstAsync(
        "SELECT * FROM ranked_table WHERE id = ?",
        [id as string]
      );
      if (!result) return;

      setPlayer(result);
    } catch (error) {}
  };

  useEffect(() => {
    getPlayerById();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={[styles.text, { fontSize: 22, textAlign: "center" }]}>
          {player.name}
        </Text>

        <Seperator />

        <View style={{ paddingHorizontal: 8 }}>
          <Text style={[styles.text]}>Player's Rank</Text>
          <Text style={[styles.text, { fontSize: 22, marginTop: 8 }]}>
            # {player.rank}
          </Text>
        </View>

        <Seperator />

        <View style={{ paddingHorizontal: 8 }}>
          <Text style={[styles.text]}>Player's Rating</Text>
          <Text style={[styles.text, { fontSize: 22, marginTop: 8 }]}>
            {player.currentRating}
          </Text>
        </View>

        <Seperator />

        <View style={{ paddingHorizontal: 8 }}>
          <Text style={[styles.text]}>Total Matches Played</Text>
          <Text style={[styles.text, { fontSize: 22, marginTop: 8 }]}>
            {player.matchesPlayed}
          </Text>
        </View>

        <Seperator />

        <View style={{ paddingHorizontal: 8 }}>
          <Text style={[styles.text]}>Total Matches Won</Text>
          <Text style={[styles.text, { fontSize: 22, marginTop: 8 }]}>
            {player.matchesWon}
          </Text>
        </View>

        <Seperator />

        <View style={{ paddingHorizontal: 8 }}>
          <Text style={[styles.text]}>Total Matches Lost</Text>
          <Text style={[styles.text, { fontSize: 22, marginTop: 8 }]}>
            {player.matchesLost}
          </Text>
        </View>

        <Seperator />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlayerPage;

const generateStyles = (
  theme: typeof Colors.dark | typeof Colors.light,
  colorScheme: ColorSchemeName
) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 16,
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

    matchButton: {
      width: "100%",
      backgroundColor: "green",
      padding: 8,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },

    matchButtonText: {
      fontSize: 18,
      fontWeight: "bold",
    },
  });
};
