import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image,
} from "react-native";
import { GlobalStyles } from "../constants/styles";
import Button from "../components/UI/Button";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

function InfoScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: Logo và tiêu đề */}
        <View style={styles.header}>
          <Image
            source={require("../assets/logo_UNETI.png")}
            style={styles.logo}
          />
          <Text style={styles.heading}>Graduation Thesis</Text>
          <Text style={styles.subheading}>
            Inspiration • Research • Dedication
          </Text>
        </View>

        {/* Quote */}
        <View style={styles.quoteBox}>
          <Text style={styles.quote}>
            “Education is the most powerful weapon which you can use to change
            the world.”
          </Text>
          <Text style={styles.quoteAuthor}>– Nelson Mandela</Text>
        </View>

        {/* Card nội dung */}
        <View style={styles.card}>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>University</Text>
            <Text style={styles.text}>
              University of Economics - Technology for Industries
            </Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Students</Text>
            <Text style={styles.text}>Nguyen Trong Hieu – 21103100760</Text>
            <Text style={styles.text}>Hoang Manh Linh – 21103100911</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Supervisor</Text>
            <Text style={styles.text}>Tran Thi Hue</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Program</Text>
            <Text style={styles.text}>Graduation Thesis – Cohort K15</Text>
          </View>
        </View>

        {/* Nút trở lại */}
        <View style={styles.buttonContainer}>
          <Button onPress={navigation.goBack}>Back to Profile</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default InfoScreen;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary700,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 12,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary50,
    marginTop: 8,
  },
  subheading: {
    fontSize: 15,
    color: GlobalStyles.colors.primary200,
    marginTop: 4,
    fontStyle: "italic",
    letterSpacing: 1,
  },
  quoteBox: {
    backgroundColor: GlobalStyles.colors.primary600,
    borderLeftWidth: 4,
    borderLeftColor: GlobalStyles.colors.accent500,
    padding: 16,
    marginVertical: 20,
    borderRadius: 12,
    width: width - 40,
  },
  quote: {
    fontSize: 15,
    color: GlobalStyles.colors.primary100,
    fontStyle: "italic",
    lineHeight: 22,
  },
  quoteAuthor: {
    textAlign: "right",
    color: GlobalStyles.colors.primary200,
    fontSize: 13,
    marginTop: 8,
  },
  card: {
    width: width - 40,
    backgroundColor: GlobalStyles.colors.primary600,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary500,
  },
  infoBlock: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.colors.primary500,
    paddingBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: GlobalStyles.colors.accent500,
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
    color: GlobalStyles.colors.primary100,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 40,
    alignItems: "center",
  },
});
