import {
  ColorSchemeName,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { AntDesign, Entypo, Feather, FontAwesome6 } from "@expo/vector-icons";
import { Player } from "@/stores/playerStores";
import { usePlayerStore } from "@/stores";
import { useRouter } from "expo-router";

type PlayerComponentProps = {
  theme: typeof Colors.dark | typeof Colors.light;
  colorScheme: ColorSchemeName;
  containerStyles?: {};
  player: Player;
  editable?: boolean;
  deletable?: boolean;
  handleDeletePlayer?: (id: string) => Promise<void>;
  handleEditPlayer?: (id: string, name: string) => Promise<void>;
};

const PlayerComponent = ({
  theme,
  colorScheme,
  containerStyles,
  player,
  editable = false,
  deletable = false,
  handleDeletePlayer,
  handleEditPlayer,
}: PlayerComponentProps) => {
  const styles = generateStyles(theme, colorScheme);

  const [clickedId, setClickedId] = useState<string | undefined>(undefined);

  const [editName, setEditName] = useState(player.name);

  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.container, containerStyles]}
      onPress={() => router.push(`/player/${player.id}`)}
      disabled={editable || deletable}
    >
      {editable ? (
        <TouchableOpacity
          style={styles.rank}
          onPress={() => setClickedId(!clickedId ? player.id : undefined)}
        >
          <AntDesign name="edit" size={40} />
        </TouchableOpacity>
      ) : null}

      {deletable ? (
        <TouchableOpacity
          style={styles.rank}
          onPress={() => setClickedId(!clickedId ? player.id : undefined)}
        >
          <AntDesign name="deleteuser" size={40} />
        </TouchableOpacity>
      ) : null}

      {!editable && !deletable ? (
        <View style={styles.rank}>
          <Text style={{ fontSize: 22 }}>{player?.rank}</Text>
        </View>
      ) : null}

      <View style={styles.playerDetails}>
        {editable && clickedId ? (
          <View
            style={{
              flex: 1,
              backgroundColor: "gray",
              marginRight: 8,
              padding: 2,
              borderRadius: 4,
            }}
          >
            <TextInput
              placeholder="Enter name"
              value={editName}
              onChangeText={(e) => setEditName(e)}
            />
          </View>
        ) : (
          <Text style={[styles.text, { fontSize: 18 }]}>{player?.name}</Text>
        )}

        {editable ? (
          clickedId && editable ? (
            <View style={{ flexDirection: "row", padding: 4, gap: 12 }}>
              <Feather
                name="check"
                size={24}
                onPress={async () => {
                  await handleEditPlayer!(clickedId, editName);
                  setClickedId(undefined);
                  setEditName("");
                }}
                color={"green"}
              />
              <Entypo
                name="cross"
                size={24}
                onPress={() => {
                  setClickedId(undefined);
                  setEditName("");
                }}
                color={"red"}
              />
            </View>
          ) : null
        ) : null}

        {deletable ? (
          clickedId && deletable ? (
            <View style={{ flexDirection: "row", padding: 4, gap: 12 }}>
              <Feather
                name="check"
                size={24}
                onPress={async () => {
                  await handleDeletePlayer!(clickedId);
                  setClickedId(undefined);
                }}
                color={"green"}
              />
              <Entypo
                name="cross"
                size={24}
                onPress={() => {
                  setClickedId(undefined);
                }}
                color={"red"}
              />
            </View>
          ) : null
        ) : null}

        {!editable && !deletable ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={[styles.text, { fontSize: 18 }]}>
              {player?.currentRating}
            </Text>
            {player.currentRating - player.previousRating !== 0 ? (
              <View
                style={{
                  flexDirection: "column",
                  gap: 0,
                  justifyContent: "center",
                }}
              >
                <Entypo
                  name={`${
                    player.currentRating - player.previousRating < 0
                      ? "triangle-down"
                      : "triangle-up"
                  }`}
                  size={24}
                  color={
                    player.currentRating - player.previousRating < 0
                      ? "red"
                      : "green"
                  }
                  style={{ marginBottom: -3 }}
                />
                <Text
                  style={
                    player.currentRating - player.previousRating < 0
                      ? { color: "red" }
                      : { color: "green" }
                  }
                >
                  {player?.currentRating - player?.previousRating >= 0
                    ? "+"
                    : ""}
                  {player?.currentRating - player?.previousRating}
                </Text>
              </View>
            ) : (
              <FontAwesome6
                name={"equals"}
                size={12}
                color={"white"}
                style={{ marginBottom: -3 }}
              />
            )}
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default PlayerComponent;

const generateStyles = (
  theme: typeof Colors.dark | typeof Colors.light,
  colorScheme: ColorSchemeName
) => {
  return StyleSheet.create({
    container: {
      width: "100%",
      height: 80,
      backgroundColor: colorScheme === "dark" ? "#333" : "gray",
      paddingVertical: 8,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
    },

    text: {
      color: theme.text,
    },

    rank: {
      width: "20%",
      height: 80,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    },

    playerDetails: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
  });
};
