import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme, Avatar, Card, Divider, ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Text from "../components/Text";
import Title from "../components/Title";
import { useSelector } from "react-redux";
import api from "../configs/api";

export const ProfileScreen = () => {
  const user = useSelector((state) => state.auth.user);
  const theme = useTheme();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) {
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const userResponse = await api.get(`/users/${user._id}`, {
          withCredentials: true,
        });
        const fetchedUser = userResponse.data.user;

        let membershipDetails = null;
        if (fetchedUser?.role === 0) {
          const planResponse = await api.get(
            `/membership-packages/${fetchedUser.subscription.currentPlan}`,
            { withCredentials: true }
          );
          const fetchedPlan = planResponse.data.package;

          membershipDetails = {
            name: fetchedPlan.name,
            description: fetchedPlan.description,
            price: `${fetchedPlan.price.value.toLocaleString()} ${fetchedPlan.price.unit}`,
            duration: `${fetchedPlan.duration.value} ${fetchedPlan.duration.unit.toLowerCase()}${fetchedPlan.duration.value > 1 ? "s" : ""}`,
            features: [
              { label: "Post Limit", value: fetchedPlan.postLimit },
              { label: "Update Child Data Limit", value: fetchedPlan.updateChildDataLimit.toLocaleString() },
              { label: "Download Chart Limit", value: fetchedPlan.downloadChart },
            ],
          };
        }

        setUserInfo({
          name: fetchedUser.name,
          email: fetchedUser.email,
          phone: fetchedUser.phoneNumber,
          role: fetchedUser.role,
          avatar: fetchedUser.avatar || "https://cdn-icons-png.freepik.com/512/6596/6596121.png",
          subscriptionDetails: fetchedUser.subscription,
          membership: membershipDetails,
        });
      } catch (err) {
        setError("Failed to fetch user or plan information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const renderUserInfo = () => (
    <View style={styles.userInfoSection}>
      <Avatar.Icon size={120} icon="account" style={styles.avatar} />
      <Text variant="medium" style={styles.userName}>
        {userInfo.name}{" "}
        <Text variant="medium" style={{ color: userInfo.role === 2 ? "#F25A49" : "#F25A49" }}>
          ({userInfo.role === 2 ? "Doctor" : "Member"})
        </Text>
      </Text>
      <Text variant="medium" style={styles.userDetail}>Email: {userInfo.email}</Text>
      <Text variant="medium" style={styles.userDetail}>Phone: {userInfo.phone}</Text>
    </View>
  );

  const renderMembershipInfo = () => (
    <Card style={styles.membershipCard}>
      <Card.Content>
        <Title text="Current Membership Plan" style={[styles.sectionTitle, { color: theme.colors.primary }]} />
        <Divider style={styles.divider} />
        <Text variant="medium" style={styles.membershipName}>
          {userInfo.membership.name}
        </Text>
        <Text style={styles.description}>{userInfo.membership.description}</Text>
        <Text style={styles.priceDuration}>
          Price: {userInfo.membership.price} / {userInfo.membership.duration}
        </Text>
        {userInfo.membership.features.map((feature, idx) => (
          <View key={idx} style={styles.featureItem}>
            <Icon name="check-circle" size={18} color={theme.colors.primary} />
            <Text style={styles.featureText}>
              {feature.label}: {feature.value}
            </Text>
          </View>
        ))}
        <View style={styles.upgradeButton}>
          <Text style={[styles.upgradeText, { color: theme.colors.primary }]}>Upgrade Plan</Text>
          <Icon name="chevron-right" size={22} color={theme.colors.primary} />
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator
          animating={true}
          size="large"
          color={theme.colors.primary}
        />
        <Text style={{ color: theme.colors.primary }}>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {renderUserInfo()}
        {userInfo.role === 0 && renderMembershipInfo()}
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
    elevation: 3,
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
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },
  priceDuration: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
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
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
