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
import { useSnackbar } from "../contexts/SnackbarContext";
import Title from "../components/Title";
import api from "../configs/api";
import { MultipleSelectList, SelectList } from "react-native-dropdown-select-list";
import { DatePickerInput, DatePickerModal, registerTranslation } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { format, parseISO } from "date-fns";

registerTranslation("en", {
  save: "Save",
  selectSingle: "Select date",
  selectMultiple: "Select dates",
  selectRange: "Select period",
  notAccordingToDateFormat: (inputFormat) =>
    `Date format must be ${inputFormat}`,
  mustBeHigherThan: (date) => `Must be later than ${date}`,
  mustBeLowerThan: (date) => `Must be earlier than ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Must be between ${startDate} - ${endDate}`,
  dateIsDisabled: "Day is not allowed",
  previous: "Previous",
  next: "Next",
  typeInDate: "Type in date",
  pickDateFromCalendar: "Pick date from calendar",
  close: "Close",
});

const GenderEnum = {
  BOY: 0,
  GIRL: 1,
};

const AllergyEnum = {
  NONE: "NONE",
  N_A: "N/A",
  DRUG_ALLERGY: "DRUG_ALLERGY",
  FOOD_ALLERGY: "FOOD_ALLERGY",
  LATEX_ALLERGY: "LATEX_ALLERGY",
  MOLD_ALLERGY: "MOLD_ALLERGY",
  PET_ALLERGY: "PET_ALLERGY",
  POLLEN_ALLERGY: "POLLEN_ALLERGY",
};

const FeedingTypeEnum = {
  N_A: "N/A",
  BREASTFEEDING: "BREASTFEEDING",
  FORMULA_FEEDING: "FORMULA_FEEDING",
  SOLID_FOODS: "SOLID_FOODS",
};

