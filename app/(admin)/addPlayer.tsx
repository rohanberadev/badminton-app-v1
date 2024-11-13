import {
  Appearance,
  ColorSchemeName,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { usePlayerStore } from "@/stores";
import * as Crypto from "expo-crypto";
import * as SQLite from "expo-sqlite";
import Toast from "react-native-toast-message";

const AddPlayer = () => {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = generateStyles(theme, colorScheme);

  const Seperator = ({ otherStyles }: { otherStyles?: {} }) => (
    <View style={[styles.seperator, otherStyles]}></View>
  );

  const [name, setName] = useState("");

  const { setPlayers } = usePlayerStore();

  const addNewPlayer = async () => {
    const db = await SQLite.openDatabaseAsync("badminton.db");

    if (!name) return;

    setName(name.trim());

    await db.withExclusiveTransactionAsync(async (tx) => {
      const exitingPlayer: any = await tx.getFirstAsync(
        "SELECT * FROM players WHERE LOWER(name) = LOWER(?);",
        [name]
      );

      if (exitingPlayer) {
        Toast.show({
          type: "error",
          text1: "Player with this name already exists",
        });
        return;
      }

      const newPlayer = {
        id: Crypto.randomUUID(),
        rank: 0,
        name: name,
        currentRating: 1500,
        previousRating: 1500,
        matchesPlayed: 0,
        matchesWon: 0,
        matchesLost: 0,
      };

      await tx.runAsync("INSERT INTO players (id, name) VALUES(?, ?)", [
        newPlayer.id,
        newPlayer.name,
      ]);

      const rankedPlayers: any = await tx.getAllAsync(
        "SELECT * from ranked_table;"
      );

      setPlayers(rankedPlayers);

      Toast.show({
        type: "success",
        text1: "Player has added successfully",
      });
    });

    setName("");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ zIndex: 10 }}>
          <Toast position="top" bottomOffset={20} />
        </View>

        <Text style={[styles.text, { fontSize: 22, textAlign: "center" }]}>
          Add New Player
        </Text>

        <Seperator />

        <View>
          <Text style={[styles.text]}>Player's Fullname</Text>
          <View style={[styles.input, { marginTop: 15 }]}>
            <TextInput
              placeholder="Enter fullname"
              style={{ fontSize: 18 }}
              onChangeText={(e) => setName(e)}
              value={name}
            />
          </View>
        </View>

        <Seperator />

        <View>
          <Text style={[styles.text]}>Player's Rating</Text>
          <View style={[styles.input, { marginTop: 15 }]}>
            <TextInput
              placeholder="Lastname"
              style={{ fontSize: 18 }}
              editable={false}
              value="1500"
            />
          </View>
        </View>

        <Seperator />

        <TouchableOpacity style={[styles.matchButton]} onPress={addNewPlayer}>
          <Text style={[styles.text, styles.matchButtonText]}>Add Player</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddPlayer;

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
