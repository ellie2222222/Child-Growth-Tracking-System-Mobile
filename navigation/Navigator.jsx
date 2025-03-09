import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';

// Import Screens
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";

// Create Navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator for Home
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator
const Navigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === "Home") {
              return (
                <AntDesign name="home" size={size} color={color} />
              );
            } else if (route.name === "Settings") {
              return (
                <Ionicons name="settings-outline" size={size} color={color} />
              );
            } else if (route.name === "Child") {
              return (
                <MaterialCommunityIcons
                  name="baby-face-outline"
                  size={size}
                  color={color}
                />
              );
            }
          },
          tabBarStyle: { backgroundColor: '#F4D8CE' },
          tabBarActiveTintColor: '#EF6351',
          tabBarInactiveTintColor: 'gray',
          headerStyle: { backgroundColor: '#F4D8CE' },
          headerTitleStyle: { fontFamily: "GothamRnd-Medium", fontSize: 20 },
          tabBarLabelStyle: { fontFamily: "GothamRnd-Medium", fontSize: 10 },
          headerTintColor: '#000',
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Child"
          component={HomeStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
