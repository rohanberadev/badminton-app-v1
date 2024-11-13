import {
  Appearance,
  ColorSchemeName,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useMatchStore } from "@/stores";
import { AntDesign } from "@expo/vector-icons";

type MatchPlayer = {
  id: string;
  name: string;
  points: number;
};

const MatchComponent = ({
  player1,
  player2,
}: {
  player1: MatchPlayer | null;
  player2: MatchPlayer | null;
}) => {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = generateStyles(theme, colorScheme);

  const {
    setMatchStarted,
    resetMatch,
    incrementPlayer1Point,
    decrementPlayer1Point,
    incrementPlayer2Point,
    decrementPlayer2Point,
    target,
    setTarget,
    resetPoints,
    setStatus,
    setWinner,
    setLoser,
    setPlayer1Points,
    setPlayer2Points,
    status,
  } = useMatchStore();

  const Seperator = ({ otherStyles }: { otherStyles?: {} }) => (
    <View style={[styles.seperator, otherStyles]}></View>
  );

  const [editClicked, setEditClicked] = useState(false);

  const [editedPlayer1Point, setEditedPlayer1Point] = useState(
    player1?.points!.toString()
  );
  const [editedPlayer2Point, setEditedPlayer2Point] = useState(
    player2?.points!.toString()
  );

  useEffect(() => {
    if (player1?.points! >= target || player2?.points! >= target) {
      const pointDiff = Math.abs(player1?.points! - player2?.points!);
      const isDeuce = pointDiff < 2;

      if (isDeuce) {
        setTarget(pointDiff === 0 ? target + 2 : target + 1);
      } else {
        if (player1?.points! > player2?.points!) {
          setWinner(player1?.id!);
          setLoser(player2?.id!);
        } else if (player1?.points! < player2?.points!) {
          setWinner(player2?.id!);
          setLoser(player1?.id!);
        }

        setStatus("Complete");
      }
    }
  }, [player1?.points!, player2?.points!]);

  return (
    <View style={styles.matchContainer}>
      <View
        style={{
          marginBottom: 18,
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 18,
        }}
      >
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: "red" },
            editClicked ? { opacity: 0.5 } : null,
          ]}
          onPress={() => {
            resetMatch();
            setMatchStarted(false);
          }}
          disabled={editClicked}
        >
          <Text>End Match</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: "orange" },
            editClicked ? { opacity: 0.5 } : null,
          ]}
          onPress={() => {
            resetPoints();
            setStatus("Ongoing");
          }}
          disabled={editClicked}
        >
          <Text>Reset Match</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "white" }]}
          onPress={() => {
            setEditClicked(!editClicked);
          }}
        >
          <Text>Edit Match</Text>
        </TouchableOpacity>
      </View>
      {!editClicked && (
        <>
          <View style={styles.matchPlayerContainer}>
            <Text style={[styles.text, { fontSize: 18 }]}>{player1?.name}</Text>

            <Seperator />

            <View style={styles.pointHandler}>
              <TouchableOpacity
                style={[
                  styles.pointPlus,
                  status === "Complete" ? { opacity: 0.4 } : null,
                ]}
                onPress={() => incrementPlayer1Point()}
                disabled={status === "Complete"}
              >
                <AntDesign name="plus" size={32} color={"white"} />
              </TouchableOpacity>

              <View style={styles.matchPointPreview}>
                <Text style={{ fontSize: 18 }}>{player1?.points}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.pointMinus,
                  player1?.points! === 0 ? { opacity: 0.4 } : null,
                  status === "Complete" ? { opacity: 0.4 } : null,
                ]}
                onPress={() =>
                  player1?.points! > 0 ? decrementPlayer1Point() : null
                }
                disabled={player1?.points! === 0 || status === "Complete"}
              >
                <AntDesign name="minus" size={32} color={"white"} />
              </TouchableOpacity>
            </View>
          </View>

          <Seperator
            otherStyles={
              colorScheme === "dark" ? { backgroundColor: "black" } : {}
            }
          />

          <View style={styles.matchPlayerContainer}>
            <Text style={[styles.text, { fontSize: 18 }]}>{player2?.name}</Text>

            <Seperator />

            <View style={styles.pointHandler}>
              <TouchableOpacity
                style={[
                  styles.pointPlus,
                  status === "Complete" ? { opacity: 0.4 } : null,
                ]}
                onPress={() => incrementPlayer2Point()}
                disabled={status === "Complete"}
              >
                <AntDesign name="plus" size={32} color={"white"} />
              </TouchableOpacity>

              <View style={styles.matchPointPreview}>
                <Text style={{ fontSize: 18 }}>{player2?.points}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.pointMinus,
                  player2?.points! === 0 ? { opacity: 0.4 } : null,
                  status === "Complete" ? { opacity: 0.4 } : null,
                ]}
                onPress={() =>
                  player2?.points! > 0 ? decrementPlayer2Point() : null
                }
                disabled={player2?.points! === 0 || status === "Complete"}
              >
                <AntDesign name="minus" size={32} color={"white"} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{ textAlign: "center", marginTop: 8 }}>
            Target: {target}
          </Text>
        </>
      )}

      {editClicked && (
        <View style={{ flex: 1, gap: 8 }}>
          <Text style={{ fontSize: 18 }}>{player1?.name}</Text>
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: 4,
              borderRadius: 8,
              borderColor: "black",
              borderWidth: 1,
            }}
          >
            <TextInput
              placeholder="Enter Points"
              value={editedPlayer1Point}
              keyboardType="numeric"
              onChangeText={(e) => setEditedPlayer1Point(e)}
            />
          </View>

          <Text style={{ fontSize: 18, marginTop: 18 }}>{player2?.name}</Text>
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: 4,
              borderRadius: 8,
              borderColor: "black",
              borderWidth: 1,
            }}
          >
            <TextInput
              placeholder="Enter Points"
              value={editedPlayer2Point}
              keyboardType="numeric"
              onChangeText={(e) => setEditedPlayer2Point(e)}
            />
          </View>

          <Text style={{ fontSize: 18, marginTop: 18 }}>Target</Text>
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: 4,
              borderRadius: 8,
              borderColor: "black",
              borderWidth: 1,
            }}
          >
            <TextInput
              placeholder="Enter Points"
              value={target.toString()}
              keyboardType="numeric"
            />
          </View>

          <View
            style={{
              width: "100%",
              marginTop: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: "40%",
                backgroundColor: "green",
                padding: 4,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setPlayer1Points(parseInt(editedPlayer1Point!, 10));
                setPlayer2Points(parseInt(editedPlayer2Point!, 10));
                setTarget(target);
                setEditClicked(false);
              }}
            >
              <Text>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "40%",
                backgroundColor: "#FF033E",
                padding: 4,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setEditClicked(false)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default MatchComponent;

