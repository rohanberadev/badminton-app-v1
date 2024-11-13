import { Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/Colors";
import { Appearance } from "react-native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = Appearance.getColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="createMatch"
        options={{
          title: "Match",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name={focused ? "plus-square" : "plus-square-o"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="admin"
        options={{
          title: "Admin",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "code-slash" : "code-slash-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
