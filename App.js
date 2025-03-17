import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import Navigator from "./navigation/Navigator";
import store from "./store";
import { fetchUserCredentials } from "./features/authSlice";

SplashScreen.preventAutoHideAsync();

const AuthWrapper = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(fetchUserCredentials());
  }, [dispatch]);

  if (loading) {
    return null;
  }

  return <Navigator isAuthenticated={isAuthenticated} />;
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
    },
    fonts: {
      light: { fontFamily: "GothamRnd-Light", fontWeight: "300" },
      regular: { fontFamily: "GothamRnd-Regular", fontWeight: "500" },
      medium: { fontFamily: "GothamRnd-Medium", fontWeight: "600" },
      titleMedium: { fontFamily: "GothamRnd-Medium", fontWeight: "600" },
      bold: { fontFamily: "GothamRnd-Bold", fontWeight: "700" },
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
