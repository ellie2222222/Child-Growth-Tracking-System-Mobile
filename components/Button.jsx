import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "react-native-paper";

const Button = ({ 
  title, 
  onPress, 
  variant = "default", 
  textVariant = "medium", 
  style 
}) => {
  const theme = useTheme();

  const isTextVariant = variant === "text";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          marginVertical: 10,
          paddingVertical: 12,
          borderBottomWidth: isTextVariant ? 1 : 0,
          borderBottomColor: isTextVariant ? "black" : "transparent",
          backgroundColor: isTextVariant ? "transparent" : theme.colors.primary,
          borderRadius: isTextVariant ? 0 : 6,
          paddingHorizontal: isTextVariant ? 0 : 16,
          alignItems: isTextVariant ? "flex-start" : "center",
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: theme.fonts[textVariant]?.fontFamily || theme.fonts.medium.fontFamily,
          fontSize: 16,
          color: isTextVariant ? "black" : "white",
          textAlign: "left",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
