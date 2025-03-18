import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import {
  Avatar,
  Card,
  FAB,
  useTheme,
  ActivityIndicator,
  TextInput,
  Button,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Text from "../components/Text";
import { format } from "date-fns";
import { useSnackbar } from "../contexts/SnackbarContext";
import Title from "../components/Title";
import api from "../configs/api";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");

const ChildScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  // Modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Selected child for update/delete
  const [selectedChild, setSelectedChild] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState(0);
  

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const response = await api.get("/children");
      setChildren(response.data.children);
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

  // Handle create child
  const handleCreateChild = async () => {
    try {
      const response = await api.post("/children", { name, birthDate, gender });
      setChildren([...children, response.data.child]);
      setCreateModalVisible(false);
      showSnackbar("Child created successfully!", 3000, "Close");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to create child. Please try again.",
        5000,
        "Close"
      );
    }
  };

  // Handle update child
  const handleUpdateChild = async () => {
    try {
      const response = await api.put(`/children/${selectedChild._id}`, {
        name,
        birthDate,
        gender,
      });
      const updatedChildren = children.map((child) =>
        child._id === selectedChild._id ? response.data.child : child
      );
      setChildren(updatedChildren);
      setUpdateModalVisible(false);
      showSnackbar("Child updated successfully!", 3000, "Close");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to update child. Please try again.",
        5000,
        "Close"
      );
    }
  };

  // Handle delete child
  const handleDeleteChild = async () => {
    try {
      await api.delete(`/children/${selectedChild._id}`);
      const updatedChildren = children.filter(
        (child) => child._id !== selectedChild._id
      );
      setChildren(updatedChildren);
      setDeleteModalVisible(false);
      showSnackbar("Child deleted successfully!", 3000, "Close");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to delete child. Please try again.",
        5000,
        "Close"
      );
    }
  };

  // Render child item
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
            <TouchableOpacity
              onPress={() => {
                setSelectedChild(item);
                setName(item.name);
                setBirthDate(item.birthDate);
                setGender(item.gender);
                setUpdateModalVisible(true);
              }}
            >
              <Icon name="edit" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedChild(item);
                setDeleteModalVisible(true);
              }}
            >
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
        />
      )}

      {/* Create Modal */}
      <Modal
        visible={createModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles(theme).modalContainer}>
          <View style={styles(theme).modalContent}>
            <Title text="Add Child" style={{ fontSize: 20, marginBottom: 20 }} />
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles(theme).input}
            />
            <TextInput
              label="Birth Date"
              value={birthDate}
              onChangeText={setBirthDate}
              style={styles(theme).input}
            />
            <TextInput
              label="Gender"
              value={gender}
              onChangeText={setGender}
              style={styles(theme).input}
            />
            <View style={styles(theme).modalButtons}>
              <Button
                mode="contained"
                onPress={handleCreateChild}
                style={styles(theme).button}
                textColor="white"
              >
                Save
              </Button>
              <Button
                mode="outlined"
                onPress={() => setCreateModalVisible(false)}
                style={styles(theme).button}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Modal */}
      <Modal
        visible={updateModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setUpdateModalVisible(false)}
      >
        <View style={styles(theme).modalContainer}>
          <View style={styles(theme).modalContent}>
            <Title text="Edit Child" style={{ fontSize: 20, marginBottom: 20 }} />
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles(theme).input}
            />
            <TextInput
              label="Birth Date"
              value={birthDate}
              onChangeText={setBirthDate}
              style={styles(theme).input}
            />
            <TextInput
              label="Gender"
              value={gender}
              onChangeText={setGender}
              style={styles(theme).input}
            />
            <View style={styles(theme).modalButtons}>
              <Button
                mode="contained"
                onPress={handleUpdateChild}
                style={styles(theme).button}
                textColor="white"
              >
                Update
              </Button>
              <Button
                mode="outlined"
                onPress={() => setUpdateModalVisible(false)}
                style={styles(theme).button}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles(theme).modalContainer}>
          <View style={styles(theme).modalContent}>
            <Title
              text="Delete Child"
              style={{ fontSize: 20, marginBottom: 20 }}
            />
            <Text style={{ marginBottom: 20 }}>
              Are you sure you want to delete {selectedChild?.name}?
            </Text>
            <View style={styles(theme).modalButtons}>
              <Button
                mode="contained"
                onPress={handleDeleteChild}
                style={[styles(theme).button, { backgroundColor: theme.colors.primary }]}
                textColor="white"
              >
                Delete
              </Button>
              <Button
                mode="outlined"
                onPress={() => setDeleteModalVisible(false)}
                style={styles(theme).button}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* FAB for Create Modal */}
      <FAB
        style={styles(theme).fab}
        icon="plus"
        color="white"
        onPress={() => {
          setName("");
          setBirthDate("");
          setGender("");
          setCreateModalVisible(true);
        }}
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
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: "90%",
      backgroundColor: "white",
      borderRadius: 10,
      padding: 20,
    },
    input: {
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "black",
      borderStyle: "solid",
      borderRadius: 4,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    button: {
      flex: 1,
      marginHorizontal: 5,
    },
  });