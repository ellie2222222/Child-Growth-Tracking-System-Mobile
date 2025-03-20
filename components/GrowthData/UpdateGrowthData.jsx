import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import api from "../../configs/api";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";

const GrowthDataSchema = Yup.object().shape({
  inputDate: Yup.date()
    .required("Input date is required")
    .max(new Date(), "Input date must be a valid past or present date"),
  height: Yup.number()
    .required("Height is required")
    .positive("Height must be greater than zero"),
  weight: Yup.number()
    .required("Weight is required")
    .positive("Weight must be greater than zero"),
  headCircumference: Yup.number().positive("Head circumference must be greater than zero"),
  armCircumference: Yup.number().positive("Arm circumference must be greater than zero"),
});

const UpdateGrowthData = ({ visible, onClose, childId, growthData, fetchGrowthData }) => {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const parsedValues = {
        ...values,
        inputDate: new Date(new Date(values.inputDate).setHours(0, 0, 0, 0)),
        height: parseFloat(values.height),
        weight: parseFloat(values.weight),
        headCircumference: values.headCircumference ? parseFloat(values.headCircumference) : undefined,
        armCircumference: values.armCircumference ? parseFloat(values.armCircumference) : undefined,
      };
      const response = await api.put(`/children/${childId}/growth-data/${growthData._id}`, parsedValues);
      if (response.status === 200) {
        showSnackbar("Growth data updated successfully!", 3000, "Close");
        fetchGrowthData();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.validationErrors) {
        const validationErrors = error.response.data.validationErrors;
        if (Array.isArray(validationErrors)) {
          validationErrors.forEach((err) => {
            showSnackbar(`${err.field}: ${err.error}`, 5000, "Close");
          });
        } else {
          showSnackbar(
            error.response.data.message || "Failed to update growth data. Please try again.",
            5000,
            "Close"
          );
        }
      } else {
        showSnackbar(
          error.response?.data?.message || "Failed to update growth data. Please try again.",
          5000,
          "Close"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}
    >
      <SafeAreaProvider>
        <View style={styles(theme).modalContainer}>
          <View style={styles(theme).modalContent}>
            <Text style={styles(theme).modalTitle}>Update Growth Data</Text>
            <Formik
              initialValues={{
                inputDate: growthData ? new Date(growthData.inputDate) : new Date(),
                height: growthData?.height?.toString() || "",
                weight: growthData?.weight?.toString() || "",
                headCircumference: growthData?.headCircumference?.toString() || "",
                armCircumference: growthData?.armCircumference?.toString() || "",
              }}
              validationSchema={GrowthDataSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                values,
                errors,
                touched,
              }) => (
                <View>
                  <TextInput
                    style={styles(theme).input}
                    placeholder="Height (cm)"
                    onChangeText={handleChange("height")}
                    onBlur={handleBlur("height")}
                    value={values.height}
                    keyboardType="numeric"
                  />
                  {touched.height && errors.height && (
                    <Text style={styles(theme).errorText}>{errors.height}</Text>
                  )}

                  <TextInput
                    style={styles(theme).input}
                    placeholder="Weight (kg)"
                    onChangeText={handleChange("weight")}
                    onBlur={handleBlur("weight")}
                    value={values.weight}
                    keyboardType="numeric"
                  />
                  {touched.weight && errors.weight && (
                    <Text style={styles(theme).errorText}>{errors.weight}</Text>
                  )}

                  <TextInput
                    style={styles(theme).input}
                    placeholder="Head Circumference (cm)"
                    onChangeText={handleChange("headCircumference")}
                    onBlur={handleBlur("headCircumference")}
                    value={values.headCircumference}
                    keyboardType="numeric"
                  />
                  {touched.headCircumference && errors.headCircumference && (
                    <Text style={styles(theme).errorText}>{errors.headCircumference}</Text>
                  )}

                  <TextInput
                    style={styles(theme).input}
                    placeholder="Arm Circumference (cm)"
                    onChangeText={handleChange("armCircumference")}
                    onBlur={handleBlur("armCircumference")}
                    value={values.armCircumference}
                    keyboardType="numeric"
                  />
                  {touched.armCircumference && errors.armCircumference && (
                    <Text style={styles(theme).errorText}>{errors.armCircumference}</Text>
                  )}

                  
                  <View style={{ marginTop: 20 }}>
                    <DatePickerInput
                      locale="en"
                      label="Input Date"
                      value={values.inputDate}
                      onChange={(date) => setFieldValue("inputDate", date)}
                      inputMode="start"
                      mode="outlined"
                    />
                    {touched.inputDate && errors.inputDate && (
                      <Text style={styles(theme).errorText}>{errors.inputDate}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles(theme).submitButton, {marginTop: 40}]}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles(theme).submitButtonText}>Update</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles(theme).cancelButton}
                    onPress={onClose}
                  >
                    <Text style={styles(theme).cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = (theme) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium.fontFamily,
  },
  input: {
    height: 40,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.medium.fontFamily,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginBottom: 8,
    fontFamily: theme.fonts.regular.fontFamily,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  cancelButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
  },
});

export default UpdateGrowthData;