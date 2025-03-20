import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import Text from "../components/Text";
import Title from "../components/Title";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../features/authSlice";
import { useDispatch } from "react-redux";
import { useSnackbar } from "../contexts/SnackbarContext";

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [name] = useState("John Doe");
  const [email] = useState("john@example.com");
  const navigation = useNavigation();
  const { showSnackbar } = useSnackbar();

  const handleChangePassword = () => {
    console.log("Change Password pressed");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <Avatar.Image
            size={80}
            source={{ uri: "https://i.pravatar.cc/300" }}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <Text variant="medium" style={styles.userName}>
              {name}
            </Text>
            <Text variant="medium" style={styles.userEmail}>
              {email}
            </Text>
          </View>
        </View>

        {/* Your Data Section */}
        <View style={styles.section}>
          <Title
            text="Profile"
            style={[
              styles.sectionTitle,
              { fontFamily: theme.fonts.medium.fontFamily },
            ]}
          />
          <Button
            variant="text"
            textVariant="regular"
            title="Your Information"
            onPress={() => navigation.navigate("Profile")}
          />
          <Button
            variant="text"
            textVariant="regular"
            title="Export Data"
            onPress={() => console.log("Export Data")}
          />
        </View>

        {/* Security Section (Change Password) */}
        <View style={styles.section}>
          <Title
            text="Privacy"
            style={[
              styles.sectionTitle,
              { fontFamily: theme.fonts.medium.fontFamily },
            ]}
          />
          <Button
            variant="text"
            textVariant="regular"
            title="Change Password"
            onPress={handleChangePassword}
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Title
            text="Support"
            style={[
              styles.sectionTitle,
              { fontFamily: theme.fonts.medium.fontFamily },
            ]}
          />
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

          <View style={styles.socialIcons}>
            <FontAwesome6
              name="facebook-f"
              size={24}
              color={theme.colors.primary}
            />
            <FontAwesome6
              name="discord"
              size={24}
              color={theme.colors.primary}
            />
            <FontAwesome6
              name="instagram"
              size={24}
              color={theme.colors.primary}
            />
            <FontAwesome6
              name="x-twitter"
              size={24}
              color={theme.colors.primary}
            />
          </View>
        </View>

        <Button
          variant="contained"
          title="Log Out"
          onPress={async () => {
            await dispatch(logout()).unwrap();
            showSnackbar("Logout success", 5000, "Close");
          }}
          style={styles.logoutButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    backgroundColor: "#F5F6FA",
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40,
    paddingBottom: 40,
  },
  userInfoSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    elevation: 3,
    elevation: 3,
  },
  avatar: {
    marginRight: 15,
  },
  userDetails: {
    display: "flex",
    gap: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "gray",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    textAlign: "left",
    color: "#333",
    fontWeight: "bold",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 20,
  },
  logoutButton: {
    borderRadius: 50,
  },
});

export default SettingsScreen;
