import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import {
  Avatar,
  Divider,
  FAB,
  useTheme,
  Button,
  IconButton,
} from "react-native-paper";
import { format } from "date-fns";
import api from "../configs/api";
import {
  useFocusEffect,
  useRoute,
  useNavigation,
} from "@react-navigation/native";
import { useSnackbar } from "../contexts/SnackbarContext";
import Title from "../components/Title";
import CreateGrowthData from "../components/GrowthData/CreateGrowthData";
import UpdateGrowthData from "../components/GrowthData/UpdateGrowthData";
import { LineChart } from "react-native-chart-kit";
import { useSelector } from "react-redux";


const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0; 
  const heightInMeters = height / 100; 
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
};

const ChildDetails = () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { childId } = route.params;
  const { showSnackbar } = useSnackbar();
  const [child, setChild] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState("descending");
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedGrowthData, setSelectedGrowthData] = useState(null);
  const [chartGrowthData, setChartGrowthData] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const fetchChildData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/children/${childId}`);
      setChild(response.data.child);
    } catch (error) {
      showSnackbar(
        error.message || "Failed to fetch child data. Please try again.",
        5000,
        "Close"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchGrowthData = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/children/${childId}/growth-data?order=${order}&page=${page}&size=${size}`
      );
      
      const enrichedGrowthData = response.data.growthData.map((data) => ({
        ...data,
        bmi: calculateBMI(data.weight, data.height),
      }));
      setGrowthData(enrichedGrowthData);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      showSnackbar(
        error.message || "Failed to fetch growth data. Please try again.",
        5000,
        "Close"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchChartGrowthData = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/children/${childId}/growth-data?order=ascending`
      );
      
      const enrichedChartData = response.data.growthData.map((data) => ({
        ...data,
        bmi: calculateBMI(data.weight, data.height),
      }));
      setChartGrowthData(enrichedChartData);
    } catch (error) {
      showSnackbar(
        error.message || "Failed to fetch growth data. Please try again.",
        5000,
        "Close"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGrowthData = async () => {
    try {
      setLoading(true);
      await api.delete(
        `/children/${childId}/growth-data/${selectedGrowthData._id}`
      );
      showSnackbar("Growth data deleted successfully!", 3000, "Close");
      fetchGrowthData();
      setIsDeleteModalVisible(false);
    } catch (error) {
      showSnackbar(
        error.response?.data?.message ||
          "Failed to delete growth data. Please try again.",
        5000,
        "Close"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildData();
    fetchChartGrowthData();
  }, [childId]);

  useFocusEffect(
    useCallback(() => {
      fetchGrowthData();
    }, [childId, order, page])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText(theme)}>Loading...</Text>
      </View>
    );
  }

  if (!child) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText(theme)}>No child data found.</Text>
      </View>
    );
  }

  const formattedBirthDate = format(new Date(child.birthDate), "MMM d, yyyy");
  const genderIcon =
    child.gender === "Boy"
      ? require("../assets/images/men.png")
      : require("../assets/images/women.png");

  const groupedGrowthData = growthData.reduce((acc, data) => {
    const date = new Date(data.inputDate).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(data);
    return acc;
  }, {});

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#f9f9f9",
    backgroundGradientTo: "#f9f9f9",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelRotation: 45,
    style: {
      borderRadius: 8,
      fontSize: 10,
      background: "black",
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  const labels = chartGrowthData.map((data) =>
    format(new Date(data.inputDate), "MM/dd/yy")
  );
  const metrics = [
    {
      label: "Weight (kg)",
      data: chartGrowthData.map((data) => data.weight || 0),
      color: "#FF6347",
      yAxisSuffix: " kg",
    },
    {
      label: "Height (cm)",
      data: chartGrowthData.map((data) => data.height || 0),
      color: "#32CD32",
      yAxisSuffix: " cm",
    },
    {
      label: "BMI (kg/m²)",
      data: chartGrowthData.map((data) => data.bmi || 0),
      color: "#1E90FF",
      yAxisSuffix: " kg/m²",
    },
    {
      label: "Head Circumference (cm)",
      data: chartGrowthData.map((data) => data.headCircumference || 0),
      color: "#FFD700",
      yAxisSuffix: " cm",
    },
    {
      label: "Arm Circumference (cm)",
      data: chartGrowthData.map((data) => data.armCircumference || 0),
      color: "#FFA500",
      yAxisSuffix: " cm",
    },
  ];

  const sections = [
    {
      title: "",
      data: [child],
      renderItem: () => (
        <View style={styles.section}>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Avatar.Icon
              size={80}
              icon="baby-face-outline"
              style={{ backgroundColor: theme.colors.primary }}
              color="white"
            />
          </View>
          <Title
            variant="medium"
            text={child.name}
            style={styles.name(theme)}
          />
          <View style={styles.birthDateContainer}>
            <Text style={styles.birthDate(theme)}>{formattedBirthDate}</Text>
            <Image source={genderIcon} style={styles.genderIcon} />
          </View>
          <View style={styles.noteContainer}>
            <Title text="Feeding Type" style={styles.noteTitle(theme)} />
            <Text style={styles.note(theme)}>{child.feedingType || "N/A"}</Text>
          </View>
          <View style={styles.noteContainer}>
            <Title text="Note" style={styles.noteTitle(theme)} />
            <Text style={styles.note(theme)}>{child.note || "N/A"}</Text>
          </View>
          <Divider
            style={{
              height: 2,
              backgroundColor: theme.colors.primary,
              marginTop: 50,
            }}
          />
          <Title
            text="Growth Data"
            style={[
              styles.noteTitle(theme),
              { textAlign: "center", fontSize: 24 },
            ]}
          />
        </View>
      ),
    },
    {
      title: "Growth Trends",
      data: [{}],
      renderItem: () =>
        chartGrowthData.length > 0 ? (
          <View style={styles.chartContainer}>
            {metrics.map((metric, index) => (
              <View key={index} style={styles.chartItem}>
                <Text style={styles.chartTitle(theme)}>{metric.label}</Text>
                <LineChart
                  data={{
                    labels,
                    datasets: [
                      {
                        data: metric.data,
                        color: () => metric.color,
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={Dimensions.get("window").width - 32}
                  height={350}
                  yAxisSuffix={metric.yAxisSuffix}
                  chartConfig={chartConfig}
                  verticalLabelRotation={45}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 8,
                  }}
                />
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText(theme)}>No growth data to display</Text>
        ),
    },
    ...(Object.keys(groupedGrowthData).length > 0
      ? Object.keys(groupedGrowthData).map((date) => ({
          title: date,
          data: groupedGrowthData[date],
          renderItem: ({ item }) => (
            <View style={styles.itemContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("GrowthDataDetails", {
                    growthDataId: item._id,
                    childId,
                  })
                }
              >
                <Text style={styles.itemText(theme)}>
                  Weight: {item.weight} kg
                </Text>
                <Text style={styles.itemText(theme)}>
                  Height: {item.height} cm
                </Text>
                <Text style={styles.itemText(theme)}>
                  BMI: {item.bmi} kg/m²
                </Text>
                <Text style={styles.itemText(theme)}>
                  Head Circumference:{" "}
                  {item.headCircumference
                    ? item.headCircumference + " cm"
                    : "N/A"}
                </Text>
                <Text style={styles.itemText(theme)}>
                  Arm Circumference:{" "}
                  {item.armCircumference
                    ? item.armCircumference + " cm"
                    : "N/A"}
                </Text>
              </TouchableOpacity>
              {user?.role === 0 && (
                <View style={styles.actionButtons}>
                  <IconButton
                    icon="pencil"
                    size={24}
                    iconColor={theme.colors.primary}
                    onPress={() => {
                      setSelectedGrowthData(item);
                      setIsUpdateModalVisible(true);
                    }}
                  />
                  <IconButton
                    icon="delete"
                    size={24}
                    iconColor={theme.colors.error}
                    onPress={() => {
                      setSelectedGrowthData(item);
                      setIsDeleteModalVisible(true);
                    }}
                  />
                </View>
              )}
            </View>
          ),
        }))
      : [
          {
            title: "",
            data: [{ isEmpty: true }],
            renderItem: () => (
              <View style={styles.itemContainer}>
                <Text style={styles.noDataText(theme)}>No data found</Text>
              </View>
            ),
          },
        ]),
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => (item._id ? item._id : `child-${index}`)}
        renderSectionHeader={({ section: { title } }) =>
          title ? (
            <Text style={styles.sectionHeader(theme)}>{title}</Text>
          ) : null
        }
        stickySectionHeadersEnabled={false}
        ListFooterComponent={
          <View style={styles.paginationContainer(theme)}>
            <Text
              onPress={() =>
                setOrder(order === "ascending" ? "descending" : "ascending")
              }
              style={styles.sortButton(theme)}
            >
              Sort by Date ({order})
            </Text>
            <View style={[styles.paginationControls, { marginBottom: 0 }]}>
              <TouchableOpacity
                onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                style={[
                  styles.paginationButton(theme),
                  page === 1 && styles.disabledButton(theme),
                ]}
                disabled={page === 1}
              >
                <Text
                  style={[
                    styles.buttonText(theme),
                    page === 1 && styles.disabledButtonText(theme),
                  ]}
                >
                  Previous
                </Text>
              </TouchableOpacity>
              <Text style={styles.pageInfo(theme)}>
                Page {page} of {totalPages}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                style={[
                  styles.paginationButton(theme),
                  page === totalPages && styles.disabledButton(theme),
                ]}
                disabled={page === totalPages}
              >
                <Text
                  style={[
                    styles.buttonText(theme),
                    page === totalPages && styles.disabledButtonText(theme),
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />

      {user?.role === 0 && (
        <FAB
          style={styles.fab(theme)}
          icon="plus"
          color="white"
          onPress={() => setIsCreateModalVisible(true)}
        />
      )}

      <CreateGrowthData
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        childId={childId}
        fetchGrowthData={fetchGrowthData}
      />

      <UpdateGrowthData
        visible={isUpdateModalVisible}
        onClose={() => setIsUpdateModalVisible(false)}
        childId={childId}
        growthData={selectedGrowthData}
        fetchGrowthData={fetchGrowthData}
      />

      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer(theme)}>
          <View style={styles.modalContent(theme)}>
            <Title text="Delete Growth Data" style={styles.modalTitle(theme)} />
            <Text style={styles.modalText(theme)}>
              Are you sure you want to delete this growth data entry for{" "}
              {format(
                new Date(selectedGrowthData?.inputDate || new Date()),
                "MMM d, yyyy"
              )}
              ?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                mode="contained"
                onPress={handleDeleteGrowthData}
                style={styles.modalButton(theme)}
                disabled={loading}
                textColor="white"
              >
                Delete
              </Button>
              <Button
                mode="outlined"
                onPress={() => setIsDeleteModalVisible(false)}
                style={styles.modalButton(theme)}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  section: { padding: 16 },
  name: (theme) => ({
    fontSize: 24,
    textAlign: "center",
    marginBottom: 8,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  birthDateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  birthDate: (theme) => ({
    fontSize: 16,
    marginRight: 8,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  genderIcon: { width: 20, height: 20 },
  gridContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  gridLabel: (theme) => ({
    fontSize: 16,
    color: "#333",
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  gridValue: (theme) => ({
    fontSize: 16,
    color: "#666",
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  noteContainer: { marginTop: 16 },
  noteTitle: (theme) => ({
    textAlign: "left",
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  note: (theme) => ({
    fontSize: 14,
    color: "#666",
    lineHeight: 24,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  itemContainer: {
    padding: 8,
    marginHorizontal: 10,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  itemText: (theme) => ({
    fontSize: 16,
    color: "#333",
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  noDataText: (theme) => ({
    paddingVertical: 16,
    fontSize: 16,
    color: "#666",
    fontFamily: theme.fonts.medium.fontFamily,
    textAlign: "center",
  }),
  loadingText: (theme) => ({
    fontSize: 18,
    marginBottom: 5,
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  errorText: (theme) => ({
    fontSize: 18,
    marginBottom: 5,
    color: theme.colors.error,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  sectionHeader: (theme) => ({
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: theme.colors.primary,
    color: "white",
    padding: 8,
    borderRadius: 4,
    marginTop: 16,
    marginHorizontal: 10,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  paginationContainer: (theme) => ({
    padding: 16,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  }),
  paginationControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  sortButton: (theme) => ({
    backgroundColor: theme.colors.primary,
    color: "white",
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
    textAlign: "center",
  }),
  paginationButton: (theme) => ({
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
    minWidth: 100,
    alignItems: "center",
  }),
  disabledButton: (theme) => ({
    backgroundColor: theme.colors.disabled,
    elevation: 0,
  }),
  buttonText: (theme) => ({
    fontSize: 16,
    color: "white",
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  disabledButtonText: (theme) => ({
    color: "black",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  }),
  pageInfo: (theme) => ({
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  fab: (theme) => ({
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  }),
  modalContainer: (theme) => ({
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  }),
  modalContent: (theme) => ({
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  }),
  modalTitle: (theme) => ({
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  modalText: (theme) => ({
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    fontFamily: theme.fonts.medium.fontFamily,
  }),
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: (theme) => ({ flex: 1, marginHorizontal: 8 }),
  chartContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  chartItem: {
    marginBottom: 16,
  },
  chartTitle: (theme) => ({
    fontSize: 16,
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium.fontFamily,
    marginBottom: 8,
    textAlign: "center",
  }),
};

export default ChildDetails;