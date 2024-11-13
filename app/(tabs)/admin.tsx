import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  Appearance,
  ColorSchemeName,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = generateStyles(theme, colorScheme);

  const Seperator = ({ otherStyles }: { otherStyles?: {} }) => (
    <View style={[styles.seperator, otherStyles]}></View>
  );

  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={[styles.text, { fontSize: 22, textAlign: "center" }]}>
          Admin Panel
        </Text>

        <Seperator />

        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => router.push("/(admin)/addPlayer")}
        >
          <View style={styles.icons}>
            <AntDesign name="adduser" size={60} />
          </View>

          <View style={styles.description}>
            <Text style={[styles.text, { fontSize: 18, fontWeight: "700" }]}>
              Add new players.
            </Text>
          </View>
        </TouchableOpacity>

        <Seperator />

        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => router.push("/(admin)/editPlayer")}
        >
          <View style={styles.icons}>
            <AntDesign name="edit" size={60} />
          </View>

          <View style={styles.description}>
            <Text style={[styles.text, { fontSize: 18, fontWeight: "700" }]}>
              Edit any player.
            </Text>
          </View>
        </TouchableOpacity>

        <Seperator />

        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => router.push("/(admin)/deletePlayer")}
        >
          <View style={styles.icons}>
            <AntDesign name="deleteuser" size={60} />
          </View>

          <View style={styles.description}>
            <Text style={[styles.text, { fontSize: 18, fontWeight: "700" }]}>
              Delete any player.
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
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

    optionContainer: {
      width: "100%",
      height: 150,
      borderColor: "gray",
      borderWidth: 2,
      marginVertical: 16,
      borderRadius: 8,
      flexDirection: "row",
    },

    icons: {
      width: "30%",
      height: "100%",
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    },

    description: {
      padding: 8,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
