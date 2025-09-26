import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007EFF",
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Store",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6
              name="shop"
              size={24}
              color={focused ? "#007EFF" : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6
              name="opencart"
              size={24}
              color={focused ? "#007EFF" : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
