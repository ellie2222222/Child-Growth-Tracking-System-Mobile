import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, Dimensions } from "react-native";
import { useTheme, Card, Title, Paragraph, Button } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { SelectList } from "react-native-dropdown-select-list";
import { TextInput } from "react-native-paper";
import api from "../../../configs/api";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

const MemberConsultationRequest = () => {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar(); 
  const [selectedChildId, setSelectedChildId] = useState(null); 
  const [messageText, setMessageText] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doctorsError, setDoctorsError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigation();

  
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const response = await api.get("/children", {
          params: {
            page: 1,
            size: 10,
            sortBy: "name",
            order: "descending",
          },
        });

        if (!response.data || !response.data.children) {
          throw new Error("Invalid data format received from API");
        }

        const fetchedChildren = response.data.children.map((child) => ({
          id: child._id,
          name: child.name,
        }));

        setChildrenData(fetchedChildren);
      } catch (err) {
        setError(err.message || "Failed to fetch children");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setDoctorsLoading(true);
        const response = await api.get("/users", {
          params: {
            page: 1,
            size: 10,
            search: "",
            order: "ascending",
            sortBy: "date",
          },
        });

        if (!response.data || !response.data.users) {
          throw new Error("Invalid data format received from API");
        }

        const fetchedDoctors = response.data.users
          .filter((user) => user?.role === 2)
          .map((doctor) => ({
            id: doctor._id,
            name: doctor.name,
          }));

        setDoctors(fetchedDoctors);
      } catch (err) {
        setDoctorsError(err.message || "Failed to fetch doctors");
      } finally {
        setDoctorsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const childOptions = childrenData.map((child) => ({
    key: child.id,
    value: child.name,
  }));

  const doctorOptions = doctors.map((doctor) => ({
    key: doctor.id,
    value: doctor.name,
  }));

  const sampleChartData = {
    labels: ["2023-01", "2023-06", "2024-01", "2024-06", "2025-01"],
    datasets: [
      {
        data: [3.5, 6, 9, 11, 13],
        color: () => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  const handleSubmit = async () => {
    
    if (!selectedChildId || !selectedDoctor || !messageText.trim()) {
      showSnackbar(
        "Please complete all fields before submitting.",
        5000,
        "Close"
      );
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);

    try {
      
      const selectedChild = childrenData.find(
        (child) => child.id === selectedChildId
      );

      const childrenArray = [selectedChild.id];

      await api.post("/requests", {
        childIds: childrenArray,
        doctorId: selectedDoctor.id,
        title: messageText.trim(),
      });
      navigate.navigate("ConsultationHistory");
      showSnackbar(
        "Consultation request submitted successfully!",
        5000,
        "Close"
      );

      setMessageText("");
      setSelectedChildId(null);
      setSelectedDoctor(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.validationErrors?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to submit consultation request";
      setSubmitError(errorMessage);
      showSnackbar(errorMessage, 5000, "Close");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles(theme).container}>
        <Text>Loading children...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles(theme).container}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );
  }

  
  if (doctorsLoading) {
    return (
      <View style={styles(theme).container}>
        <Text>Loading doctors...</Text>
      </View>
    );
  }

  if (doctorsError) {
    return (
      <View style={styles(theme).container}>
        <Text style={{ color: "red" }}>Error: {doctorsError}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles(theme).container}
      showsVerticalScrollIndicator={false}>
      <Card style={styles(theme).card}>
        <Card.Content>
          <View style={styles(theme).formItem}>
            <Text style={styles(theme).label}>Select Child</Text>
            <SelectList
              setSelected={(val) => setSelectedChildId(val)}
              data={childOptions}
              save="key"
              placeholder="Choose a child"
              search={false}
              boxStyles={styles(theme).dropdownBox}
              dropdownStyles={styles(theme).dropdown}
              disabled={submitLoading}
            />
          </View>

          <View style={styles(theme).formItem}>
            <Text style={styles(theme).label}>Select Doctor</Text>
            <SelectList
              setSelected={(val) =>
                setSelectedDoctor(doctors.find((doctor) => doctor.id === val))
              }
              data={doctorOptions}
              save="key"
              placeholder="Choose a doctor"
              search={false}
              boxStyles={styles(theme).dropdownBox}
              dropdownStyles={styles(theme).dropdown}
              disabled={submitLoading}
            />
          </View>

          <View style={styles(theme).formItem}>
            <Text style={styles(theme).label}>Message to Doctor</Text>
            <TextInput
              mode="outlined"
              placeholder="Describe your concerns..."
              multiline
              numberOfLines={4}
              value={messageText}
              onChangeText={setMessageText}
              style={styles(theme).textArea}
              theme={{ colors: { primary: theme.colors.primary } }}
              disabled={submitLoading}
            />
          </View>

          {submitError && (
            <Text style={{ color: "red", marginBottom: 10 }}>
              {submitError}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles(theme).submitButton}
            labelStyle={styles(theme).submitButtonText}
            loading={submitLoading}
            disabled={submitLoading}>
            Submit Consultation Request
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: "#f0f2f5",
    },
    card: {
      borderRadius: 8,
      elevation: 2,
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    formItem: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 8,
      color: "#333",
    },
    dropdownBox: {
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 4,
      backgroundColor: "#fff",
      height: 50,
    },
    dropdown: {
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 4,
      backgroundColor: "#fff",
    },
    healthDataCard: {
      marginBottom: 20,
      padding: 10,
      backgroundColor: "#f9f9f9",
      borderRadius: 8,
    },
    healthDataTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
    },
    textArea: {
      backgroundColor: "#fff",
      height: 200,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      paddingVertical: 5,
      marginTop: 10,
    },
    submitButtonText: {
      color: "white",
      fontWeight: "bold",
      fontFamily: theme.fonts.medium?.fontFamily || "System",
      fontSize: 16,
    },
  });

export default MemberConsultationRequest;
