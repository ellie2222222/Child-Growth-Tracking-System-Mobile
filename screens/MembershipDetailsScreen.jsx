import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useTheme, Title, Paragraph, Button, Card } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../configs/api";

const MembershipDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { membershipId } = route.params;
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchMembershipDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/membership-packages/${membershipId}`);
        if (!response.data || !response.data.package) {
          throw new Error("Invalid membership data received from API");
        }

        const plan = response.data.package;
        setMembership({
          id: plan._id,
          name: plan.name,
          price: `${plan.price.value.toLocaleString()} ${plan.price.unit}`,
          description: plan.description,
          features: [
            `Post Limit: ${plan.postLimit}`,
            `Update Child Data Limit: ${plan.updateChildDataLimit}`,
            `Download Chart Limit: ${plan.downloadChart}`,
            `Duration: ${plan.duration.value} ${plan.duration.unit}(s)`,
          ],
        });
      } catch (err) {
        setError(err.message || "Failed to fetch membership details");
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipDetails();
  }, [membershipId]);

  const handlePaypalPayment = async () => {
    try {
      setPaymentLoading(true);
      const response = await api.post("/payments/paypal/create", {
        price: membership.price.split(" ")[0].replace(/,/g, ""),
        packageId: membership.id,
        purchaseType: "MEMBERSHIP",
      });

      if (response.data && response.data.link) {
        Linking.openURL(response.data.link);
      } else {
        throw new Error("No payment URL received from PayPal API");
      }
    } catch (err) {
      setError(err.message || "Failed to initiate PayPal payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleVnpayPayment = async () => {
    try {
      setPaymentLoading(true);
      const response = await api.post("/payments/vnpay/create", {
        price: membership.price.split(" ")[0].replace(/,/g, ""),
        packageId: membership.id,
        purchaseType: "MEMBERSHIP",
      });

      if (response.data && response.data.url) {
        Linking.openURL(response.data.url);
      } else {
        throw new Error("No payment URL received from VNPay API");
      }
    } catch (err) {
      setError(err.message || "Failed to initiate VNPay payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles(theme).centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles(theme).loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles(theme).centered}>
        <Text style={styles(theme).errorText}>Error: {error}</Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles(theme).backButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  if (!membership) {
    return (
      <View style={styles(theme).centered}>
        <Text style={styles(theme).errorText}>No membership data found.</Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles(theme).backButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles(theme).container}>
      <Card style={styles(theme).card}>
        <Card.Content>
          <Title style={styles(theme).title}>{membership.name}</Title>
          <Paragraph style={styles(theme).price}>{membership.price}</Paragraph>
          <Paragraph style={styles(theme).description}>
            {membership.description}
          </Paragraph>

          <View style={styles(theme).featuresContainer}>
            <Text style={styles(theme).sectionTitle}>Features</Text>
            {membership.features.map((feature, index) => (
              <View key={index} style={styles(theme).featureItem}>
                <Icon
                  name="check-circle"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles(theme).featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <View style={styles(theme).paymentSection}>
            <Text style={styles(theme).sectionTitle}>Choose Payment Method</Text>
            <Button
              mode="contained"
              onPress={handlePaypalPayment}
              style={styles(theme).paymentButton}
              labelStyle={styles(theme).buttonLabel}
              disabled={paymentLoading}
              loading={paymentLoading}
            >
              Pay with PayPal
            </Button>
            <Button
              mode="contained"
              onPress={handleVnpayPayment}
              style={styles(theme).paymentButton}
              labelStyle={styles(theme).buttonLabel}
              disabled={paymentLoading}
              loading={paymentLoading}
            >
              Pay with VNPay
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: "#f5f5f5",
    },
    card: {
      elevation: 4,
      borderRadius: 8,
      backgroundColor: "#fff",
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      color: theme.colors.primary,
      marginBottom: 8,
      fontFamily: theme.fonts.medium.fontFamily,
    },
    price: {
      fontSize: 20,
      color: theme.colors.text,
      marginBottom: 16,
      fontFamily: theme.fonts.medium.fontFamily,
    },
    description: {
      fontSize: 16,
      color: "#666",
      marginBottom: 16,
      fontFamily: theme.fonts.medium.fontFamily,
    },
    featuresContainer: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 12,
      fontFamily: theme.fonts.medium.fontFamily,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    featureText: {
      fontSize: 14,
      marginLeft: 8,
      color: "#333",
      fontFamily: theme.fonts.medium.fontFamily,
    },
    paymentSection: {
      marginTop: 16,
    },
    paymentButton: {
      marginVertical: 8,
      backgroundColor: theme.colors.primary,
    },
    buttonLabel: {
      color: "white",
      fontSize: 16,
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.primary,
      marginTop: 8,
      fontFamily: theme.fonts.medium.fontFamily,
    },
    errorText: {
      fontSize: 16,
      color: theme.colors.error,
      textAlign: "center",
      marginBottom: 16,
      fontFamily: theme.fonts.medium.fontFamily,
    },
    backButton: {
      backgroundColor: theme.colors.primary,
    },
  });

export default MembershipDetailsScreen;