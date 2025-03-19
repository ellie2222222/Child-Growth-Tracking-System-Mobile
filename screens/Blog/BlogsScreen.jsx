import React, { useEffect, useState } from "react";
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
import api from "../../configs/api";

const BlogsScreen = ({ navigation }) => {
  const theme = useTheme();
  const scrollOffsetY = new Animated.Value(0);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const PAGE_SIZE = 5; // Number of posts per page

  const fetchBlogPosts = async (pageNum, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      console.log("Fetching blog posts with params:", {
        page: pageNum,
        size: PAGE_SIZE,
        sortBy: "date",
        order: "descending",
      });

      const response = await api.get("/posts", {
        params: {
          page: pageNum,
          size: PAGE_SIZE,
          sortBy: "date",
          order: "descending",
        },
      });

      if (!response.data || !response.data.posts) {
        throw new Error("Invalid blog post data received from API");
      }

      const posts = response.data.posts.map((post) => ({
        id: post._id,
        title: post.title,
        thumbnail: post.thumbnailUrl || bannerImage,
        date: new Date(post.createdAt).toLocaleDateString(),
        excerpt:
          post.content.replace(/<[^>]+>/g, "").substring(0, 60) + "..." ||
          "No excerpt available",
      }));

      if (append) {
        setBlogPosts((prevPosts) => [...prevPosts, ...posts]);
      } else {
        setBlogPosts(posts);
      }

      if (response.data.posts.length < PAGE_SIZE) {
        setHasMore(false);
      }

      console.log("Blog posts fetched successfully:", posts);
    } catch (err) {
      console.error(
        "Error fetching blog posts:",
        err.response ? err.response.data : err.message
      );
      setError(err.message || "Failed to fetch blog posts");
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBlogPosts(page);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBlogPosts(nextPage, true);
    }
  };

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
      elevation: 3,
      shadowColor: "#000",
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
    loadMoreButton: {
      marginVertical: 16,
      alignSelf: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingHorizontal: 16,
    },
    loadMoreText: {
      color: "white",
      fontWeight: "500",
    },
    noMoreText: {
      textAlign: "center",
      color: "#666",
      marginVertical: 16,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Knowledge Sharing Blogs</Text>
          <Text style={styles.headerDescription}>
            Discover tips, insights, and expert advice on child development,
            nutrition, and parenting to support your child’s growth journey.
          </Text>
        </View>

        <View style={styles.blogSection}>
          {loading && blogPosts.length === 0 ? (
            <Text>Loading blog posts...</Text>
          ) : error ? (
            <Text style={{ color: "red" }}>Error: {error}</Text>
          ) : (
            blogPosts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={styles.blogItem}
                onPress={() =>
                  navigation.navigate("BlogDetailed", { postId: post.id })
                }>
                <Image
                  source={
                    typeof post.thumbnail === "string"
                      ? { uri: post.thumbnail }
                      : post.thumbnail
                  }
                  style={styles.blogThumbnail}
                />
                <View style={styles.blogContent}>
                  <Text style={styles.blogTitle}>{post.title}</Text>
                  <Text style={styles.blogExcerpt} numberOfLines={2}>
                    {post.excerpt}
                  </Text>
                  <Text style={styles.blogDate}>{post.date}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {blogPosts.length > 0 && (
          <View>
            {hasMore ? (
              <Button
                mode="contained"
                style={styles.loadMoreButton}
                onPress={handleLoadMore}
                loading={loadingMore}
                disabled={loadingMore}>
                <Text style={styles.loadMoreText}>
                  {loadingMore ? "Loading..." : "Load More"}
                </Text>
              </Button>
            ) : (
              <Text style={styles.noMoreText}>No more posts to load</Text>
            )}
          </View>
        )}

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
