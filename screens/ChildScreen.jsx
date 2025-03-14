import React, { useCallback, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import {
  Avatar,
  Card,
  FAB,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { DynamicHeader } from "../components/DynamicHeader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Text from "../components/Text";
import { format } from "date-fns";
import axios from "axios";
import { useSnackbar } from "../contexts/SnackbarContext";
import { ScrollView } from "react-native";
import Title from "../components/Title";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");

const ChildScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const [children, setChildren] = useState([
    {
      _id: "67b6e52ce2def20232798e9e066",
      name: "T",
      birthDate: "2024-03-12T00:00:00.000Z",
      note: "note",
      gender: 0,
      relationships: [
        {
          memberId: "6797349eff664e2381d90ba2",
          type: "Parent",
          _id: "67b6e52ce2def20798e9e067",
        },
      ],
      createdAt: "2025-02-20T08:17:48.043Z",
      updatedAt: "2025-02-24T12:36:40.778Z",
    },
    {
      _id: "67b6e52ce2def23e066",
      name: "T",
      birthDate: "2024-03-12T00:00:00.000Z",
      note: "note",
      gender: 0,
      relationships: [
        {
          memberId: "6797349eff664e2381d90ba2",
          type: "Parent",
          _id: "67b6e52ce2def20798e9e067",
        },
      ],
      createdAt: "2025-02-20T08:17:48.043Z",
      updatedAt: "2025-02-24T12:36:40.778Z",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const fetchChildren = async () => {
    setLoading(true);
    try {
      // const response = await axios.get("http://localhost:4000/api/children");
      // setChildren(response.data.children);
    } catch (error) {
      showSnackbar(
        error.response?.data?.message ||
          "Failed to load children. Please try again.",
        5000,
        "Close"
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChildren();
    }, [])
  );

  const renderChildItem = ({ item }) => {
    const formattedBirthDate = format(new Date(item.birthDate), "MMM d, yyyy");

    return (
      <Card
        style={styles(theme).childContainer}
        onPress={() => navigation.navigate("ChildDetails", { child: item })}
      >
        <Card.Content style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar.Text
            size={50}
            label={getInitials(item.name)}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={styles(theme).childInfo}>
            <Text variant="medium" style={styles(theme).childName}>
              {item.name}
            </Text>
            <View style={styles(theme).childDetails}>
              <Text style={[styles(theme).birthDate, { marginRight: 5 }]}>
                {formattedBirthDate}
              </Text>
              <Icon
                name={item.gender === "male" ? "male" : "female"}
                size={20}
              />
            </View>
          </View>
          <View style={styles(theme).iconContainer}>
            <TouchableOpacity>
              <Icon name="edit" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles(theme).container}>
      <Title text="My children" style={{ fontSize: 24, marginVertical: 20 }} />
      {loading ? (
        <View style={styles(theme).loadingContainer}>
          <ActivityIndicator
            animating={true}
            size="large"
            color={theme.colors.primary}
          />
        </View>
      ) : (
        <FlatList
          data={children}
          renderItem={renderChildItem}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles(theme).listContainer}
          style={styles(theme).scrollViewWrapper}
        />
      )}
      <FAB
        style={styles(theme).fab}
        icon="plus"
        color="white"
        onPress={() => {}}
      />
    </View>
  );
};

export default ChildScreen;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    listContainer: {
      padding: 16,
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    childContainer: {
      backgroundColor: "white",
      marginBottom: 10,
      borderRadius: 10,
      elevation: 1,
    },
    childInfo: {
      flex: 1,
      marginLeft: 20,
    },
    childName: {
      fontSize: 18,
    },
    childDetails: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 5,
    },
    birthDate: {
      fontSize: 14,
      color: theme.colors.text,
    },
    iconContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginLeft: 10,
    },
    fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary,
    },
  });
