import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function ErrorOverlay({ message, onConfirm }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>An error occurred</Text>
      <Text style={styles.text}>{message}</Text>
      {onConfirm && (
        <Pressable onPress={onConfirm} style={styles.button}>
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}

export default ErrorOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: GlobalStyles.colors.error500,
    opacity: 0.9,
  },

  text: {
    textAlign: "center",
    marginBottom: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalStyles.colors.error50,
  },

  message: {
    fontSize: 16,
    fontWeight: "500",
    color: GlobalStyles.colors.error100,
  },

  button: {
    marginTop: 16,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  buttonText: {
    color: GlobalStyles.colors.error500,
    fontWeight: "bold",
    fontSize: 16,
  },
});
