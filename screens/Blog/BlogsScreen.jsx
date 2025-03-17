import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useTheme, Text, Card, Button } from "react-native-paper";
import bannerImage from "../../assets/banner_img.jpg";

const BlogsScreen = ({ navigation }) => {
  const theme = useTheme();
  const scrollOffsetY = new Animated.Value(0);

  const blogPosts = [
    {
      id: 1,
      title: "5 child development signs to watch for",
      thumbnail: bannerImage,
      date: "03/10/2025",
      excerpt:
        "Early detection of abnormal signs helps with timely intervention...",
    },
    {
      id: 2,
      title: "Optimal nutrition for children aged 2-5",
      thumbnail: bannerImage,
      date: "03/05/2025",
      excerpt: "Foods to add to ensure comprehensive development...",
    },
    {
      id: 3,
      title: "Ideal timing for assessing child growth",
      thumbnail: bannerImage,
      date: "03/01/2025",
      excerpt: "Schedule for monitoring height and weight by stage...",
    },
    {
      id: 4,
      title: "How to support your child’s emotional growth",
      thumbnail: bannerImage,
      date: "02/25/2025",
      excerpt: "Tips to nurture emotional intelligence in children...",
    },
    {
      id: 5,
      title: "Understanding your child’s sleep patterns",
      thumbnail: bannerImage,
      date: "02/20/2025",
      excerpt: "How sleep impacts growth and development...",
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
      fontFamily: "GothamRnd-Medium", // Đồng bộ font với Navigator
    },
    headerDescription: {
      fontSize: 14,
      color: "#666",
      lineHeight: 20,
    },
    blogSection: {
      marginBottom: 32,
    },
    blogItem: {
      flexDirection: "row",
      marginBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
      paddingBottom: 16,
    },
    blogThumbnail: {
      width: 100,
      height: 70,
      borderRadius: 8,
      marginRight: 12,
    },
    blogContent: {
      flex: 1,
      justifyContent: "space-between",
    },
    blogTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: "#333",
      marginBottom: 4,
    },
    blogExcerpt: {
      fontSize: 13,
      color: "#666",
      marginBottom: 8,
      lineHeight: 18,
    },
    blogDate: {
      fontSize: 12,
      color: "#999",
      fontStyle: "italic",
    },
    ctaCard: {
      backgroundColor: "#f9f9ff",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#e0e0ff",
      marginTop: 16,
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
          <Text style={styles.headerTitle}>Knowledge Sharing Blogs</Text>
          <Text style={styles.headerDescription}>
            Discover tips, insights, and expert advice on child development,
            nutrition, and parenting to support your child’s growth journey.
          </Text>
        </View>

        {/* Blog Posts */}
        <View style={styles.blogSection}>
          {blogPosts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.blogItem}
              onPress={() => navigation.navigate("BlogDetailed")}>
              <Image source={post.thumbnail} style={styles.blogThumbnail} />
              <View style={styles.blogContent}>
                <Text style={styles.blogTitle}>{post.title}</Text>
                <Text style={styles.blogExcerpt} numberOfLines={2}>
                  {post.excerpt}
                </Text>
                <Text style={styles.blogDate}>{post.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Call to Action */}
        <Card style={styles.ctaCard}>
          <Card.Content style={styles.ctaContent}>
            <View>
              <Text style={styles.ctaTitle}>Want to learn more?</Text>
              <Text style={styles.ctaText}>
                Stay updated with the latest parenting tips and insights from
                our experts.
              </Text>
            </View>
            <Button
              mode="contained"
              style={styles.ctaButton}
              labelStyle={{ color: "white" }}
              onPress={() => {}}>
              Subscribe Now
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default BlogsScreen;
