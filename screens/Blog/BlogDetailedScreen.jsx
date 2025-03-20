import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Image,
  ActivityIndicator,
} from "react-native";
import { useTheme, Text, Card, Button, Divider } from "react-native-paper";
import api from "../../configs/api";
import { useFocusEffect } from "@react-navigation/native";
import bannerImage from "../../assets/banner_img.jpg";

export const BlogDetailedScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const scrollOffsetY = new Animated.Value(0);
  const { postId } = route.params || {};
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchBlogPost = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/posts/${postId}`);
  
          if (!response.data || !response.data.post) {
            throw new Error("Invalid blog post data received from API");
          }
  
          const post = response.data.post;
          setBlogPost({
            id: post._id,
            title: post.title,
            date: new Date(post.createdAt).toLocaleDateString(),
            content: post.content.replace(/<[^>]+>/g, ""),
            thumbnail:
              post.thumbnailUrl === "" || post.thumbnailUrl === undefined
                ? bannerImage
                : post.thumbnailUrl, 
          });
        } catch (err) {
          setError(err.message || "Failed to fetch blog post");
        } finally {
          setLoading(false);
        }
      };
  
      if (postId) {
        fetchBlogPost();
      } else {
        setLoading(false);
        setError("No post ID provided");
      }
    }, [postId])
  );

  const styles = (theme) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    scrollViewContent: {
      padding: 16,
      paddingBottom: 40,
    },
    contentSection: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    header: {
      marginBottom: 20,
    },
    thumbnail: {
      width: "100%",
      height: 200,
      borderRadius: 12,
      marginBottom: 16,
    },
    dateText: {
      fontSize: 14,
      color: "#777",
      marginBottom: 8,
      fontFamily: theme.fonts.medium.fontFamily,
    },
    titleText: {
      fontSize: 28, 
      color: "#1a1a1a",
      marginBottom: 12,
      lineHeight: 34,
      fontFamily: theme.fonts.medium.fontFamily,
    },
    excerptText: {
      fontSize: 16,
      color: "#444",
      marginBottom: 20,
      lineHeight: 24,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      paddingLeft: 12,
      backgroundColor: "#f9f9f9",
      paddingVertical: 10,
      borderRadius: 8,
      fontFamily: theme.fonts.medium.fontFamily,
    },
    contentText: {
      fontSize: 16,
      color: "#333",
      lineHeight: 26,
      marginBottom: 24,
      textAlign: "justify",
      fontFamily: theme.fonts.medium.fontFamily,
    },
    divider: {
      height: 1,
      backgroundColor: "#e0e0e0",
      marginVertical: 24,
    },
    ctaCard: {
      backgroundColor: "#eef2ff",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#d0d8ff",
      marginTop: 32,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    ctaContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
    },
    ctaTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.medium.fontFamily,
      color: "#1a1a1a", 
    },
    ctaText: {
      fontSize: 14,
      color: "#555",
      width: "65%",
      fontFamily: theme.fonts.medium.fontFamily,
    },
    ctaButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingHorizontal: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      color: "#d32f2f",
      textAlign: "center",
      marginTop: 20,
      fontFamily: theme.fonts.medium.fontFamily,
    },
  });

  return (
    <View style={styles(theme).container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles(theme).scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}>
        {loading ? (
          <View style={styles(theme).loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles(theme).errorText}>Loading post details...</Text>
          </View>
        ) : error ? (
          <View style={styles(theme).loadingContainer}>
            <Text style={styles(theme).errorText}>Error: {error}</Text>
            <Button
              mode="contained"
              style={styles(theme).ctaButton}
              onPress={() => navigation.goBack()}
              labelStyle={{ color: "white" }}>
              Go Back
            </Button>
          </View>
        ) : blogPost ? (
          <View style={styles(theme).contentSection}>
            {/* Thumbnail */}
            <Image
              source={{ uri: blogPost.thumbnail }}
              style={styles(theme).thumbnail}
            />

            {/* Date */}
            <Text style={styles(theme).dateText}>{blogPost.date}</Text>

            {/* Title */}
            <Text style={styles(theme).titleText}>{blogPost.title}</Text>

            {/* Full Content */}
            <Text style={styles(theme).contentText}>{blogPost.content}</Text>

            {/* Divider */}
            <Divider style={styles(theme).divider} />

            {/* Call to Action */}
            <Card style={styles(theme).ctaCard}>
              <Card.Content style={styles(theme).ctaContent}>
                <View>
                  <Text style={styles(theme).ctaTitle}>Want more parenting tips?</Text>
                  <Text style={styles(theme).ctaText}>
                    Explore our knowledge-sharing blog for more insights and
                    advice.
                  </Text>
                </View>
                <Button
                  mode="contained"
                  style={styles(theme).ctaButton}
                  labelStyle={{ color: "white" }}
                  onPress={() => navigation.navigate("Blogs")}>
                  View All Blogs
                </Button>
              </Card.Content>
            </Card>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};
