import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import Navigator from "./navigation/Navigator";
import { fetchUserCredentials } from "./features/authSlice";
import store from "./store";

SplashScreen.preventAutoHideAsync();

const AuthWrapper = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserCredentials());
  }, [dispatch]);

  if (loading) {
    return null;
  }

  return <Navigator isAuthenticated={isAuthenticated} user={user} loading={loading} error={error} />;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    "GothamRnd-Bold": require("./assets/fonts/gothamrnd_bold.otf"),
    "GothamRnd-Medium": require("./assets/fonts/gothamrnd_medium.otf"),
    "GothamRnd-Regular": require("./assets/fonts/gothamrnd_book.otf"),
    "GothamRnd-Light": require("./assets/fonts/gothamrnd_light.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  SplashScreen.hideAsync();

  const theme = {
    ...DefaultTheme,
    colors: {
      primary: "#EF6351",
      secondary: "#f4d8ce",
      lightWhite: "#f9f7f5",
      error: "red",
      background: "white",
      text: "black"
    },
    fonts: {
      light: { fontFamily: "GothamRnd-Light", fontWeight: "300" },
      regular: { fontFamily: "GothamRnd-Regular", fontWeight: "500" },
      medium: { fontFamily: "GothamRnd-Medium", fontWeight: "600" },
      bold: { fontFamily: "GothamRnd-Bold", fontWeight: "700" },
      titleSmall: { fontFamily: "GothamRnd-Medium", fontWeight: "300" },
      titleMedium: { fontFamily: "GothamRnd-Medium", fontWeight: "600" },
      titleLarge: { fontFamily: "GothamRnd-Medium", fontWeight: "700" },
      bodySmall: { fontFamily: "GothamRnd-Medium", fontWeight: "400" },
      bodyMedium: { fontFamily: "GothamRnd-Medium", fontWeight: "400" },
      bodyLarge: { fontFamily: "GothamRnd-Medium", fontWeight: "500" },
      labelSmall: { fontFamily: "GothamRnd-Medium", fontWeight: "400" },
      labelMedium: { fontFamily: "GothamRnd-Medium", fontWeight: "500" },
      labelLarge: { fontFamily: "GothamRnd-Bold", fontWeight: "700" },
      headlineSmall: { fontFamily: "GothamRnd-Bold", fontWeight: "700" },
      headlineMedium: { fontFamily: "GothamRnd-Bold", fontWeight: "700" },
      headlineLarge: { fontFamily: "GothamRnd-Bold", fontWeight: "700" },
    },
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <SnackbarProvider>
          <StatusBar barStyle="light-content" backgroundColor="#EF6351" />
          <AuthWrapper />
        </SnackbarProvider>
      </PaperProvider>
    </Provider>
  );
}
