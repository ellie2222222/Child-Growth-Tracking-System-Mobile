import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useTheme, Text, Card, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const FAQsScreen = () => {
  const theme = useTheme();
  const scrollOffsetY = new Animated.Value(0);
  const [expandedFaqs, setExpandedFaqs] = useState({});

  const toggleFaq = (id) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqs = [
    {
      id: 1,
      question: "How can I track multiple children in one account?",
      answer:
        "You can add profiles for multiple children in the 'Profile Management' section. Each child will have their own growth chart, allowing you to monitor their progress individually.",
    },
    {
      id: 2,
      question: "How can I share data with doctors?",
      answer:
        "On the child's details page, select the 'Share' button and choose your preferred sharing method, such as email or PDF export, to share the data with your doctor.",
    },
    {
      id: 3,
      question: "Which standards are the growth charts based on?",
      answer:
        "GrowEasy uses WHO and CDC growth standards, adjusted for Vietnamese children, ensuring accurate and reliable tracking.",
    },
    {
      id: 4,
      question: "Can I get notifications for my child’s milestones?",
      answer:
        "Yes, with the Smart Alerts feature, GrowEasy will notify you if your child’s development deviates from expected milestones, helping you take timely action.",
    },
    {
      id: 5,
      question: "How do I upgrade my membership plan?",
      answer:
        "Go to the 'Membership Plans' section in the app, choose your desired plan (Family or Professional), and follow the instructions to upgrade your subscription.",
    },
    {
      id: 6,
      question: "Is my data secure with GrowEasy?",
      answer:
        "Absolutely. GrowEasy uses industry-standard encryption to protect your data, ensuring that your child’s information remains private and secure.",
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    scrollViewContent: {
      padding: 16,
      paddingBottom: 40,
    },
    headerSection: {
      marginBottom: 24,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 8,
      fontFamily: "GothamRnd-Medium",
    },
    headerDescription: {
      fontSize: 14,
      color: "#666",
      lineHeight: 20,
    },
    faqSection: {
      marginBottom: 32,
    },
    faqItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    faqContent: {
      flex: 1,
      marginRight: 12,
    },
    faqQuestion: {
      fontSize: 16,
      fontWeight: "500",
      color: "#333",
      marginBottom: 8,
    },
    faqAnswerContainer: {
      overflow: "hidden",
      marginTop: 8,
    },
    faqAnswer: {
      fontSize: 14,
      color: "#666",
      lineHeight: 22,
      paddingLeft: 12,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
      paddingBottom: 4,
    },
    ctaCard: {
      backgroundColor: "#f9f9ff",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#e0e0ff",
      marginTop: 16,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
    },
    ctaContent: {
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    ctaTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: "#333",
      marginBottom: 8,
    },
    ctaText: {
      fontSize: 13,
      color: "#444",
      width: "70%",
      marginBottom: 16,
    },
    ctaButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingHorizontal: 12,
    },
  });

  return (
    <View style={styles.container}>
      {/* ScrollView */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
          <Text style={styles.headerDescription}>
            Find answers to common questions about using GrowEasy to track your
            child's development and more.
          </Text>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          {faqs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqItem}
              onPress={() => toggleFaq(faq.id)}
              activeOpacity={0.7}>
              <View style={styles.faqContent}>
                <Text
                  style={[
                    styles.faqQuestion,
                    expandedFaqs[faq.id]
                      ? { marginBottom: 0 }
                      : { marginBottom: 8 },
                  ]}>
                  {faq.question}
                </Text>
                {expandedFaqs[faq.id] && (
                  <Animated.View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </Animated.View>
                )}
              </View>
              <Icon
                name={expandedFaqs[faq.id] ? "chevron-up" : "chevron-down"}
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Call to Action */}
        <Card style={styles.ctaCard}>
          <Card.Content style={styles.ctaContent}>
            <View>
              <Text style={styles.ctaTitle}>Still have questions?</Text>
              <Text style={styles.ctaText}>
                Contact our support team for personalized assistance.
              </Text>
            </View>
            <Button
              mode="contained"
              style={styles.ctaButton}
              labelStyle={{ color: "white" }}
              onPress={() => {}}>
              Contact Support
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default FAQsScreen;
