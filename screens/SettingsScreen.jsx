import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import TextComponent from "../components/Text"; // Renamed to avoid conflict with Text
import Title from "../components/Title";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "../contexts/SnackbarContext";
import api from "../configs/api";

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [name] = useState(user.name);
  const [email] = useState(user.email);
  const navigation = useNavigation();
  const { showSnackbar } = useSnackbar();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      showSnackbar("Password changed successfully!", 3000, "Close");
      setIsPasswordModalVisible(false);
      await dispatch(logout()).unwrap();
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.validationErrors && Array.isArray(data.validationErrors)) {
          data.validationErrors.forEach((err) => {
            showSnackbar(err.error || "Validation error occurred", 5000, "Close");
          });
        } else {
          showSnackbar(
            data.message || "Failed to change password. Please try again.",
            5000,
            "Close"
          );
        }
      } else {
        showSnackbar("Network error. Please try again.", 5000, "Close");
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Icon size={80} icon="account" style={styles.avatar} />
          <View style={styles.userDetails}>
            <TextComponent variant="medium" style={styles.userName}>
              {name}
            </TextComponent>
            <TextComponent variant="medium" style={styles.userEmail}>
              {email}
            </TextComponent>
          </View>
        </View>

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
            onPress={() => setIsPasswordModalVisible(true)}
          />
        </View>

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
            navigation.navigate("Login");
          }}
          style={styles.logoutButton}
        />
      </ScrollView>

      {/* Password Change Modal */}
      <Modal
        visible={isPasswordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Title
              text="Change Password"
              style={[
                styles.sectionTitle,
                { fontFamily: theme.fonts.medium.fontFamily, marginBottom: 20 },
              ]}
            />
            <TextInput
              style={styles.input(theme)}
              placeholder="Old Password"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              style={styles.input(theme)}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton(theme)}
                onPress={handleChangePassword}
              >
                <Text style={styles.modalButtonText(theme)}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelButton(theme)}
                onPress={() => setIsPasswordModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText(theme)}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  scrollViewContent: {
    padding: 20,
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
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  input: (theme) => ({
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: (theme) => ({
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  }),
  modalCancelButton: (theme) => ({
    backgroundColor: theme.colors.surface,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: "center",
  }),
  modalButtonText: (theme) => ({
    color: "white",
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  modalCancelButtonText: (theme) => ({
    color: theme.colors.primary,
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
});

export default SettingsScreen;