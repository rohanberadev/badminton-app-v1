import {
  Appearance,
  ColorSchemeName,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import PlayerComponent from "@/components/PlayerComponent";
import { usePlayerStore } from "@/stores";
import * as SQLite from "expo-sqlite";
import Toast from "react-native-toast-message";

const DeletePlayer = () => {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = generateStyles(theme, colorScheme);

  const { players, setPlayers } = usePlayerStore();

  const [searchPlayer, setSearchPlayer] = useState("");

  const Seperator = ({ otherStyles }: { otherStyles?: {} }) => (
    <View style={[styles.seperator, otherStyles]}></View>
  );

  const handleDeletePlayer = async (id: string) => {
    try {
      const db = await SQLite.openDatabaseAsync("badminton.db");

      db.withExclusiveTransactionAsync(async (tx) => {
        const existingPlayer: any = await tx.getFirstAsync(
          "SELECT id FROM players WHERE id = ?;",
          [id]
        );

        if (!existingPlayer) {
          Toast.show({
            type: "error",
            text1: "Player does not exist",
          });
          return;
        }

        await tx.runAsync("DELETE FROM players where id = ?", [
          existingPlayer.id,
        ]);

        const rankedPlayers: any = await tx.getAllAsync(
          "SELECT * from ranked_table;"
        );

        setPlayers(rankedPlayers);

        Toast.show({
          type: "success",
          text1: "Player has been deleted successfully",
        });
      });
    } catch (error) {}
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ zIndex: 10 }}>
          <Toast position="top" bottomOffset={20} />
        </View>

        <Text style={[styles.text, { fontSize: 22, textAlign: "center" }]}>
          Delete Any Player
        </Text>

        <Seperator />

        <View>
          <Text style={[styles.text]}>Search Players Here</Text>
          <View style={[styles.input, { marginTop: 15 }]}>
            <TextInput
              placeholder="Search with name"
              style={{ fontSize: 18 }}
              value={searchPlayer}
              onChangeText={(e) => setSearchPlayer(e)}
            />
          </View>
        </View>

        <Seperator />

        <FlatList
          data={
            searchPlayer
              ? players.filter((player) =>
                  player.name.toLowerCase().includes(searchPlayer.toLowerCase())
                )
              : []
          }
          ItemSeparatorComponent={Seperator}
          renderItem={({ item }) => (
            <View>
              <PlayerComponent
                theme={theme}
                colorScheme={colorScheme}
                player={item}
                deletable={true}
                handleDeletePlayer={handleDeletePlayer}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default DeletePlayer;

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
