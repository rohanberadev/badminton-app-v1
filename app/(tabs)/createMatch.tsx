import {
  Appearance,
  ColorSchemeName,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import MatchComponent from "@/components/MatchComponent";
import { useMatchStore, usePlayerStore } from "@/stores";
import { Player } from "@/stores/playerStores";
import * as SQLite from "expo-sqlite";

const CreateMatch = () => {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = generateStyles(theme, colorScheme);

  const [searchPlayer, setSearchPlayer] = useState("");
  const {
    matchStarted,
    setMatchStarted,
    player1,
    player2,
    setPlayer1,
    setPlayer2,
    resetMatch,
    status,
    initializeTarget,
    winner,
    loser,
  } = useMatchStore();

  const { players, setPlayers } = usePlayerStore();

  const [targetPoints, setTargetPoints] = useState("11");

  const [winnerPlayer, setWinnerPlayer] = useState<Player | null>(null);
  const [loserPlayer, setLoserPlayer] = useState<Player | null>(null);

  const probability = (rating1: number, rating2: number) => {
    return 1 / (1 + Math.pow(10, (rating1 - rating2) / 400));
  };

  const eloRating = (Ra: number, Rb: number, K: number, outcome: number) => {
    const Pa = probability(Rb, Ra);
    const Pb = probability(Ra, Rb);

    Ra = Ra + K * (outcome - Pa);
    Rb = Rb + K * (1 - outcome - Pb);

    return { winnerRating: Math.round(Ra), loserRating: Math.round(Rb) };
  };

  const getPlayerById = async (id: string) => {
    try {
      const db = await SQLite.openDatabaseAsync("badminton");
      const result = await db.getFirstAsync(
        "SELECT * FROM ranked_table WHERE id = ?;",
        [id]
      );

      return result;
    } catch (error) {}
  };

  const handleGenerateRating = async () => {
    const winnerP: Player = (await getPlayerById(winner!)) as Player;
    const loserP: Player = (await getPlayerById(loser!)) as Player;

    const highRatePlayer =
      winnerP.currentRating >= loserP.currentRating ? winnerP : loserP;
    const lowRatePlayer =
      winnerP.currentRating < loserP.currentRating ? winnerP : loserP;

    const rating1 = highRatePlayer.currentRating;
    const rating2 = lowRatePlayer.currentRating;

    const { winnerRating, loserRating } = eloRating(
      rating1,
      rating2,
      Math.abs(player1?.points! - player2?.points!),
      highRatePlayer.id! === winner ? 1 : 0
    );

    setWinnerPlayer({
      ...winnerP,
      currentRating: winnerRating,
      previousRating: winnerP.currentRating,
    });
    setLoserPlayer({
      ...loserP,
      currentRating: loserRating,
      previousRating: loserP.currentRating,
    });
  };

  const handleSubmitMatch = async () => {
    try {
      const db = await SQLite.openDatabaseAsync("badminton.db");
      db.withExclusiveTransactionAsync(async (tx) => {
        // for winner
        tx.runAsync(
          "UPDATE players SET matchesPlayed = ?, matchesWon = ?, currentRating = ?, previousRating = ? WHERE id = ?;",
          [
            winnerPlayer?.matchesPlayed! + 1,
            winnerPlayer?.matchesWon! + 1,
            winnerPlayer?.currentRating!,
            winnerPlayer?.previousRating!,
            winnerPlayer?.id!,
          ]
        );

        // for loser
        tx.runAsync(
          "UPDATE players SET matchesPlayed = ?, matchesLost = ?, currentRating = ?, previousRating = ? WHERE id = ?;",
          [
            loserPlayer?.matchesPlayed! + 1,
            loserPlayer?.matchesLost! + 1,
            loserPlayer?.currentRating!,
            loserPlayer?.previousRating!,
            loserPlayer?.id!,
          ]
        );

        const rankedPlayers: any = await tx.getAllAsync(
          "SELECT * from ranked_table;"
        );

        setPlayers(rankedPlayers);
      });

      resetMatch();
      setMatchStarted(false);
    } catch (error) {}
  };

  useEffect(() => {
    if (status === "Complete") {
      handleGenerateRating();
    }
  }, [status, player1?.points, player2?.points]);

  const addPlayerInMatch = (player: Player) => {
    if (!player1) {
      setPlayer1({ id: player.id, name: player.name, points: 0 });
    } else if (!player2) {
      setPlayer2({ id: player.id, name: player.name, points: 0 });
    } else {
    }

    setSearchPlayer("");
  };

  const Seperator = ({ otherStyles }: { otherStyles?: {} }) => (
    <View style={[styles.seperator, otherStyles]}></View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={[styles.text, { fontSize: 24, textAlign: "center" }]}>
          Start New Match
        </Text>

        <View style={styles.addPlayerContainer}>
          <View>
            <Text style={[styles.text]}>Add Player</Text>
            <View
              style={[
                styles.input,
                { marginTop: 15 },
                !matchStarted && { backgroundColor: "#A9A9A9" },
              ]}
            >
              <TextInput
                placeholder="Search Player Name"
                style={{ fontSize: 18 }}
                onChangeText={(e) => {
                  !matchStarted ? setSearchPlayer(e) : null;
                }}
                editable={!matchStarted}
              />
            </View>
          </View>

          <Seperator />

          {searchPlayer && (
            <View style={styles.playersViewContainer}>
              <FlatList
                data={players?.filter(
                  (player) =>
                    player.name
                      .toLowerCase()
                      .includes(searchPlayer.toLowerCase()) &&
                    player.id !== player1?.id &&
                    player.id !== player2?.id
                )}
                ItemSeparatorComponent={() => (
                  <Seperator otherStyles={{ marginVertical: 8 }} />
                )}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => addPlayerInMatch(item)}>
                    <View style={styles.playerContainer}>
                      <Text>{item.name}</Text>

                      <Text>{item.currentRating}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {matchStarted && <MatchComponent player1={player1} player2={player2} />}

        {player1 && !matchStarted ? (
          <View style={styles.lobbyContainer}>
            {player1 && (
              <View style={styles.lobbyPlayer}>
                <Text>{player1.name}</Text>
              </View>
            )}

            <Seperator otherStyles={{ backgroundColor: "white" }} />

            {player2 && (
              <View style={styles.lobbyPlayer}>
                <Text>{player2.name}</Text>
              </View>
            )}

            {player2 && (
              <View style={{ gap: 8 }}>
                <Text style={styles.text}>Target Points</Text>
                <View
                  style={{
                    backgroundColor: "black",
                    marginRight: 8,
                    padding: 2,
                    borderRadius: 4,
                    borderColor: "white",
                    borderWidth: 1,
                  }}
                >
                  <TextInput
                    placeholder="Enter name"
                    value={targetPoints}
                    onChangeText={(e) => {
                      setTargetPoints(e);
                    }}
                    style={{ color: "white", textAlign: "center" }}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.matchButton,
                !(player1 && player2) ? { opacity: 0.6 } : null,
              ]}
              disabled={!(player1 && player2)}
              onPress={() => {
                setMatchStarted(true);
                initializeTarget(parseInt(targetPoints, 10));
              }}
            >
              <Text style={[styles.text, styles.matchButtonText]}>
                Start Match
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.matchButton,
                { marginTop: 0, backgroundColor: "red" },
              ]}
              onPress={() => resetMatch()}
            >
              <Text style={[styles.text, styles.matchButtonText]}>
                Delete Lobby
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {matchStarted && status === "Complete" ? (
          <View style={{ marginTop: 24, gap: 8 }}>
            <Text style={[styles.text, { textAlign: "center", fontSize: 18 }]}>
              Winner: {winner === player1?.id ? player1?.name : player2?.name}
            </Text>

            <Text style={[styles.text, { textAlign: "center" }]}>
              {winner === player1?.id ? player1?.name : player2?.name}{" "}
              {winnerPlayer?.previousRating} to{" "}
              <Text style={{ color: "green" }}>
                {winnerPlayer?.currentRating}
              </Text>
            </Text>

            <Text style={[styles.text, { textAlign: "center" }]}>
              {loser === player1?.id ? player1?.name : player2?.name}{" "}
              {loserPlayer?.previousRating} to{" "}
              <Text style={{ color: "red" }}>{loserPlayer?.currentRating}</Text>
            </Text>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "green" }]}
              onPress={handleSubmitMatch}
            >
              <Text>Complete</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default CreateMatch;

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
      height: 40,
      backgroundColor: "gray",
      padding: 6,
      borderRadius: 8,
      justifyContent: "center",
    },

    seperator: {
      width: "100%",
      height: 1,
      backgroundColor: colorScheme === "dark" ? "gray" : "#333",
      marginVertical: 16,
    },

    addPlayerContainer: {
      width: "100%",
      flexDirection: "column",
      gap: 16,
      padding: 8,
    },

    playersViewContainer: {
      minHeight: 100,
      maxHeight: 250,
      padding: 8,
      borderColor: "white",
      borderWidth: 1,
      justifyContent: "center",
      borderRadius: 4,
    },

    playerContainer: {
      width: "100%",
      height: 30,
      backgroundColor: colorScheme === "dark" ? "gray" : "#333",
      borderRadius: 2,
      paddingVertical: 2,
      paddingHorizontal: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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

    lobbyContainer: {
      width: "100%",
      borderColor: "white",
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 12,
      borderRadius: 12,
      marginTop: 12,
      gap: 18,
      flexDirection: "column",
      justifyContent: "center",
    },

    lobbyPlayer: {
      width: "100%",
      backgroundColor: "gray",
      padding: 8,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
    },

    button: {
      padding: 2,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12,
      marginTop: 8,
    },
  });
};
