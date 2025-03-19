import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, useTheme } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChildScreen from "../screens/ChildScreen";
import ChildDetailsScreen from "../screens/ChildDetailsScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import BlogsScreen from "../screens/Blog/BlogsScreen";
import { BlogDetailedScreen } from "../screens/Blog/BlogDetailedScreen";
import { FAQsScreen } from "../screens/FAQ/FAQsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const getHeaderStyles = (theme) => ({
  headerStyle: { backgroundColor: theme.colors.primary },
  headerTitleStyle: { fontFamily: "GothamRnd-Medium", fontSize: 20 },
  headerTintColor: "white",
});

const getTabBarStyles = (theme) => ({
  tabBarStyle: {
    backgroundColor: theme.colors.primary,
    borderTopWidth: 0,
    elevation: 5,
  },
  tabBarActiveTintColor: "white",
  tabBarInactiveTintColor: "#f9f7f5",
  tabBarLabelStyle: {
    fontFamily: "GothamRnd-Medium",
    fontSize: 10,
    marginBottom: 2,
  },
});

const getTabIcon = (route, focused, color, size) => {
  switch (route.name) {
    case "Home":
      return <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />;
    case "SettingsTab":
      return <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={color} />;
    case "Child":
      return <MaterialCommunityIcons name={focused ? "baby-face" : "baby-face-outline"} size={size} color={color} />;
    case "Login":
      return <Ionicons name="log-in-outline" size={size} color={color} />;
    case "Signup":
      return <Ionicons name="person-add-outline" size={size} color={color} />;
    default:
      return null;
  }
};

const ChildStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator screenOptions={getHeaderStyles(theme)}>
      <Stack.Screen name="ChildTab" component={ChildScreen} options={{ title: "Child" }} />
      <Stack.Screen name="ChildDetails" component={ChildDetailsScreen} options={{ title: "Child Details" }} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeTab" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Blogs" component={BlogsScreen} options={getHeaderStyles(theme)} />
      <Stack.Screen
        name="BlogDetailed"
        component={BlogDetailedScreen}
        options={{ ...getHeaderStyles(theme), headerTitle: "" }}
      />
      <Stack.Screen name="FAQs" component={FAQsScreen} options={getHeaderStyles(theme)} />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator initialRouteName="NestedSettings" screenOptions={getHeaderStyles(theme)}>
      <Stack.Screen name="NestedSettings" component={SettingsScreen} options={{ headerTitle: "Settings" }} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const Navigator = ({ isAuthenticated, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => getTabIcon(route, focused, color, size),
          ...getTabBarStyles(theme),
          ...getHeaderStyles(theme),
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
        {isAuthenticated ? (
          <>
            <Tab.Screen name="Child" component={ChildStack} options={{ headerShown: false }} />
            <Tab.Screen
              name="Settings"
              component={SettingsStack}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => <FontAwesome6 name="gear" size={size} color={color} />,
              }}
            />
          </>
        ) : (
          <>
            <Tab.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Tab.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;