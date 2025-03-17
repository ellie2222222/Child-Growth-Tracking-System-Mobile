import React from "react";
import { Image, ScrollView, View, StyleSheet, Dimensions } from "react-native";
import { Avatar, Divider, useTheme } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import Title from "../components/Title";
import Text from "../components/Text";
import { format } from "date-fns";

const mockChild = {
  name: "Oliver James",
  birthDate: "2021-06-15",
  gender: "Boy",
  feedingType: "Breastfeeding",
  allergies: ["None"], // Changed to an array
  growthData: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    weight: [4.5, 5.2, 5.8, 6.4, 7.1],
    height: [55, 58, 61, 64, 67],
  },
  note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
};

const formattedBirthDate = format(new Date(mockChild.birthDate), "MMM d, yyyy");

const genderIcon = mockChild.gender === "Boy"
  ? require("../assets/images/men.png")
  : require("../assets/images/women.png");

const ChildDetails = () => {
  const theme = useTheme();

  return (
    <ScrollView style={{ padding: 16, backgroundColor: theme.colors.background }}>
      <View style={styles.section}>
        <View style={{ margin: "auto" }}>
            <Avatar.Icon size={80} icon="baby-face-outline" style={{ backgroundColor: theme.colors.primary }} color="white"/>
        </View>
        <Title variant="medium" text={mockChild.name} style={styles.name} />
        <View style={styles.birthDateContainer}>
          <Text style={styles.birthDate}>{formattedBirthDate}</Text>
          <Image source={genderIcon} style={styles.genderIcon} />
        </View>
      </View>

      <Divider style={{ marginVertical: 16 }} />

      {/* Section 2: Grid for Feeding Type, Allergies, and Note */}
      <View style={styles.section}>
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <Text variant="medium" style={styles.gridLabel}>Feeding Type</Text>
            <Text style={styles.gridValue}>{mockChild.feedingType}</Text>
          </View>
          <View style={styles.gridRow}>
            <Text variant="medium" style={styles.gridLabel}>Allergies</Text>
            <Text style={styles.gridValue}>
              {mockChild.allergies.join(", ")}
            </Text>
          </View>
        </View>
        <View style={styles.noteContainer}>
          <Title text="Note" style={{ textAlign: "left", fontSize: 18 }} />
          <Text style={styles.note}>{mockChild.note}</Text>
        </View>
      </View>

      <Divider style={{ marginVertical: 16 }} />

      {/* Section 3: Growth Data Line Chart */}
      <View style={styles.section}>
        <Title style={{ textAlign: "center", marginBottom: 10 }}>Growth Data</Title>
        <LineChart
          data={{
            labels: mockChild.growthData.labels,
            datasets: [
              { data: mockChild.growthData.weight, color: () => theme.colors.primary },
              { data: mockChild.growthData.height, color: () => theme.colors.secondary },
            ],
          }}
          width={Dimensions.get("window").width - 32}
          height={220}
          yAxisSuffix=" kg/cm"
          chartConfig={{
            backgroundColor: theme.colors.secondary,
            backgroundGradientFrom: theme.colors.secondary,
            backgroundGradientTo: theme.colors.lightWhite,
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
            labelColor: () => theme.colors.onBackground,
            style: { borderRadius: 12 },
          }}
          bezier
          style={{ borderRadius: 12 }}
        />
      </View>
    </ScrollView>
  );
};

export default ChildDetails;

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    color: "white"
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
    marginRight: 8, // Add spacing between the date and the icon
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