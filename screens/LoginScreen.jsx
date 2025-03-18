import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { fetchUserCredentials } from "../features/authSlice";
import { useNavigation } from "@react-navigation/native";
import api from "../configs/api";
import CustomButton from "../components/Button";
import { useSnackbar } from "../contexts/SnackbarContext";

const LoginScreen = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { showSnackbar } = useSnackbar();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
  });

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    console.log("hihi login nè");

    try {
      await api.post("/auth/login", values);
      dispatch(fetchUserCredentials());
      showSnackbar("Login success", 5000, "Close");
      navigation.navigate("Home");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          if (data.validationErrors) {
            const validationErrors = data.validationErrors || [];
            const errors = {};
            validationErrors.forEach((err) => {
              errors[err.field] = err.error;
            });
            setErrors(errors);
          } else {
            setErrors({
              general: data.message || "Login failed. Please try again.",
            });
          }
        } else {
          setErrors({
            general: data.message || "Login failed. Please try again.",
          });
        }
      } else {
        console.log("hihi login nè nhưng lỗi rồi");
        setErrors({ general: "Network error. Please check your connection." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles(theme).container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}>
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
            <TextInput
              label="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              style={styles(theme).input}
              error={touched.email && !!errors.email}
            />
            {touched.email && errors.email && (
              <Text style={styles(theme).errorText}>{errors.email}</Text>
            )}

            <TextInput
              label="Password"
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              secureTextEntry
              style={styles(theme).input}
              error={touched.password && !!errors.password}
            />
            {touched.password && errors.password && (
              <Text style={styles(theme).errorText}>{errors.password}</Text>
            )}

            {errors.general && (
              <Text style={styles(theme).errorText}>{errors.general}</Text>
            )}

            <CustomButton
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              textVariant="medium"
              title="Login"
            />
          </>
        )}
      </Formik>

      <Button mode="text" onPress={() => navigation.navigate("Signup")}>
        Don't have an account? Sign up
      </Button>
    </View>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: "center",
    },
    input: {
      marginBottom: 8,
      borderWidth: 1,
      borderColor: "black",
      borderStyle: "solid",
      borderRadius: 4,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginBottom: 8,
    },
  });

export default LoginScreen;
