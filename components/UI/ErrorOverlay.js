import { StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function ErrorOverlay({ message }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>An error occurred</Text>
      <Text style={styles.text}>{message}</Text>
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
});
