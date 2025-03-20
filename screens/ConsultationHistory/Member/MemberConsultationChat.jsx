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
import { useTheme, Card } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../../../configs/api";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const MemberConsultationChat = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { showSnackbar } = useSnackbar();
  const user = useSelector((state) => state.auth.user);
  const [messages, setMessages] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const { consultationId } = route.params;
  const flatListRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    if (user && user._id && consultationId) {
      fetchMessages();
    }
  }, [user, consultationId]);

  const fetchMessages = async () => {
    try {
      setFetchLoading(true);
      const response = await api.get(
        `/consultation-messages/consultations/${consultationId}`
      );

      const processedMessages = response.data.consultationMessages.map(
        (msg) => ({
          ...msg,
          id: msg._id || `${Date.now()}-${Math.random()}`,
        })
      );

      // Extract doctor's name from the first message's consultation data
      if (
        processedMessages.length > 0 &&
        processedMessages[0].consultation?.requestDetails?.doctor?.name
      ) {
        setDoctorName(
          processedMessages[0].consultation.requestDetails.doctor.name
        );
      }

      setMessages(processedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      showSnackbar("Failed to load messages", 5000, "Close");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSendLoading(true);
      const formData = new FormData();
      formData.append("consultationId", consultationId);
      formData.append("message", newMessage);

      const response = await api.post(`/consultation-messages`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newMsg = {
        id: response.data._id || `${Date.now()}-${Math.random()}`,
        sender: user._id,
        message: newMessage,
        createdAt: new Date().toISOString(),
        senderInfo: { name: user.name || "You" },
        consultation: messages[0]?.consultation || {}, // Preserve consultation data for new messages
      };

      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      showSnackbar("Failed to send message", 5000, "Close");
    } finally {
      setSendLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateForHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    } else if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const renderMessageItem = ({ item, index }) => {
    const isSender = item.sender === user?._id;
    const currentDate = new Date(item.createdAt);
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const previousDate = previousMessage
      ? new Date(previousMessage.createdAt)
      : null;

    const showDateHeader =
      !previousDate ||
      currentDate.toDateString() !== previousDate.toDateString();

    return (
      <>
        {showDateHeader && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>
              {formatDateForHeader(item.createdAt)}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.messageContainer,
            { alignSelf: isSender ? "flex-end" : "flex-start" },
          ]}>
          <LinearGradient
            colors={
              isSender
                ? [theme.colors.primary, "#D44E3F"]
                : [theme.colors.lightWhite, "#E8E8E8"]
            }
            style={[styles.messageBubble, isSender && styles.senderBubble]}>
            <Text
              style={[
                styles.senderName,
                isSender ? styles.senderText : styles.receivedText,
              ]}>
              {isSender ? "You" : `Dr. ${doctorName}`}
            </Text>
            <Text
              style={[
                styles.messageText,
                isSender ? styles.senderText : styles.receivedText,
              ]}>
              {item.message}
            </Text>
            <Text
              style={[
                styles.messageTime,
                isSender ? styles.senderText : styles.receivedTime,
              ]}>
              {formatDateTime(item.createdAt)}
            </Text>
          </LinearGradient>
        </View>
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
      {fetchLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Start the conversation!</Text>
            </View>
          }
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !newMessage.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={sendLoading || !newMessage.trim()}>
          {sendLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="send" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "GothamRnd-Medium",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "GothamRnd-Bold",
  },
  messagesList: {
    padding: 15,
    paddingBottom: 80,
  },
  dateHeader: {
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  dateHeaderText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "GothamRnd-Medium",
  },
  messageContainer: {
    maxWidth: "75%",
    marginVertical: 5,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  senderBubble: {
    borderBottomRightRadius: 5,
  },
  senderName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily: "GothamRnd-Medium",
  },
  messageText: {
    fontSize: 16,
    fontFamily: "GothamRnd-Regular",
  },
  messageTime: {
    fontSize: 12,
    alignSelf: "flex-end",
    marginTop: 4,
    fontFamily: "GothamRnd-Light",
  },
  senderText: {
    color: "white",
  },
  receivedText: {
    color: "#333",
  },
  receivedTime: {
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "GothamRnd-Regular",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    padding: 12,
    paddingTop: 12,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
    fontFamily: "GothamRnd-Regular",
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#EF6351",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
});

export default MemberConsultationChat;
