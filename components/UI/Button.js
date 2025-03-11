import { Pressable, StyleSheet, View, Text } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function Button({ children, onPress, mode, style }) {
  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={[styles.button, mode === "flat" && styles.flat]}>
          <Text style={[styles.buttonText, mode === "flat" && styles.flatText]}>
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 8, // Bo góc mềm hơn
    paddingVertical: 10, // Tăng chiều cao để dễ bấm
    paddingHorizontal: 12,
    backgroundColor: GlobalStyles.colors.primary500,
    shadowColor: "#000", // Hiệu ứng nổi trên iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Hiệu ứng nổi trên Android
  },

  flat: {
    backgroundColor: "transparent",
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16, // Tăng kích thước chữ để dễ đọc
    fontWeight: "600", // Làm đậm chữ
  },

  flatText: {
    color: GlobalStyles.colors.primary400, // Màu sắc dễ nhìn hơn
  },

  pressed: {
    opacity: 0.85,
    backgroundColor: GlobalStyles.colors.primary300, // Làm nổi bật khi nhấn
    borderRadius: 8, 
  },
});

