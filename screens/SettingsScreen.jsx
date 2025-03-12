import React, { useState } from "react";
import { View } from "react-native";
import { Avatar, Divider, useTheme } from "react-native-paper";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import Text from "../components/Text";
import Title from "../components/Title";
import Button from "../components/Button";

const SettingsScreen = () => {
  const theme = useTheme();
  console.log(theme)
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#FFF" }}>
      
      <View style={{ backgroundColor: theme.colors.secondary, borderRadius: 10, padding: 15, marginBottom: 20, flexDirection: "row", alignItems: "center", gap: 20 }}>
        <Avatar.Image size={80} source={{ uri: "https://i.pravatar.cc/300" }} />
        <View style={{ display: "flex", gap: 10 }}>
          <Text variant="medium" style={{ fontSize: 18 }}>{name}</Text>
          <Text variant="medium" style={{ fontSize: 14, color: "gray" }}>{email}</Text>
        </View>
      </View>

      <View style={{ backgroundColor: theme.colors.secondary, borderRadius: 10, padding: 15, marginBottom: 20 }}>
        <Title text="Your Data" style={{ fontSize: 20, textAlign: "left" }}/>
        <Button variant="text" textVariant="regular" title="Your Information" onPress={() => console.log("Your Info")} />
        <Button variant="text" textVariant="regular" title="Export Data" onPress={() => console.log("Export Data")} />
      </View>

      <View style={{ backgroundColor: theme.colors.secondary, borderRadius: 10, padding: 15 }}>
        <Title text="Support" style={{ fontSize: 20, textAlign: "left" }}/>
        <Button variant="text" textVariant="regular" title="About App" onPress={() => console.log("About App")} />
        <Button variant="text" textVariant="regular" title="Contact Support" onPress={() => console.log("Contact Support")} />
        
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 15, gap: 20 }}>
          <FontAwesome6 name="facebook-f" size={24} color={theme.colors.primary} />
          <FontAwesome6 name="discord" size={24} color={theme.colors.primary} />
          <FontAwesome6 name="instagram" size={24} color={theme.colors.primary}  />
          <FontAwesome6 name="x-twitter" size={24} color={theme.colors.primary} />
        </View>
      </View>
      
    </View>
  );
};

export default SettingsScreen;
