import React, { useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { DynamicHeader } from "../components/DynamicHeader";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");

const ChildScreen = () => {
  const theme = useTheme();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const children = [
    { id: 1, name: "Child 1", avatar: require("../assets/bg.jpg") },
    { id: 2, name: "Child 2", avatar: require("../assets/bg.jpg") },
    { id: 3, name: "Child 3", avatar: require("../assets/bg.jpg") },
    { id: 4, name: "Child 3", avatar: require("../assets/bg.jpg") },
    { id: 5, name: "Child 3", avatar: require("../assets/bg.jpg") },
    { id: 6, name: "Child 3", avatar: require("../assets/bg.jpg") },
    { id: 7, name: "Child 3", avatar: require("../assets/bg.jpg") },
  ];

  const renderChildAvatar = ({ item }) => (
    <View style={styles.avatarContainer}>
      <Avatar.Text
        size={80}
        label={getInitials(item.name)}
        labelStyle={{ color: "white" }}
        style={[styles.avatar, { backgroundColor: theme.colors.primary}]}
      />
      <Text style={[styles.childName, { color: theme.colors.text }]}>
        {item.name}
      </Text>
    </View>
  );

  const renderAddChildButton = () => (
    <TouchableOpacity style={styles.addChildButton}>
      <Icon name="add" size={30} color={theme.colors.primary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <DynamicHeader value={scrollOffsetY} title="Child" />
      <View style={styles.scrollViewWrapper}>
        <ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
            { useNativeDriver: false }
          )}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.flatListWrapper}>
            <FlatList
              horizontal
              data={children}
              renderItem={renderChildAvatar}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.horizontalList, { backgroundColor: theme.colors.secondary }]}
              ListFooterComponent={renderAddChildButton}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ChildScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  scrollViewWrapper: {
    flex: 1,
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  flatListWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 10, 
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    // Android Shadow
    elevation: 2,
  },  
  horizontalList: {
    padding: 10, 
  },
  avatarContainer: {
    alignItems: "center",
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  childName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  addChildButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#EF6351",
    justifyContent: "center",
    alignItems: "center",
  },
});
