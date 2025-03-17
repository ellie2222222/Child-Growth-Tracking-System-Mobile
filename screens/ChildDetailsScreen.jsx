import React, { useEffect, useState } from "react";
import { Image, ScrollView, View, StyleSheet, Dimensions } from "react-native";
import { Avatar, Divider, useTheme } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import Title from "../components/Title";
import Text from "../components/Text";
import { format } from "date-fns";
import api from "../configs/api";

const ChildDetails = () => {
  const theme = useTheme();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChild = async () => {
    setLoading(true);
    try {
      const response = await api.get("/children");
      setChild(response.data.children[0]); // Assuming the API returns an array of children
    } catch (error) {
      console.error("Failed to fetch child data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChild();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!child) {
    return <Text>No child data found.</Text>;
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
              {child.allergies?.join(", ") || "N/A"}
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
});