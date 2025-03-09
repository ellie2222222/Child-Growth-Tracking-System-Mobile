import React from "react";
import { Text as PaperText } from "react-native";
import { useTheme } from "react-native-paper";

const Text = ({ children, variant = "regular", style }) => {
  const theme = useTheme();

  return (
    <PaperText style={[{ fontFamily: theme.fonts[variant].fontFamily }, style]}>
      {children}
    </PaperText>
  );
};

export default Text;
