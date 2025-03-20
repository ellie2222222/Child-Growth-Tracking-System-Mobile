import React from "react";
import { View, ActivityIndicator } from "react-native";
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
import { BlogDetailedScreen } from "../screens/Blog/BlogDetailedScreen";
import { FAQsScreen } from "../screens/FAQ/FAQsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import MemberConsultationRequest from "../screens/ConsultationRequest/Member/MemberConsultationRequest";
import MemberConsultationHistory from "../screens/ConsultationHistory/Member/MemberConsultationHistory";
import MemberConsultationChat from "../screens/ConsultationHistory/Member/MemberConsultationChat";
import DoctorConsultationRequest from "../screens/ConsultationRequest/Doctor/DoctorConsultationRequest";
import DoctorConsultationHistory from "../screens/ConsultationHistory/Doctor/DoctorConsultationHistory.jsx";
import DoctorConsultationChat from "../screens/ConsultationHistory/Doctor/DoctorConsultationChat";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Reusable header and tab bar styles
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
      return (
        <Ionicons
          name={focused ? "home" : "home-outline"}
          size={size}
          color={color}
        />
      );
    case "Child":
      return (
        <MaterialCommunityIcons
          name={focused ? "baby-face" : "baby-face-outline"}
          size={size}
          color={color}
        />
      );
    case "Settings":
      return (
        <Ionicons
          name={focused ? "settings" : "settings-outline"}
          size={size}
          color={color}
        />
      );
    case "ConsultationRequest":
      return (
        <Ionicons
          name={focused ? "calendar" : "calendar-outline"}
          size={size}
          color={color}
        />
      );
    case "ConsultationHistory":
      return (
        <Ionicons
          name={focused ? "albums" : "albums-outline"}
          size={size}
          color={color}
        />
      );
    case "Login":
      return <Ionicons name="log-in-outline" size={size} color={color} />;
    case "Signup":
      return <Ionicons name="person-add-outline" size={size} color={color} />;
    default:
      return null;
  }
};

// Stack Navigators
const ChildStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator screenOptions={getHeaderStyles(theme)}>
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

const HomeStack = () => {
  const theme = useTheme();
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
        options={getHeaderStyles(theme)}
      />
      <Stack.Screen
        name="BlogDetailed"
        component={BlogDetailedScreen}
        options={{ ...getHeaderStyles(theme), headerTitle: "" }}
      />
      <Stack.Screen
        name="FAQs"
        component={FAQsScreen}
        options={getHeaderStyles(theme)}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="NestedSettings"
      screenOptions={getHeaderStyles(theme)}
    >
      <Stack.Screen
        name="NestedSettings"
        component={SettingsScreen}
        options={{ headerTitle: "Settings" }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const MemberConsultationStacks = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="NestedConsultationHistory"
      screenOptions={getHeaderStyles(theme)}
    >
      <Stack.Screen
        name="NestedConsultationHistory"
        component={MemberConsultationHistory}
        options={{ headerTitle: "Consultation History" }}
      />
      <Stack.Screen
        name="MemberConsultationChat"
        component={MemberConsultationChat}
        options={{ headerTitle: "Consultation Chat" }}
      />
    </Stack.Navigator>
  );
};

const DoctorConsultationStacks = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="NestedConsultationHistory"
      screenOptions={getHeaderStyles(theme)}
    >
      <Stack.Screen
        name="NestedConsultationHistory"
        component={DoctorConsultationHistory}
        options={{ headerTitle: "Consultation History" }}
      />
      <Stack.Screen
        name="DoctorConsultationChat"
        component={DoctorConsultationChat}
        options={{ headerTitle: "Consultation Chat" }}
      />
    </Stack.Navigator>
  );
};

const Navigator = ({ isAuthenticated, loading, user }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) =>
            getTabIcon(route, focused, color, size),
          ...getTabBarStyles(theme),
          ...getHeaderStyles(theme),
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ headerShown: false }}
        />
        {isAuthenticated ? (
          user?.role === 0 ? (
            // Member tabs (includes Child)
            <>
              <Tab.Screen
                name="Child"
                component={ChildStack}
                options={{ headerShown: false }}
              />
              <Tab.Screen
                name="ConsultationRequest"
                component={MemberConsultationRequest}
                options={{
                  headerShown: true,
                  tabBarLabel: "Request",
                  title: "Consultation Request",
                }}
              />
              <Tab.Screen
                name="ConsultationHistory"
                component={MemberConsultationStacks}
                options={{
                  headerShown: false,
                  tabBarLabel: "History",
                }}
              />
              <Tab.Screen
                name="Settings"
                component={SettingsStack}
                options={{ headerShown: false }}
              />
            </>
          ) : user?.role === 2 ? (
            // Doctor tabs (excludes Child)
            <>
              <Tab.Screen
                name="ConsultationRequest"
                component={DoctorConsultationRequest}
                options={{
                  headerShown: true,
                  tabBarLabel: "Request",
                  title: "Consultation Request",
                }}
              />
              <Tab.Screen
                name="ConsultationHistory"
                component={DoctorConsultationStacks}
                options={{
                  headerShown: false,
                  tabBarLabel: "History",
                }}
              />
              <Tab.Screen
                name="Settings"
                component={SettingsStack}
                options={{ headerShown: false }}
              />
            </>
          ) : null
        ) : (
          <>
            <Tab.Screen name="Login" component={LoginScreen} />
            <Tab.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
