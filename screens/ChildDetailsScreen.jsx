import React, { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, View, StyleSheet } from "react-native";
import { ActivityIndicator, Avatar, Divider, useTheme } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import Title from "../components/Title";
import Text from "../components/Text";
import { format } from "date-fns";
import api from "../configs/api";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useSnackbar } from "../contexts/SnackbarContext";

const ChildDetails = () => {
  const theme = useTheme();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { childId } = route.params;
  const { showSnackbar } = useSnackbar();

  const fetchChild = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/children/${childId}`);
      setChild(response.data.child);
    } catch (error) {
      console.error("Failed to fetch child data:", error);
      showSnackbar(
        data.message || "Failed to fetch child data. Please try again.",
        5000,
        "Close"
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChild();
    }, [childId])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.text, { color: theme.colors.primary }]}>Loading...</Text>
      </View>
    );
  }

  if (!child) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.text, { color: theme.colors.error }]}>No child data found.</Text>
      </View>
    )
  }

  const formattedBirthDate = format(new Date(child.birthDate), "MMM d, yyyy");
  const genderIcon = child.gender === "Boy"
    ? require("../assets/images/men.png")
    : require("../assets/images/women.png");

  return (
    <ScrollView style={{ padding: 16, backgroundColor: theme.colors.background }}>
      <View style={styles.section}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Avatar.Icon size={80} icon="baby-face-outline" style={{ backgroundColor: theme.colors.primary }} color="white" />
        </View>
        <Title variant="medium" text={child.name} style={styles.name} />
        <View style={styles.birthDateContainer}>
          <Text style={styles.birthDate}>{formattedBirthDate}</Text>
          <Image source={genderIcon} style={styles.genderIcon} />
        </View>
      </View>

      <Divider style={{ marginVertical: 16 }} />

      <View style={styles.section}>
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <Text variant="medium" style={styles.gridLabel}>Feeding Type</Text>
            <Text style={styles.gridValue}>{child.feedingType || "N/A"}</Text>
          </View>
          <View style={styles.gridRow}>
            <Text variant="medium" style={styles.gridLabel}>Allergies</Text>
            <Text style={styles.gridValue}>
            <View>
              {child.allergies && child.allergies.length > 0 ? (
                child.allergies.map((allergy, index) => (
                  <Text key={index} style={styles.gridValue}>
                    {allergy === "NONE"
                      ? "None"
                      : allergy === "N/A"
                      ? "N/A"
                      : allergy.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Text>
                ))
              ) : (
                <Text style={styles.gridValue}>N/A</Text>
              )}
            </View>
            </Text>
          </View>
        </View>
        <View style={styles.noteContainer}>
          <Title text="Note" style={{ textAlign: "left", fontSize: 18 }} />
          <Text style={styles.note}>{child.note}</Text>
        </View>
      </View>

      <Divider style={{ marginVertical: 16 }} />

    </ScrollView>
  );
};

export default ChildDetails;

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 8,
  },
  birthDateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  birthDate: {
    fontSize: 16,
    marginRight: 8,
  },
  genderIcon: {
    width: 20,
    height: 20,
  },
  gridContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  gridLabel: {
    fontSize: 16,
    color: "#333",
  },
  gridValue: {
    fontSize: 16,
    color: "#666",
  },
  noteContainer: {
    marginTop: 16,
  },
  note: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
});