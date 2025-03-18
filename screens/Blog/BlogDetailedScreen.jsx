import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { useTheme, Text, Card, Button, Divider } from "react-native-paper";
import { DynamicHeader } from "../../components/DynamicHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const windowWidth = Dimensions.get("window").width;

export const BlogDetailedScreen = ({ route }) => {
  const theme = useTheme();
  const scrollOffsetY = new Animated.Value(0);
  const { post } = route.params || {};

  const blogPost = post || {
    id: 1,
    title: "5 child development signs to watch for",
    date: "03/10/2025",
    excerpt:
      "Early detection of abnormal signs helps with timely intervention...",
    content:
      "Identifying developmental signs early is crucial for a child's health. Here are five key signs to watch for: 1) Delayed speech or language skills, 2) Limited social interaction, 3) Motor skill delays, 4) Unusual behavior patterns, and 5) Regression in milestones. If you notice any of these, consult a pediatrician promptly. GrowEasy provides tools to track these milestones and send smart alerts to parents.\n\nEarly intervention can make a significant difference in a child’s development trajectory. For example, speech delays might indicate hearing issues or developmental disorders like autism, which can be addressed with therapies if caught early. Similarly, limited social interaction could be a sign of anxiety or social developmental delays, which benefit from early behavioral interventions.\n\nGrowEasy not only tracks these signs but also provides actionable insights. With smart alerts, you’ll be notified if your child’s development deviates from expected milestones, allowing you to consult with professionals at the right time. Our app also offers resources and connections to pediatric specialists to guide you through every step of your child’s growth journey.",
  };

  // Định nghĩa styles bên trong component để sử dụng theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    scrollViewContent: {
      padding: 16,
      paddingBottom: 40, // Tăng paddingBottom để tạo cảm giác dài hơn
    },
    contentSection: {
      backgroundColor: "#fff",
    },
    dateText: {
      fontSize: 12,
      color: "#666",
      marginBottom: 12,
      fontStyle: "italic",
    },
    titleText: {
      fontSize: 28, // Tăng kích thước tiêu đề
      fontWeight: "bold",
      color: "#333",
      marginBottom: 16,
      lineHeight: 34,
      fontFamily: "GothamRnd-Medium", // Sử dụng font giống Navigator
    },
    excerptText: {
      fontSize: 16,
      color: "#444",
      marginBottom: 24,
      lineHeight: 24,
      fontStyle: "italic",
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      paddingLeft: 12,
    },
    contentText: {
      fontSize: 14,
      color: "#666",
      lineHeight: 24, // Tăng khoảng cách dòng để dễ đọc
      marginBottom: 32,
    },
    divider: {
      marginVertical: 24,
      backgroundColor: "#e0e0ff",
    },
    relatedArticlesSection: {
      marginTop: 32,
    },
    relatedArticlesTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 16,
    },
    relatedArticleItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    relatedArticleIcon: {
      marginRight: 12,
    },
    relatedArticleText: {
      fontSize: 14,
      color: "#444",
      flex: 1,
    },
    ctaCard: {
      backgroundColor: "#f9f9ff",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#e0e0ff",
      marginTop: 32,
      elevation: 3, // Tăng bóng cho Android
      shadowColor: "#000", // Bóng cho iOS
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
    },
    ctaContent: {
      flexDirection: "row",
      justifyContent: "space-between",
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
    },
    ctaButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingHorizontal: 12,
    },
  });

  // Dữ liệu giả cho phần bài viết liên quan
  const relatedArticles = [
    { id: 1, title: "Optimal nutrition for children aged 2-5" },
    { id: 2, title: "Ideal timing for assessing child growth" },
  ];

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
        {/* Blog Content */}
        <View style={styles.contentSection}>
          {/* Date */}
          <Text style={styles.dateText}>{blogPost.date}</Text>

          {/* Title */}
          <Text style={styles.titleText}>{blogPost.title}</Text>

          {/* Excerpt */}
          <Text style={styles.excerptText}>{blogPost.excerpt}</Text>

          {/* Full Content */}
          <Text style={styles.contentText}>{blogPost.content}</Text>

          {/* Divider */}
          <Divider style={styles.divider} />

          {/* Related Articles Section */}
          <View style={styles.relatedArticlesSection}>
            <Text style={styles.relatedArticlesTitle}>Related Articles</Text>
            {relatedArticles.map((article) => (
              <View key={article.id} style={styles.relatedArticleItem}>
                <Icon
                  name="book-open-outline"
                  size={20}
                  color={theme.colors.primary}
                  style={styles.relatedArticleIcon}
                />
                <Text style={styles.relatedArticleText}>{article.title}</Text>
                <Icon name="chevron-right" size={20} color="#ccc" />
              </View>
            ))}
          </View>

          {/* Call to Action */}
          <Card style={styles.ctaCard}>
            <Card.Content style={styles.ctaContent}>
              <View>
                <Text style={styles.ctaTitle}>Want more parenting tips?</Text>
                <Text style={styles.ctaText}>
                  Explore our knowledge-sharing blog for more insights and
                  advice.
                </Text>
              </View>
              <Button
                mode="contained"
                style={styles.ctaButton}
                labelStyle={{ color: "white" }}
                onPress={() => {}}>
                View All Blogs
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};
