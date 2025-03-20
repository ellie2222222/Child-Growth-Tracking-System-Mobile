import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme, Card, Title, Button } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../../../configs/api";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { useSelector } from "react-redux";

const MemberConsultationChat = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { showSnackbar } = useSnackbar();
  const user = useSelector((state) => state.auth.user);
  const [messages, setMessages] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const pageSize = 10;
  const { consultationId } = route.params;
  const flatListRef = useRef(null);

  // Debug state
  useEffect(() => {
    console.log("Messages state updated:", messages);
    console.log("Messages length:", messages.length);
    console.log("First message:", messages[0]);
  }, [messages]);

  useEffect(() => {
    if (user && user._id && consultationId) {
      fetchMessages();
    }
  }, [user, consultationId, currentPage]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setFetchLoading(true);
      const response = await api.get(
        `/consultation-messages/consultations/${consultationId}`,
        {
          params: {
            id: consultationId,
            page: currentPage,
            size: pageSize,
            search: "",
            order: "ascending",
            sortBy: "date",
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data && Array.isArray(response.data.consultationMessages)) {
        // Add a unique key to each message if _id is potentially undefined
        const processedMessages = response.data.consultationMessages.map(
          (msg, index) => ({
            ...msg,
            key: msg._id || `msg-${index}-${Date.now()}`,
          })
        );
        setMessages(processedMessages);
        setTotalMessages(response.data.totalMessages || 0);
        console.log("Messages set:", processedMessages);
      } else {
        setMessages([]);
        showSnackbar(
          response.data.Message || "No messages found",
          5000,
          "Close"
        );
        console.log("No messages found in response");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
      showSnackbar("Failed to load messages", 5000, "Close");
    } finally {
      setFetchLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      showSnackbar("Please enter a message", 5000, "Close");
      return;
    }

    try {
      setSendLoading(true);

      // Store message text before clearing input
      const messageText = newMessage;

      // Clear the input field immediately
      setNewMessage("");

      const formData = new FormData();
      formData.append("consultationId", consultationId);
      formData.append("message", messageText);

      const response = await api.post(`/consultation-messages`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Send Message Response:", response.data);

      // Refetch messages after a short delay
      setTimeout(() => {
        fetchMessages();
      }, 300);
    } catch (error) {
      console.error("Error sending message:", error);
      showSnackbar("Failed to send message", 5000, "Close");
    } finally {
      setSendLoading(false);
    }
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

  const renderLoading = () => (
    <View style={styles(theme).loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  const renderMessageItem = ({ item, index }) => {
    console.log(`Rendering message ${index}:`, item);

    // Safety check - if no sender or no user, use default values
    const isSender =
      item.sender && user && user._id ? item.sender === user._id : false;

    return (
      <View
        style={[
          styles(theme).messageContainer,
          { justifyContent: isSender ? "flex-end" : "flex-start" },
        ]}>
        <View
          style={[
            styles(theme).messageBubble,
            {
              backgroundColor: isSender ? "#DCF8C6" : "#E8E8E8",
              borderTopLeftRadius: isSender ? 10 : 0,
              borderTopRightRadius: isSender ? 0 : 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              marginLeft: isSender ? 10 : 0,
              marginRight: isSender ? 0 : 10,
            },
          ]}>
          <View style={styles(theme).messageHeader}>
            <Text style={styles(theme).senderName}>
              {item.senderInfo?.name || (isSender ? "You" : "Unknown")}
            </Text>
            <Text style={styles(theme).messageDate}>
              {item.createdAt ? formatDate(item.createdAt) : "Unknown time"}
            </Text>
          </View>
          <Text style={styles(theme).messageText}>{item.message || ""}</Text>
        </View>
      </View>
    );
  };

  const renderPagination = () => {
    if (totalMessages <= pageSize) return null;

    const totalPages = Math.ceil(totalMessages / pageSize);
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

  // Render a test message to debug FlatList issues
  const renderTestMessage = () => (
    <View style={styles(theme).debugContainer}>
      <Text style={styles(theme).debugTitle}>Debug Information:</Text>
      <Text>Messages Count: {messages.length}</Text>
      <Text>Is Fetching: {fetchLoading ? "Yes" : "No"}</Text>
      <Text>User ID: {user?._id || "Unknown"}</Text>
      <Text>Consultation ID: {consultationId || "Unknown"}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles(theme).container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
      <Card style={styles(theme).mainCard}>
        <Card.Content style={styles(theme).cardContent}>
          <View style={styles(theme).headerContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("MemberConsultationHistory")}
              style={styles(theme).backButton}>
              <Text style={styles(theme).backText}>
                {"< Back to Consultation History"}
              </Text>
            </TouchableOpacity>
            <Title style={styles(theme).title}>Consultation Chat</Title>
          </View>

          {fetchLoading ? (
            renderLoading()
          ) : (
            <>
              {messages.length === 0 && !fetchLoading && renderTestMessage()}
              <FlatList
                data={messages}
                extraData={[messages.length, currentPage]}
                renderItem={renderMessageItem}
                keyExtractor={(item, index) =>
                  item.key || item._id || `msg-${index}`
                }
                ListEmptyComponent={
                  <View style={styles(theme).emptyContainer}>
                    <Text style={styles(theme).emptyText}>
                      No messages found
                    </Text>
                  </View>
                }
                style={styles(theme).messagesList}
                ref={flatListRef}
                inverted={false}
                contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={21}
                updateCellsBatchingPeriod={50}
                removeClippedSubviews={false}
              />
            </>
          )}
          {renderPagination()}
        </Card.Content>
      </Card>

      <View style={styles(theme).inputContainer}>
        <TextInput
          style={styles(theme).textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message here..."
          multiline
          numberOfLines={3}
        />
        <Button
          mode="contained"
          onPress={handleSendMessage}
          loading={sendLoading}
          style={styles(theme).sendButton}
          labelStyle={styles(theme).buttonText}
          disabled={sendLoading || !newMessage.trim()}>
          Send
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
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
      flex: 1,
      margin: 16,
      marginBottom: 0,
    },
    cardContent: {
      flex: 1,
      paddingBottom: 0,
    },
    headerContainer: {
      marginBottom: 15,
    },
    backButton: {
      marginBottom: 10,
    },
    backText: {
      fontSize: 16,
      color: "#0056A1",
      fontWeight: "600",
    },
    title: {
      fontSize: 22,
      color: theme.colors.primary,
      fontWeight: "700",
      textAlign: "center",
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    messagesList: {
      flex: 1,
    },
    messageContainer: {
      flexDirection: "row",
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    messageBubble: {
      maxWidth: "70%",
      padding: 10,
    },
    messageHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5,
    },
    senderName: {
      fontSize: 16,
      fontWeight: "600",
      marginRight: 10,
    },
    messageDate: {
      fontSize: 14,
      color: "#666",
    },
    messageText: {
      fontSize: 16,
      color: "#333",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      textAlign: "center",
      color: "#757575",
      fontSize: 16,
      padding: 20,
    },
    paginationContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 10,
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
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      backgroundColor: "#fff",
      borderTopWidth: 1,
      borderTopColor: "#d9d9d9",
      marginHorizontal: 16,
      marginBottom: 16,
    },
    textInput: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      borderWidth: 1,
      borderColor: "#d9d9d9",
      borderRadius: 8,
      padding: 10,
      fontSize: 16,
      minHeight: 40,
      maxHeight: 80,
      marginRight: 10,
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },
    buttonText: {
      color: "white",
      fontWeight: "600",
    },
    debugContainer: {
      padding: 10,
      backgroundColor: "#f8f8f8",
      borderRadius: 8,
      margin: 10,
    },
    debugTitle: {
      fontWeight: "bold",
      marginBottom: 5,
    },
  });

export default MemberConsultationChat;
