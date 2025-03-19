import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import {
  useTheme,
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
} from "react-native-paper";
import { DynamicHeader } from "../components/DynamicHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import bannerImage from "../assets/banner_img.jpg";
import { useNavigation } from "@react-navigation/native";
import api from "../configs/api";

const windowWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  const theme = useTheme();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const navigation = useNavigation();
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        setLoading(true);
        const response = await api.get("/membership-packages");

        if (!response.data || !response.data.packages) {
          throw new Error("Invalid data format received from API");
        }

        const mappedPlans = response.data.packages.map((plan) => ({
          id: plan._id,
          name: plan.name,
          price: `${plan.price.value.toLocaleString()} ${plan.price.unit}`,
          features: [
            plan.description,
            `Post Limit: ${plan.postLimit}`,
            `Update Child Data Limit: ${plan.updateChildDataLimit}`,
            `Download Chart Limit: ${plan.downloadChart}`,
            `Duration: ${plan.duration.value} ${plan.duration.unit}(s)`,
          ],
        }));

        setMembershipPlans(mappedPlans);
      } catch (err) {
        console.error("Error fetching membership plans:", err);
        setError(err.message || "Failed to fetch membership plans");
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipPlans();
  }, []);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setBlogLoading(true);
        const response = await api.get("/posts", {
          params: {
            page: 1,
            size: 3,
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
          thumbnail: post.thumbnailUrl || null, // Ensure thumbnail is a string or null
          date: new Date(post.createdAt).toLocaleDateString(),
          excerpt:
            post.content
              .replace(/<[^>]+>/g, "") // Strip HTML tags
              .substring(0, 60) + "..." || "No excerpt available", // Generate excerpt
        }));

        setBlogPosts(posts);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setBlogError(err.message || "Failed to fetch blog posts");
      } finally {
        setBlogLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const toggleFaq = (id) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const features = [
    {
      id: 1,
      title: "Track Growth",
      description: "Height, weight and BMI charts according to WHO standards",
      icon: "chart-line",
      color: theme.colors.primary,
    },
    {
      id: 2,
      title: "Smart Alerts",
      description: "Early detection of nutrition and development issues",
      icon: "bell-alert",
      color: "#FF8C00",
    },
    {
      id: 3,
      title: "Doctor Consultation",
      description: "Connect with nutrition and pediatric specialists",
      icon: "doctor",
      color: "#4682B4",
    },
    {
      id: 4,
      title: "Multiple Child Tracking",
      description: "Manage growth profiles for multiple children in the family",
      icon: "account-multiple",
      color: "#9370DB",
    },
  ];

  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "How can I track multiple children in one account?",
      answer:
        "You can add profiles for multiple children in the 'Profile Management' section. Each child will have their own growth chart.",
    },
    {
      id: 2,
      question: "How can I share data with doctors?",
      answer:
        "On the child's details page, select the 'Share' button and choose your preferred sharing method.",
    },
    {
      id: 3,
      question: "Which standards are the growth charts based on?",
      answer:
        "GrowEasy uses WHO and CDC growth standards, adjusted for Vietnamese children.",
    },
  ];

  const renderHeroSection = () => (
    <View style={styles.heroSection}>
      <View style={{ padding: 16, height: 200 }}>
        <Image source={bannerImage} style={styles.heroImage} />
      </View>
      <View style={styles.heroContent}>
        <Title style={styles.heroTitle}>Track your child's development</Title>
        <Paragraph style={styles.heroDescription}>
          GrowEasy helps you comprehensively monitor your child's growth from
          infancy to adulthood with medical-standard charts.
        </Paragraph>
        <TouchableOpacity
          mode="contained"
          style={{
            backgroundColor: theme.colors.primary,
            marginTop: 10,
            paddingVertical: 15,
            borderRadius: 50,
            alignItems: "center",
          }}
          onPress={() => {}}>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontFamily: theme.fonts.medium.fontFamily,
            }}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAppInfo = () => (
    <View style={styles.appInfoSection}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: theme.colors.primary,
            fontFamily: theme.fonts.medium.fontFamily,
          },
        ]}>
        About GrowEasy
      </Text>
      <Paragraph style={styles.appInfoText}>
        GrowEasy is a software for tracking children's growth from birth to
        adulthood, developed by leading pediatricians and nutritional experts.
      </Paragraph>
      <Paragraph style={styles.appInfoText}>
        With medical-standard growth charts, the app helps parents monitor their
        child's development, detect early abnormalities, and receive advice from
        medical specialists.
      </Paragraph>
    </View>
  );

  const renderFeatureHighlights = () => (
    <View style={styles.featuresSection}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: theme.colors.primary,
            fontFamily: theme.fonts.medium.fontFamily,
          },
        ]}>
        Key Features
      </Text>
      {features.map((feature) => (
        <TouchableOpacity key={feature.id} style={styles.featureItem}>
          <View
            style={[
              styles.featureIconContainer,
              { backgroundColor: feature.color },
            ]}>
            <Icon name={feature.icon} size={24} color="white" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderBlogPosts = () => (
    <View style={styles.blogSection}>
      <View style={styles.sectionTitleRow}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.primary,
              fontFamily: theme.fonts.medium.fontFamily,
            },
          ]}>
          Knowledge Sharing Blogs
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Blogs")}>
          <Text style={{ color: theme.colors.primary }}>View All</Text>
        </TouchableOpacity>
      </View>

      {blogLoading ? (
        <Text>Loading blog posts...</Text>
      ) : blogError ? (
        <Text style={{ color: "red" }}>Error: {blogError}</Text>
      ) : (
        blogPosts.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={styles.blogItem}
            onPress={() => {
              navigation.navigate("BlogDetailed", { postId: post.id });
            }}>
            <Image
              source={{ uri: post.thumbnail }}
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
  );

  const renderMembershipPlans = () => (
    <View style={styles.membershipSection}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: theme.colors.primary,
            fontFamily: theme.fonts.medium.fontFamily,
          },
        ]}>
        Membership Plans
      </Text>

      {loading ? (
        <Text>Loading membership plans...</Text>
      ) : error ? (
        <Text style={{ color: "red" }}>Error: {error}</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.membershipScroll}>
          {membershipPlans.map((plan) => (
            <Card key={plan.id} style={styles.membershipCard}>
              <Card.Content>
                <Title style={styles.membershipName}>{plan.name}</Title>
                <Title style={styles.membershipPrice}>{plan.price}</Title>

                {plan.features.map((feature, idx) => (
                  <View key={idx} style={styles.membershipFeature}>
                    <Icon
                      name="check-circle"
                      size={16}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.membershipFeatureText}>{feature}</Text>
                  </View>
                ))}

                <Button
                  mode={plan.price === "699,000 VND" ? "outlined" : "contained"}
                  style={styles.membershipButton}
                  labelStyle={{
                    color:
                      plan.price === "699,000 VND"
                        ? theme.colors.primary
                        : "white",
                  }}
                  onPress={() => {}}>
                  {plan.price === "699,000 VND" ? "Sign Up" : "Upgrade"}
                </Button>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderFAQSection = () => (
    <View style={styles.faqSection}>
      <View style={styles.sectionTitleRow}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.primary,
              fontFamily: theme.fonts.medium.fontFamily,
            },
          ]}>
          FAQs
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("FAQs")}>
          <Text style={{ color: theme.colors.primary }}>View All</Text>
        </TouchableOpacity>
      </View>

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
                  : { marginBottom: 4 },
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
  );

  const renderCallToAction = () => (
    <View style={styles.ctaSection}>
      <Card style={styles.ctaCard}>
        <Card.Content style={styles.ctaContent}>
          <View>
            <Title style={styles.ctaTitle}>
              Ready to track your child's development?
            </Title>
            <Paragraph style={styles.ctaText}>
              Sign up today to start tracking your child's growth
              scientifically.
            </Paragraph>
          </View>
          <Button
            mode="contained"
            style={{ backgroundColor: theme.colors.primary }}
            onPress={() => {}}>
            Sign Up
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <DynamicHeader value={scrollOffsetY} title={"Home"} />
      <View style={styles.scrollViewWrapper}>
        <ScrollView
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
            { useNativeDriver: false }
          )}
          contentContainerStyle={styles.scrollViewContent}>
          {renderHeroSection()}
          {renderAppInfo()}
          {renderFeatureHighlights()}
          {renderMembershipPlans()}
          {renderBlogPosts()}
          {renderFAQSection()}
          {renderCallToAction()}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewWrapper: {
    flex: 1,
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heroSection: {
    marginBottom: 20,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  heroContent: {
    padding: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  appInfoSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  appInfoText: {
    marginBottom: 8,
    lineHeight: 20,
  },
  featuresSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontWeight: "500",
    fontSize: 16,
  },
  featureDescription: {
    color: "#666",
    fontSize: 12,
  },
  blogSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  blogItem: {
    flexDirection: "row",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 16,
  },
  blogThumbnail: {
    width: 100,
    height: 70,
    borderRadius: 6,
  },
  blogContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  blogTitle: {
    fontWeight: "500",
    fontSize: 14,
    marginBottom: 4,
  },
  blogExcerpt: {
    fontSize: 12,
    color: "#444",
    marginBottom: 4,
  },
  blogDate: {
    color: "#666",
    fontSize: 12,
  },
  membershipSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  membershipScroll: {
    paddingBottom: 8,
  },
  membershipCard: {
    width: windowWidth * 0.7,
    marginRight: 15,
    elevation: 2,
    backgroundColor: "#f9f9f9",
  },
  membershipName: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 6,
  },
  membershipPrice: {
    fontSize: 22,
    marginBottom: 16,
  },
  membershipFeature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  membershipFeatureText: {
    marginLeft: 8,
    fontSize: 14,
  },
  membershipButton: {
    marginTop: 12,
  },
  faqSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  faqItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  faqContent: {
    flex: 1,
    marginRight: 8,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  faqAnswerContainer: {
    overflow: "hidden",
    marginTop: 8,
  },
  faqAnswer: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#4682B4",
    paddingBottom: 4,
  },
  ctaSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  ctaCard: {
    backgroundColor: "#f8f8ff",
    borderWidth: 1,
    borderColor: "#e0e0ff",
  },
  ctaContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  ctaText: {
    fontSize: 13,
    color: "#444",
    width: "80%",
  },
});

export default HomeScreen;
