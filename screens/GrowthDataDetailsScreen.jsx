import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { useSnackbar } from "../contexts/SnackbarContext";
import api from "../configs/api";
import { format } from "date-fns";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const GrowthDataDetails = () => {
  const theme = useTheme();
  const route = useRoute();
  const { growthDataId, childId } = route.params;
  const { showSnackbar } = useSnackbar();
  const [growthData, setGrowthData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGrowthData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/children/${childId}/growth-data/${growthDataId}`);
      setGrowthData(response.data.growthData);
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to fetch growth data. Please try again.",
        5000,
        "Close"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowthData();
  }, [growthDataId, childId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText(theme)}>Loading...</Text>
      </View>
    );
  }

  if (!growthData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText(theme)}>No growth data found.</Text>
      </View>
    );
  }

  const formattedDate = format(new Date(growthData.inputDate), "MMM d, yyyy");

  // Updated function with your color scheme
  const getLevelStyles = (key, level) => {
    const redLevels = ["Low", "Underweight", "Obese", "High"];
    const yellowLevels = ["Below Average", "Overweight"];
    const greenLevels = ["Healthy Weight", "Average", "Above Average"];
    
    if (redLevels.includes(level)) {
      return { backgroundColor: "#FF6347", icon: "trending-down", color: "white" }; // Red
    } else if (yellowLevels.includes(level)) {
      return { backgroundColor: "#FFD700", icon: "warning", color: "#333" }; // Yellow
    } else if (greenLevels.includes(level)) {
      return { backgroundColor: "#32CD32", icon: "check-circle", color: "white" }; // Green
    } else if (level === "N/A") {
      return { backgroundColor: "#D3D3D3", icon: "remove", color: "#666" }; // Gray
    } else {
      return { backgroundColor: "#87CEEB", icon: "trending-neutral", color: "#333" }; // Default
    }
  };

  return (
    <ScrollView style={styles.container(theme)}>
      <Text style={styles.title(theme)}>Growth Data - {formattedDate}</Text>

      <View style={styles.resultsContainer}>
        {Object.entries(growthData.growthResult).map(([key, result]) => {
          const { backgroundColor, icon, color } = getLevelStyles(key, result.level);
          return (
            <TouchableOpacity
              key={key}
              style={[styles.resultFolder(theme), { backgroundColor }]}
              disabled
            >
              <View style={styles.folderHeader}>
                <MaterialIcons name={icon} size={24} color={color} style={styles.folderIcon} />
                <Text style={[styles.folderTitle(theme), { color }]}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
              </View>
              <Text style={[styles.folderText(theme), { color }]}>
                Percentile: {result.percentile === -1 ? "N/A" : result.percentile}
              </Text>
              <Text style={[styles.folderText(theme), { color }]}>
                {result.description}
              </Text>
              <Text style={[styles.folderText(theme), { color }]}>
                Level: {result.level}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Percentile Info Section */}
      <View style={styles.infoContainer(theme)}>
        <View style={styles.infoHeader}>
          <MaterialIcons name="info-outline" size={20} color={theme.colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoTitle(theme)}>What Do Percentiles Mean?</Text>
        </View>
        <Text style={styles.infoText(theme)}>
          Percentiles are used to measure the growth of babies and children. They show how your baby or child's height, weight, and head circumference compare to an average for other children the same age. Whether your child is in the 90th percentile or the 10th percentile, the most important thing is that they maintain consistent growth.
        </Text>
        <Text style={styles.infoText(theme)}>
          There's a wide range of normal percentiles, and there isn't a single "good" percentile for a baby. Instead, your baby's doctor will look for consistent and healthy growth.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = {
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: (theme) => ({
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  }),
  title: (theme) => ({
    fontSize: 24,
    color: theme.colors.primary,
    marginBottom: 16,
    textAlign: "center",
    fontFamily: theme.fonts.bold.fontFamily,
  }),
  dataContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
  },
  label: (theme) => ({
    fontSize: 18,
    color: "#333",
    marginTop: 8,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  value: (theme) => ({
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  sectionTitle: (theme) => ({
    fontSize: 20,
    color: theme.colors.primary,
    marginBottom: 12,
    fontFamily: theme.fonts.bold.fontFamily,
  }),
  resultsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  resultFolder: (theme) => ({
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  }),
  folderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  folderIcon: {
    marginRight: 8,
  },
  folderTitle: (theme) => ({
    fontSize: 18,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  folderText: (theme) => ({
    fontSize: 14,
    fontFamily: theme.fonts.regular.fontFamily,
    marginBottom: 4,
  }),
  infoContainer: (theme) => ({
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    marginBottom: 32
  }),
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoTitle: (theme) => ({
    fontSize: 16,
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  infoText: (theme) => ({
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    fontFamily: theme.fonts.regular.fontFamily,
    marginBottom: 8,
  }),
  loadingText: (theme) => ({
    fontSize: 18,
    marginBottom: 5,
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  errorText: (theme) => ({
    fontSize: 18,
    marginBottom: 5,
    color: theme.colors.error,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
};

export default GrowthDataDetails;