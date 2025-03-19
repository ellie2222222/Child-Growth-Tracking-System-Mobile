import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme, Avatar, Card, Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Text from "../components/Text"; // Giả sử bạn có component Text
import Title from "../components/Title"; // Giả sử bạn có component Title

export const ProfileScreen = () => {
  const theme = useTheme();
  const [userInfo] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    membershipPlan: "Free",
    membershipFeatures: [
      "Track 1 child",
      "Basic charts",
      "Monthly updates",
      "Access to knowledge sharing blog",
    ],
  });

  const renderUserInfo = () => (
    <View style={styles.userInfoSection}>
      <Avatar.Image
        size={120}
        source={{ uri: "https://i.pravatar.cc/300" }}
        style={styles.avatar}
      />
      <Text variant="medium" style={styles.userName}>
        {userInfo.name}
      </Text>
      <Text variant="medium" style={styles.userDetail}>
        Email: {userInfo.email}
      </Text>
      <Text variant="medium" style={styles.userDetail}>
        Phone: {userInfo.phone}
      </Text>
    </View>
  );

  const renderMembershipInfo = () => (
    <Card style={styles.membershipCard}>
      <Card.Content>
        <Title
          text="Current Membership Plan"
          style={[styles.sectionTitle, { color: theme.colors.primary }]}
        />
        <Divider style={styles.divider} />
        <Text variant="medium" style={styles.membershipName}>
          {userInfo.membershipPlan}
        </Text>
        {userInfo.membershipFeatures.map((feature, idx) => (
          <View key={idx} style={styles.featureItem}>
            <Icon name="check-circle" size={18} color={theme.colors.primary} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
        <View style={styles.upgradeButton}>
          <Text style={[styles.upgradeText, { color: theme.colors.primary }]}>
            Upgrade Plan
          </Text>
          <Icon name="chevron-right" size={22} color={theme.colors.primary} />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* User Information Section */}
        {renderUserInfo()}

        {/* Membership Information Section */}
        {renderMembershipInfo()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40,
  },
  userInfoSection: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 25,
    marginBottom: 25,
    elevation: 3, // Thêm bóng nhẹ cho hiệu ứng nổi
  },
  avatar: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  userDetail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  membershipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    elevation: 3,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  divider: {
    marginBottom: 20,
    backgroundColor: "#E0E0E0",
  },
  membershipName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#444",
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  upgradeText: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 5,
  },
});
