import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import { support } from "../util/http";
import { GlobalStyles } from "../constants/styles";
import LoadingOverlay from "../components/UI/LoadingOverlay";

function SupportScreen() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const listRef = useRef(null);

  async function handleSendMessage() {
    if (!inputText.trim()) return;

    const question = inputText;
    setInputText("");

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: question, isUser: true },
    ]);

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: "", isUser: false },
    ]);

    const response = await support(question);

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[updatedMessages.length - 1].text = response;
      return updatedMessages;
    });

    listRef.current?.scrollToEnd({ animated: true });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={{ flex: 1 }}>
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) =>
                item.text ? (
                  <View
                    style={[
                      styles.messageBubble,
                      item.isUser ? styles.userMessage : styles.botMessage,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        item.isUser ? styles.userText : styles.botText,
                      ]}
                    >
                      {item.text}
                    </Text>
                  </View>
                ) : (
                  !item.isUser && <LoadingOverlay />
                )
              }
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "flex-end",
                paddingVertical: 10,
              }}
              onContentSizeChange={() =>
                listRef.current?.scrollToEnd({ animated: true })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <Pressable style={styles.button} onPress={handleSendMessage}>
              <Text style={styles.buttonText}>Send</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    padding: 10,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 15,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: GlobalStyles.colors.primary400,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#444",
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: "white",
  },
  botText: {
    color: "white",
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
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    fontSize: 16,
    minHeight: 50,
    textAlignVertical: "center",
  },
  button: {
    backgroundColor: GlobalStyles.colors.primary400,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
