import React from "react";
import { Stack } from "expo-router";

const AdminLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="addPlayer" options={{ headerShown: false }} />
      <Stack.Screen name="editPlayer" options={{ headerShown: false }} />
      <Stack.Screen name="deletePlayer" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AdminLayout;
