import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChildScreen from "../screens/ChildScreen";
import ChildDetailsScreen from "../screens/ChildDetailsScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import BlogsScreen from "../screens/Blog/BlogsScreen";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { BlogDetailedScreen } from "../screens/Blog/BlogDetailedScreen";
import { FAQsScreen } from "../screens/FAQ/FAQsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ChildStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTitleStyle: { fontFamily: "GothamRnd-Medium", fontSize: 20 },
        headerTintColor: "white",
      }}>
      <Stack.Screen
        name="ChildTab"
        component={ChildScreen}
        options={{ title: "Child" }}
      />
      <Stack.Screen
        name="ChildDetails"
        component={ChildDetailsScreen}
        options={{ title: "Child Details" }}
      />
    </Stack.Navigator>
  );
};

const Navigator = ({ isAuthenticated }) => {
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
        {isAuthenticated ? (
          <>
            <Tab.Screen
              name="Child"
              component={ChildStack}
              options={{ headerShown: false }}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsStack}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome6 name="gear" size={size} color={color} />
                ),
              }}
            />
          </>
        ) : (
          <>
            <Tab.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="log-in-outline" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Signup"
              component={SignupScreen}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="person-add-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