const RelationshipEnum = {
  PARENT: "Parent",
  SIBLING: "Sibling",
  GUARDIAN: "Guardian",
};

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
  
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  const [selectedChild, setSelectedChild] = useState(null);
  
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState(0);
  const [feedingType, setFeedingType] = useState(FeedingTypeEnum.N_A);
  const [allergies, setAllergies] = useState([]);
  const [relationship, setRelationship] = useState(RelationshipEnum.PARENT);
  
  const genderOptions = [
    { key: GenderEnum.BOY, value: "Boy" },
    { key: GenderEnum.GIRL, value: "Girl" },
  ];

  const feedingTypeOptions = [
    { key: FeedingTypeEnum.N_A, value: "N/A" },
    { key: FeedingTypeEnum.BREASTFEEDING, value: "Breastfeeding" },
    { key: FeedingTypeEnum.FORMULA_FEEDING, value: "Formula Feeding" },
    { key: FeedingTypeEnum.SOLID_FOODS, value: "Solid Foods" },
  ];

  const allergyOptions = [
    { key: AllergyEnum.NONE, value: "NONE" },
    { key: AllergyEnum.N_A, value: "N/A" },
    { key: AllergyEnum.DRUG_ALLERGY, value: "DRUG_ALLERGY" },
    { key: AllergyEnum.FOOD_ALLERGY, value: "FOOD_ALLERGY" },
    { key: AllergyEnum.LATEX_ALLERGY, value: "LATEX_ALLERGY" },
    { key: AllergyEnum.MOLD_ALLERGY, value: "MOLD_ALLERGY" },
    { key: AllergyEnum.PET_ALLERGY, value: "PET_ALLERGY" },
    { key: AllergyEnum.POLLEN_ALLERGY, value: "POLLEN_ALLERGY" },
  ];

  const relationshipOptions = [
    { key: AllergyEnum.PARENT, value: "Parent" },
    { key: AllergyEnum.SIBLING, value: "Sibling" },
    { key: AllergyEnum.GUARDIAN, value: "Guardian" },
  ];
  
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

  const handleCreateChild = async () => {
    setLoading(true)
    try {
      await api.post("/children", {
        name,
        birthDate,
        gender,
        feedingType,
        allergies,
        relationship,
        note
      });
      await fetchChildren();
      setCreateModalVisible(false);
      showSnackbar("Child created successfully!", 3000, "Close");
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.validationErrors && Array.isArray(data.validationErrors)) {
          data.validationErrors.forEach((err) => {
            showSnackbar(err.error || "Validation error occurred", 5000, "Close");
          });
        } else {
          showSnackbar(
            data.message || "Failed to create child. Please try again.",
            5000,
            "Close"
          );
        }
      } else {
        
        showSnackbar("Network error. Please try again.", 5000, "Close");
      }
    } finally {
      setLoading(false);
    }
  };

  
  const handleUpdateChild = async () => {
    setLoading(true)
    try {
      await api.put(`/children/${selectedChild._id}`, {
        name,
        birthDate,
        gender,
        feedingType,
        allergies,
        relationship,
        note
      });
      await fetchChildren();
      setUpdateModalVisible(false);
      showSnackbar("Child updated successfully!", 5000, "Close");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to update child. Please try again.",
        5000,
        "Close"
      );
    } finally {
      setLoading(false)
    }
  };

  
  const handleDeleteChild = async () => {
    setLoading(true)
    try {
      await api.delete(`/children/${selectedChild._id}`);
      const updatedChildren = children.filter(
        (child) => child._id !== selectedChild._id
      );
      setChildren(updatedChildren);
      setDeleteModalVisible(false);
      showSnackbar("Child deleted successfully!", 5000, "Close");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to delete child. Please try again.",
        5000,
        "Close"
      );
    } finally {
      setLoading(false)
    }
  };

  
  const renderChildItem = ({ item }) => {
    const formattedBirthDate = format(parseISO(item.birthDate), "yyyy-MM-dd")

    return (
      <Card
        style={styles(theme).childContainer}
        onPress={() => navigation.navigate("ChildDetails", { childId: item._id })}
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
                setNote(item.note);
                setBirthDate(item.birthDate);
                setGender(item.gender);
                setFeedingType(item.feedingType);
                setAllergies([]);
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
          <Text style={{ color: theme.colors.primary }}>Loading...</Text>
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
              label="Note"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              style={styles(theme).input}
            />
            <SelectList
              setSelected={(val) => setGender(val)}
              data={genderOptions}
              save="key"
              placeholder="Select Gender"
              search={false}
              boxStyles={styles(theme).dropdownBox}
              dropdownStyles={styles(theme).dropdown}
            />
            <SelectList
              setSelected={(val) => setFeedingType(val)}
              data={feedingTypeOptions}
              save="key"
              placeholder="Select Feeding Type"
              search={false}
              boxStyles={styles(theme).dropdownBox}
              dropdownStyles={styles(theme).dropdown}
            />
            <SelectList
              setSelected={(val) => setRelationship(val)}
              data={relationshipOptions}
              save="key"
              placeholder="Select Relationship"
              search={false}
              boxStyles={styles(theme).dropdownBox}
              dropdownStyles={styles(theme).dropdown}
            />
            <MultipleSelectList
              setSelected={(val) => setAllergies(val)} 
              data={allergyOptions}
              save="value"
              placeholder="Select Allergies"
              search={false}
              boxStyles={styles(theme).dropdownBox}
              dropdownStyles={styles(theme).dropdown}
              onSelect={() => console.log("press")}
            />     
            
            <SafeAreaProvider>
              <View style={{ marginTop: 16 }}>
                <DatePickerInput
                  locale="en"
                  label="Birth Date"
                  value={birthDate}
                  onChange={(date) => setBirthDate(date)}
                  inputMode="start"
                  mode="outlined"
                  dateFormat="yyyy-MM-dd"
                />
              </View>
            </SafeAreaProvider>
            
            <View style={[styles(theme).modalButtons, { marginTop: 60 }]}>
              <Button
                mode="contained"
                onPress={handleCreateChild}
                style={styles(theme).button}
                textColor="white"
                disabled={loading}
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
              label="Note"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              style={styles(theme).input}
            />
            <SelectList
              setSelected={(val) => setGender(val)}
              data={genderOptions}
              save="key"
              placeholder="Select Gender"
              search={false}
              boxStyles={styles(theme).dropdownBox}
              dropdownStyles={styles(theme).dropdown}
            />
            <SelectList
              setSelected={(val) => setFeedingType(val)}
              data={feedingTypeOptions}
              save="key"
              placeholder="Select Feeding Type"
              search={false}
              boxStyles={styles(theme).dropdownBox}
              dropdownStyles={styles(theme).dropdown}
            />
            <MultipleSelectList
              setSelected={(val) => setAllergies(val)} 
              data={allergyOptions}
              save="value"
              placeholder="Select Allergies"
              search={false}
              boxStyles={styles(theme).dropdownBox}
              dropdownStyles={styles(theme).dropdown}
              onSelect={() => console.log("press")}
            />

            <SafeAreaProvider>
              <View style={{ marginTop: 30 }}>
                <DatePickerInput
                  withModal
                  locale="en"
                  label="Birth Date"
                  onChange={(date) => setBirthDate(date)}
                  inputMode="start"
                  mode="single"
                  dateFormat="yyyy-MM-dd"
                  style={styles(theme).input}
                />
              </View>
            </SafeAreaProvider>
            
            <View style={[styles(theme).modalButtons, {marginTop: 60}]}>
              <Button
                mode="contained"
                onPress={handleUpdateChild}
                style={styles(theme).button}
                textColor="white"
                disabled={loading}
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
                disabled={loading}
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
          setNote("");
          setBirthDate("");
          setGender(0);
          setFeedingType(FeedingTypeEnum.N_A);
          setAllergies([]);
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
      display: "flex",
      justifyContent: "space-between",
      gap: 5
    },
    input: {
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "black",
      borderStyle: "solid",
      borderRadius: 4,
    },
    dropdownBox: {
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 4,
      marginBottom: 16,
    },
    dropdown: {
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 4,
    },
    chipContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 16,
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginRight: 5,
      marginBottom: 5,
    },
    chipText: {
      color: "white",
      marginRight: 5,
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