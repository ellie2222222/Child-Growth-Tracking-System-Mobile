import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Text from "../components/Text";
import Title from "../components/Title";
import Button from "../components/Button";
import api from "../configs/api";
import { logout } from "../features/authSlice"; 
import { useSnackbar } from "../contexts/SnackbarContext";

const SettingsScreen = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); 
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(user);
  const { showSnackbar } = useSnackbar();

  
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); 
      dispatch(logout()); 
      showSnackbar(
        "Logout success",
        5000,
        "Close"
      );
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#FFF" }}>
      {/* User Profile Section */}
      <View
        style={{
          backgroundColor: theme.colors.secondary,
          borderRadius: 10,
          padding: 15,
          marginBottom: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Avatar.Image
          size={80}
          source={{ uri: userData?.avatar || "https://i.pravatar.cc/300" }}
        />
        <View style={{ display: "flex", gap: 10 }}>
          <Text variant="medium" style={{ fontSize: 18 }}>
            {userData?.name || "John Doe"}
          </Text>
          <Text variant="medium" style={{ fontSize: 14, color: "gray" }}>
            {userData?.email || "john@example.com"}
          </Text>
        </View>
      </View>

      {/* Your Data Section */}
      <View
        style={{
          backgroundColor: theme.colors.secondary,
          borderRadius: 10,
          padding: 15,
          marginBottom: 20,
        }}
      >
        <Title text="Your Data" style={{ fontSize: 20, textAlign: "left" }} />
        <Button
          variant="text"
          textVariant="regular"
          title="Your Information"
          onPress={() => console.log("Your Info")}
        />
        <Button
          variant="text"
          textVariant="regular"
          title="Export Data"
          onPress={() => console.log("Export Data")}
        />
      </View>

      {/* Support Section */}
      <View
        style={{
          backgroundColor: theme.colors.secondary,
          borderRadius: 10,
          padding: 15,
        }}
      >
        <Title text="Support" style={{ fontSize: 20, textAlign: "left" }} />
        <Button
          variant="text"
          textVariant="regular"
          title="About App"
          onPress={() => console.log("About App")}
        />
        <Button
          variant="text"
          textVariant="regular"
          title="Contact Support"
          onPress={() => console.log("Contact Support")}
        />

        {/* Social Media Icons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 15,
            gap: 20,
          }}
        >
          <FontAwesome6 name="facebook-f" size={24} color={theme.colors.primary} />
          <FontAwesome6 name="discord" size={24} color={theme.colors.primary} />
          <FontAwesome6 name="instagram" size={24} color={theme.colors.primary} />
          <FontAwesome6 name="x-twitter" size={24} color={theme.colors.primary} />
        </View>
      </View>

      {/* Log Out Button */}
      <Button
        variant="contained"
        textVariant="medium"
        title="Log Out"
        onPress={handleLogout}
      />
    </View>
  );
};

export default SettingsScreen;