import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  useTheme,
  Card,
  Title,
  Paragraph,
  Button,
  Portal,
  Modal,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import api from "../../../configs/api";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { useSelector } from "react-redux";

const windowWidth = Dimensions.get("window").width;

const MemberConsultationHistory = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { showSnackbar } = useSnackbar();
  const user = useSelector((state) => state.auth.user);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    if (user && user._id) {
      fetchConsultationHistory();
    }
  }, [user, currentPage]);

  const fetchConsultationHistory = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/consultations/users/${user._id}`, {
        params: {
          id: user._id,
          page: currentPage,
          size: pageSize,
          search: "",
          order: "descending",
          sortBy: "date",
          status: "",
          as: "MEMBER",
        },
      });

      if (
        response.data &&
        response.data.consultations &&
        Array.isArray(response.data.consultations)
      ) {
        const acceptedConsultations = response.data.consultations.filter(
          (consultation) =>
            consultation.requestDetails &&
            consultation.requestDetails.status === "Accepted"
        );

        const requestIdMap = new Map();

        acceptedConsultations.forEach((consultation) => {
          const requestId = consultation.requestId;

          if (
            !requestIdMap.has(requestId) ||
            new Date(consultation.updatedAt) >
            new Date(requestIdMap.get(requestId).updatedAt)
          ) {
            requestIdMap.set(requestId, consultation);
          }
        });

        const uniqueConsultations = Array.from(requestIdMap.values());
        uniqueConsultations.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setConsultations(uniqueConsultations);
        setTotalRequests(uniqueConsultations.length || 0);
      } else {
        showSnackbar("Failed to load consultation history", 5000, "Close");
      }
    } catch (error) {
      showSnackbar("Failed to load consultation history", 5000, "Close");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setModalVisible(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();

    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }

    return years === 0
      ? `${months} months`
      : `${years} years, ${months} months`;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "rejected":
        return theme.colors.error;
      case "ongoing":
      case "accepted":
        return theme.colors.primary;
      default:
        return "#757575";
    }
  };

  const handleStartConsultation = (consultationId) => {
    setModalVisible(false);
    navigation.navigate("MemberConsultationChat", { consultationId });
  };

  const renderPagination = () => {
    if (totalRequests <= pageSize) return null;

    const totalPages = Math.ceil(totalRequests / pageSize);
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            styles(theme).paginationButton,
            currentPage === i && styles(theme).paginationButtonActive,
          ]}
          onPress={() => handlePageChange(i)}>
          <Text
            style={[
              styles(theme).paginationText,
              currentPage === i && styles(theme).paginationTextActive,
            ]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return <View style={styles(theme).paginationContainer}>{pages}</View>;
  };

  const renderLoading = () => (
    <View style={styles(theme).loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  const renderConsultationItem = (item) => {
    const statusText =
      item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase();
    const statusColor = getStatusColor(item.status);
    const child = item.requestDetails?.children?.[0] || {};
    const member = item.requestDetails?.member || {};
    const doctor = item.requestDetails?.doctor || {};

    return (
      <Card style={styles(theme).consultationCard} key={item._id}>
        <Card.Content>
          <View style={styles(theme).cardHeader}>
            <Title style={styles(theme).doctorName}>
              Doctor: {doctor.name || "Unknown"}
            </Title>
            <Text style={[styles(theme).statusText, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>

          <View style={styles(theme).consultationDetails}>
            <Text style={styles(theme).detailLabel}>Title:</Text>
            <Text style={styles(theme).detailValue}>
              {item.requestDetails?.title || "Untitled Consultation"}
            </Text>

            <Text style={styles(theme).detailLabel}>Child:</Text>
            <Text style={styles(theme).detailValue}>
              {child.name || "Unknown"}
            </Text>

            {child.birthDate && (
              <>
                <Text style={styles(theme).detailLabel}>Age:</Text>
                <Text style={styles(theme).detailValue}>
                  {calculateAge(child.birthDate)}
                </Text>
              </>
            )}

            <Text style={styles(theme).detailLabel}>Parent:</Text>
            <Text style={styles(theme).detailValue}>
              {member.name || "Unknown"}
            </Text>

            <Text style={styles(theme).detailLabel}>Submitted:</Text>
            <Text style={styles(theme).detailValue}>
              {formatDate(item.createdAt)}
            </Text>

            <Text style={styles(theme).detailLabel}>Updated:</Text>
            <Text style={styles(theme).detailValue}>
              {formatDate(item.updatedAt)}
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={() => handleViewDetails(item)}
            style={styles(theme).viewDetailsButton}
            labelStyle={styles(theme).buttonText}>
            View Details
          </Button>
        </Card.Content>
      </Card>
    );
  };

  const renderGrowthVelocityCard = (result, index) => {
    return (
      <View
        style={[
          styles(theme).velocityResultCard,
          { backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" },
        ]}
        key={index}>
        <View style={styles(theme).periodHeader}>
          <Text style={styles(theme).periodTitle}>{result.period}</Text>
          <Text style={styles(theme).periodDate}>
            {formatDate(result.startDate)} - {formatDate(result.endDate)}
          </Text>
        </View>

        <View style={styles(theme).metricsRowContainer}>
          {/* Weight Card */}
          <Card style={styles(theme).metricCard}>
            <Card.Content>
              <View style={styles(theme).metricHeader}>
                <View
                  style={[
                    styles(theme).metricIndicator,
                    { backgroundColor: "#f5a623" },
                  ]}
                />
                <Text style={styles(theme).metricTitle}>Weight</Text>
              </View>
              {result.weight.description ? (
                <View>
                  <Text style={styles(theme).metricLabel}>
                    Weight Velocity:
                  </Text>
                  <Text style={styles(theme).metricValue}>
                    {result.weight?.weightVelocity?.toFixed(2) || "N/A"}
                  </Text>
                  <Text style={styles(theme).metricLabel}>
                    Weight Percentile:
                  </Text>
                  <Text style={styles(theme).metricValue}>
                    {result.weight?.percentile || "N/A"}
                  </Text>
                </View>
              ) : (
                <Text style={styles(theme).insufficientData}>
                  Insufficient data to determine weight percentile.
                </Text>
              )}
            </Card.Content>
          </Card>

          {/* Height Card */}
          <Card style={styles(theme).metricCard}>
            <Card.Content>
              <View style={styles(theme).metricHeader}>
                <View
                  style={[
                    styles(theme).metricIndicator,
                    { backgroundColor: "#4CAF50" },
                  ]}
                />
                <Text style={styles(theme).metricTitle}>Height</Text>
              </View>
              {result.height.description !== "Insufficient data" ? (
                <View>
                  <Text style={styles(theme).metricLabel}>
                    Height Velocity:
                  </Text>
                  <Text style={styles(theme).metricValue}>
                    {result.height?.heightVelocity?.toFixed(2) || "N/A"}
                  </Text>
                  <Text style={styles(theme).metricLabel}>
                    Height Percentile:
                  </Text>
                  <Text style={styles(theme).metricValue}>
                    {result.height?.percentile || "N/A"}
                  </Text>
                </View>
              ) : (
                <Text style={styles(theme).insufficientData}>
                  Insufficient data to determine height percentile.
                </Text>
              )}
            </Card.Content>
          </Card>

          {/* Head Circumference Card */}
          <Card style={styles(theme).metricCard}>
            <Card.Content>
              <View style={styles(theme).metricHeader}>
                <View
                  style={[
                    styles(theme).metricIndicator,
                    { backgroundColor: "#9C27B0" },
                  ]}
                />
                <Text style={styles(theme).metricTitle}>
                  Head Circumference
                </Text>
              </View>
              {result.headCircumference &&
                result.headCircumference.description !== "Insufficient data" ? (
                <View>
                  <Text style={styles(theme).metricLabel}>
                    Head Circumference Velocity:
                  </Text>
                  <Text style={styles(theme).metricValue}>
                    {result.headCircumference?.headCircumferenceVelocity?.toFixed(
                      2
                    ) || "N/A"}
                  </Text>
                  <Text style={styles(theme).metricLabel}>
                    Head Circumference Percentile:
                  </Text>
                  <Text style={styles(theme).metricValue}>
                    {result.headCircumference?.percentile || "N/A"}
                  </Text>
                </View>
              ) : (
                <Text style={styles(theme).insufficientData}>
                  Insufficient data to determine head circumference percentile.
                </Text>
              )}
            </Card.Content>
          </Card>
        </View>

        {/* Percentile Information */}
        {(result.weight.description &&
          result.weight.description.includes("percentile")) ||
          (result.height.description &&
            result.height.description.includes("percentile")) ||
          (result.headCircumference &&
            result.headCircumference.description &&
            result.headCircumference.description.includes("percentile")) ? (
          <View style={styles(theme).percentileInfoContainer}>
            <Text style={styles(theme).percentileInfoTitle}>
              Percentile Information:
            </Text>
            {result.weight.description &&
              result.weight.description.includes("percentile") && (
                <Text style={styles(theme).percentileInfoText}>
                  {result.weight.description}
                </Text>
              )}
            {result.height.description &&
              result.height.description.includes("percentile") && (
                <Text style={styles(theme).percentileInfoText}>
                  {result.height.description}
                </Text>
              )}
            {result.headCircumference &&
              result.headCircumference.description &&
              result.headCircumference.description.includes("percentile") && (
                <Text style={styles(theme).percentileInfoText}>
                  {result.headCircumference.description}
                </Text>
              )}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles(theme).container}
      showsVerticalScrollIndicator={false}>
      <Card style={styles(theme).mainCard}>
        <Card.Content>
          {loading ? (
            renderLoading()
          ) : consultations.length === 0 ? (
            <View style={styles(theme).emptyContainer}>
              <Text style={styles(theme).emptyText}>
                No accepted consultation history found
              </Text>
            </View>
          ) : (
            <>
              {consultations.map(renderConsultationItem)}
              {renderPagination()}
            </>
          )}
        </Card.Content>
      </Card>

      {/* Details Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles(theme).modalContainer}>
          <Title style={styles(theme).modalTitle}>Consultation Details</Title>
          <ScrollView
            contentContainerStyle={styles(theme).modalScrollContainer}
            showsVerticalScrollIndicator={true}>
            {selectedConsultation &&
              selectedConsultation.requestDetails?.children?.length > 0 && (
                <View style={styles(theme).modalContent}>
                  <Text style={styles(theme).modalSubtitle}>
                    Child:{" "}
                    {selectedConsultation.requestDetails.children[0].name}
                  </Text>

                  <View style={styles(theme).consultationDetails}>
                    <Text style={styles(theme).detailLabel}>Age:</Text>
                    <Text style={styles(theme).detailValue}>
                      {calculateAge(
                        selectedConsultation.requestDetails.children[0]
                          .birthDate
                      )}
                    </Text>

                    <Text style={styles(theme).detailLabel}>Parent:</Text>
                    <Text style={styles(theme).detailValue}>
                      {selectedConsultation.requestDetails.member?.name ||
                        "Unknown"}
                    </Text>

                    <Text style={styles(theme).detailLabel}>Doctor:</Text>
                    <Text style={styles(theme).detailValue}>
                      {selectedConsultation.requestDetails.doctor?.name ||
                        "Unknown"}
                    </Text>

                    <Text style={styles(theme).detailLabel}>Status:</Text>
                    <Text
                      style={[
                        styles(theme).detailValue,
                        { color: getStatusColor(selectedConsultation.status) },
                      ]}>
                      {selectedConsultation.status.charAt(0).toUpperCase() +
                        selectedConsultation.status.slice(1).toLowerCase()}
                    </Text>

                    <Text style={styles(theme).detailLabel}>
                      Request Title:
                    </Text>
                    <Text style={styles(theme).detailValue}>
                      {selectedConsultation.requestDetails.title ||
                        "No title provided"}
                    </Text>

                    <Text style={styles(theme).detailLabel}>Submitted:</Text>
                    <Text style={styles(theme).detailValue}>
                      {formatDate(selectedConsultation.createdAt)}
                    </Text>

                    <Text style={styles(theme).detailLabel}>Updated:</Text>
                    <Text style={styles(theme).detailValue}>
                      {formatDate(selectedConsultation.updatedAt)}
                    </Text>
                  </View>

                  {/* Growth Velocity Results */}
                  {selectedConsultation.requestDetails.children[0]
                    .growthVelocityResult && (
                      <View style={styles(theme).growthVelocityContainer}>
                        <Title style={styles(theme).growthVelocityTitle}>
                          Growth Velocity Results
                        </Title>

                        <View style={styles(theme).growthVelocityWrapper}>
                          {selectedConsultation.requestDetails.children[0].growthVelocityResult.map(
                            (result, index) =>
                              renderGrowthVelocityCard(result, index)
                          )}
                        </View>
                      </View>
                    )}
                </View>
              )}
          </ScrollView>
          <View style={styles(theme).modalFooter}>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              style={styles(theme).cancelButton}
              labelStyle={styles(theme).cancelButtonText}>
              Cancel
            </Button>

            <Button
              mode="contained"
              onPress={() => handleStartConsultation(selectedConsultation._id)}
              style={styles(theme).startConsultationButton}
              labelStyle={styles(theme).buttonText}>
              Chat
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: "#f0f2f5",
    },
    mainCard: {
      borderRadius: 8,
      elevation: 2,
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      marginBottom: 20,
    },
    loadingContainer: {
      padding: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyContainer: {
      padding: 30,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      color: "#757575",
      fontSize: 16,
    },
    consultationCard: {
      marginBottom: 15,
      borderRadius: 8,
      elevation: 2,
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    doctorName: {
      color: theme.colors.primary,
      fontSize: 18,
      fontWeight: "600",
    },
    statusText: {
      fontWeight: "500",
    },
    consultationDetails: {
      marginVertical: 10,
    },
    detailLabel: {
      fontWeight: "600",
      fontSize: 14,
      color: "#333",
      marginTop: 6,
    },
    detailValue: {
      fontSize: 14,
      color: "#555",
      marginBottom: 2,
    },
    viewDetailsButton: {
      marginTop: 10,
      borderRadius: 50,
      backgroundColor: theme.colors.primary,
    },
    buttonText: {
      color: "white",
      fontWeight: "600",
    },
    paginationContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 10,
    },
    paginationButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "#f0f0f0",
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 4,
    },
    paginationButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    paginationText: {
      color: "#333",
    },
    paginationTextActive: {
      color: "#fff",
    },
    modalContainer: {
      backgroundColor: "white",
      padding: 20,
      margin: 15,
      borderRadius: 8,
      maxHeight: "70%",
    },
    modalScrollContainer: {
      paddingBottom: 20,
    },
    modalTitle: {
      fontSize: 22,
      color: theme.colors.primary,
      fontWeight: "700",
      marginBottom: 15,
    },
    modalContent: {
      paddingHorizontal: 5,
    },
    modalSubtitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 10,
    },
    modalFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: "#f0f0f0",
    },
    cancelButton: {
      flex: 1,
      marginRight: 8,
      borderColor: theme.colors.primary,
    },
    cancelButtonText: {
      color: theme.colors.primary,
    },
    startConsultationButton: {
      flex: 1,
      marginLeft: 8,
      backgroundColor: theme.colors.primary,
    },
    growthVelocityContainer: {
      marginTop: 20,
    },
    growthVelocityTitle: {
      fontSize: 18,
      color: theme.colors.primary,
      marginBottom: 15,
    },
    growthVelocityWrapper: {
      borderWidth: 1,
      borderColor: "#d9d9d9",
      borderRadius: 8,
      overflow: "hidden",
    },
    velocityResultCard: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#e8e8e8",
    },
    periodHeader: {
      marginBottom: 10,
    },
    periodTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "white",
      backgroundColor: "#0056A1",
      padding: 8,
      borderRadius: 4,
      alignSelf: "flex-start",
    },
    periodDate: {
      fontSize: 14,
      color: "#666",
      marginTop: 5,
    },
    metricsRowContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginTop: 15,
    },
    metricCard: {
      flex: 1,
      minWidth: "30%",
      margin: 5,
      elevation: 1,
      backgroundColor: "#fff",
    },
    metricHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    metricIndicator: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: 8,
    },
    metricTitle: {
      fontSize: 16,
      fontWeight: "600",
    },
    metricLabel: {
      fontSize: 14,
      color: "#666",
    },
    metricValue: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 10,
    },
    insufficientData: {
      fontSize: 16,
      color: "#666",
      fontStyle: "italic",
    },
    percentileInfoContainer: {
      marginTop: 15,
      padding: 15,
      backgroundColor: "#f0f7ff",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#d0e3ff",
    },
    percentileInfoTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#0056A1",
      marginBottom: 5,
    },
    percentileInfoText: {
      fontSize: 14,
      color: "#333",
      marginTop: 8,
    },
  });

export default MemberConsultationHistory;
