import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { support } from "../util/http";
import { GlobalStyles } from "../constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function SupportScreen() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  async function handleSendMessage() {
    if (!inputText.trim()) return;

    const question = inputText;
    setInputText("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        text: question,
        isUser: true,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    try {
      const response = await support(question);
      setMessages((prev) => [
        ...prev,
        {
          text: response,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, something went wrong. Please try again later.", error,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }

    setLoading(false);
    listRef.current?.scrollToEnd({ animated: true });
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.messagesWrapper}>
          {messages.map((item, index) => (
            <View
              key={index + Math.random().toString()}
              style={[
                styles.messageRow,
                item.isUser ? styles.userRow : styles.botRow,
              ]}
            >
              {!item.isUser && (
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color="white"
                  style={styles.avatar}
                />
              )}
              <View
                style={[
                  styles.messageBubble,
                  item.isUser ? styles.userMessage : styles.botMessage,
                ]}
              >
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
              {item.isUser && (
                <Ionicons
                  name="person-circle-outline"
                  size={24}
                  color="white"
                  style={styles.avatar}
                />
              )}
            </View>
          ))}
        </View>

        {loading && <Text style={styles.loadingText}>Thinking...</Text>}
      </KeyboardAwareScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          placeholderTextColor="#aaa"
        />
        <Pressable style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={20} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default SupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  inner: {
    flex: 1,
    padding: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
    paddingHorizontal: 6,
  },
  userRow: {
    justifyContent: "flex-end",
  },
  botRow: {
    justifyContent: "flex-start",
  },
  avatar: {
    marginHorizontal: 6,
  },
  messageBubble: {
    maxWidth: "75%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowOpacity: 0.1,
  },
  userMessage: {
    backgroundColor: GlobalStyles.colors.primary500,
    borderBottomRightRadius: 0,
  },
  botMessage: {
    backgroundColor: "#444",
    borderBottomLeftRadius: 0,
  },
  messageText: {
    color: "white",
    fontSize: 15,
  },
  timestamp: {
    color: "#ccc",
    fontSize: 11,
    marginTop: 4,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: GlobalStyles.colors.primary400,
    padding: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: GlobalStyles.colors.accent500,
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  loadingText: {
    textAlign: "center",
    color: "#ccc",
    marginVertical: 6,
    fontStyle: "italic",
  },
});
