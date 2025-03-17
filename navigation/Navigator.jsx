import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

// Import Screens
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { useTheme } from "react-native-paper";
import ChildScreen from "../screens/ChildScreen";
import ProfileScreen from "../screens/ProfileScreen";
import BlogDetailedScreen from "../screens/Blog/BlogDetailedScreen";
import BlogsScreen from "../screens/Blog/BlogsScreen";
import FAQsScreen from "../screens/FAQ/FAQScreen";

const Navigator = () => {
  const theme = useTheme();

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
        <Stack.Screen
          name="Blogs"
          component={BlogsScreen}
          options={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTitleStyle: { fontFamily: "GothamRnd-Medium", fontSize: 20 },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="BlogDetailed"
          component={BlogDetailedScreen}
          options={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTitleStyle: { fontFamily: "GothamRnd-Medium", fontSize: 20 },
            headerTintColor: "white",
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="FAQs"
          component={FAQsScreen}
          options={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTitleStyle: { fontFamily: "GothamRnd-Medium", fontSize: 20 },
            headerTintColor: "white",
          }}
        />
      </Stack.Navigator>
    );
  };

  const SettingsStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="Settings"
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTitleStyle: { fontFamily: "GothamRnd-Medium", fontSize: 20 },
          headerTintColor: "white",
        }}>
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "Home") {
              return (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "SettingsTab") {
              return (
                <Ionicons
                  name={focused ? "settings" : "settings-outline"}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "Child") {
              return (
                <MaterialCommunityIcons
                  name={focused ? "baby-face" : "baby-face-outline"}
                  size={size}
                  color={color}
                />
              );
            }
          },
          tabBarStyle: {
            backgroundColor: theme.colors.primary,
            borderTopWidth: 0,
            elevation: 5,
          },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#f9f7f5",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTitleStyle: { fontFamily: "GothamRnd-Medium", fontSize: 20 },
          tabBarLabelStyle: {
            fontFamily: "GothamRnd-Medium",
            fontSize: 10,
            marginBottom: 2,
          },
          headerTintColor: "white",
        })}>
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Child"
          component={ChildScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsStack}
          options={{ headerShown: false, title: "Settings" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
