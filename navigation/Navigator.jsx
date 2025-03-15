import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useTheme } from "react-native-paper";


import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChildScreen from "../screens/ChildScreen";
import ChildDetailsScreen from "../screens/ChildDetailsScreen";
import LoginScreen from "../screens/LoginScreen"; 
import SignupScreen from "../screens/SignupScreen"; 


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


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


const ChildStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTitleStyle: { fontFamily: "GothamRnd-Medium", fontSize: 20 },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="ChildTab"
        component={ChildScreen}
        options={{ headerShown: false }}
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

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === "Home") {
              return <AntDesign name="home" size={size} color={color} />;
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
          tabBarStyle: { backgroundColor: theme.colors.primary },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#f9f7f5",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTitleStyle: { fontFamily: "GothamRnd-Medium", fontSize: 20 },
          tabBarLabelStyle: { fontFamily: "GothamRnd-Medium", fontSize: 10 },
          headerTintColor: "white",
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ headerShown: false }}
        />
        {isAuthenticated && (
          <>
            <Tab.Screen name="Child" component={ChildStack} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </>
        )}
        {!isAuthenticated && (
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