const generateStyles = (
  theme: typeof Colors.dark | typeof Colors.light,
  colorScheme: ColorSchemeName
) => {
  return StyleSheet.create({
    text: {
      color: theme.text,
    },

    seperator: {
      width: "100%",
      height: 1,
      backgroundColor: colorScheme === "dark" ? "gray" : "#333",
      marginVertical: 16,
    },

    matchContainer: {
      width: "100%",
      height: 400,
      backgroundColor: colorScheme === "dark" ? "gray" : "#333",
      borderRadius: 8,
      flexDirection: "column",
      justifyContent: "space-between",
      padding: 12,
    },

    matchPlayerContainer: {
      flex: 1,
      backgroundColor: "#333",
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-evenly",
    },

    pointHandler: {
      width: "100%",
      height: 50,
      position: "relative",
    },

    pointPlus: {
      width: "50%",
      height: 50,
      backgroundColor: "green",
      position: "absolute",
      left: 0,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },

    pointMinus: {
      width: "50%",
      height: 50,
      backgroundColor: "red",
      position: "absolute",
      right: 0,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },

    matchPointPreview: {
      width: 50,
      height: 50,
      borderRadius: 90,
      backgroundColor: "white",
      position: "absolute",
      left: "50%",
      zIndex: 10,
      transform: [{ translateX: -25 }],
      justifyContent: "center",
      alignItems: "center",
    },

    button: {
      padding: 4,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12,
    },
  });
};
