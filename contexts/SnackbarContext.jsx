import React, { createContext, useContext, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useTheme } from "react-native-paper";
import Text from "../components/Text";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(60000);
  const [actionLabel, setActionLabel] = useState("Close");
  const [onActionPress, setOnActionPress] = useState(() => () => {});

  const showSnackbar = (
    message,
    duration = 60000,
    actionLabel = "Close",
    onActionPress = () => {}
  ) => {
    setMessage(message);
    setDuration(duration);
    setActionLabel(actionLabel);
    setOnActionPress(() => onActionPress);
    setIsVisible(true);
  };

  const hideSnackbar = () => {
    setIsVisible(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        message={message}
        duration={duration}
        actionLabel={actionLabel}
        onActionPress={onActionPress}
        onDismissSnackbar={hideSnackbar}
        isVisible={isVisible}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

const Snackbar = ({
  message,
  duration = 60000,
  actionLabel = "Close",
  onActionPress,
  onDismissSnackbar,
  isVisible,
}) => {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const theme = useTheme();

  useEffect(() => {
    if (isVisible) {
      showSnackbar();
    }
  }, [isVisible]);

  const showSnackbar = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        hideSnackbar();
      }, duration);
    });
  };

  const hideSnackbar = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismissSnackbar?.();
    });
  };

  const handleActionPress = () => {
    hideSnackbar();
    onActionPress?.();
  };

  return isVisible ? (
    <Animated.View
      style={[styles.SnackbarContainer, styles.Bottom, { opacity: fadeAnim }]}
    >
      <View style={styles.SnackbarContentContainer}>
        <Text style={styles.MessageText}>{message}</Text>
        <TouchableOpacity onPress={handleActionPress}>
          <Text style={styles.ActionLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  ) : null;
};

const styles = StyleSheet.create({
  SnackbarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 50,
    borderRadius: 3,
    backgroundColor: "#EF6351",
    width: Dimensions.get("screen").width - 32,
  },
  Bottom: {
    bottom: 0,
  },
  SnackbarContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  MessageText: {
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
  },
  ActionLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 16,
  },
});
