import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import api from "../configs/api";
import CustomButton from "../components/Button";
import Text from "../components/Text";

const SignupScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

 
  const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .min(1, "Name must be at least 1 character long")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        "Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol"
      )
      .required("Password is required"),
  });

  const handleSignup = async (values, { setSubmitting, setErrors }) => {
    try {
      await api.post("/auth/signup", values);
      navigation.navigate("Login");
      showSnackbar(
        "Signup success",
        5000,
        "Close"
      );
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
         
          const validationErrors = data.validationErrors || [];
          const errors = {};
          validationErrors.forEach((err) => {
            errors[err.field] = err.error;
          });
          setErrors(errors);
        } else if (status === 409) {
         
          setErrors({ email: data.message });
        } else {
         
          setErrors({ general: data.message || "Signup failed. Please try again." });
        }
      } else {
       
        setErrors({ general: "Network error. Please check your connection." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles(theme).container}>
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={SignupSchema}
        onSubmit={handleSignup}
      >
        {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
          <>
            <TextInput
              label="Name"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              style={styles(theme).input}
              error={touched.name && !!errors.name}
            />
            {touched.name && errors.name && (
              <Text style={styles(theme).errorText}>{errors.name}</Text>
            )}

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
              title="Sign up"
            />
          </>
        )}
      </Formik>

      <Button mode="text" onPress={() => navigation.navigate("Login")}>
        Already have an account? Login
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

export default SignupScreen;