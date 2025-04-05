import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ModeSelector = ({ currentMode, onSelectMode }) => {
  const isHiker = currentMode === "HIKER";
  const isRider = currentMode === "RIDER";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isHiker ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={() => onSelectMode("HIKER")}
        disabled={isHiker}
      >
        <Ionicons
          name="walk"
          size={20}
          color={isHiker ? styles.activeText.color : styles.inactiveText.color}
        />
        <Text
          style={[
            styles.buttonText,
            isHiker ? styles.activeText : styles.inactiveText,
          ]}
        >
          Need Ride (Hiker)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          isRider ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={() => onSelectMode("RIDER")}
        disabled={isRider}
      >
        <Ionicons
          name="car-sport"
          size={20}
          color={isRider ? styles.activeText.color : styles.inactiveText.color}
        />
        <Text
          style={[
            styles.buttonText,
            isRider ? styles.activeText : styles.inactiveText,
          ]}
        >
          Offer Ride (Driver)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
  },
  activeButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  inactiveButton: {
    backgroundColor: "#e0e0e0",
    borderColor: "#c0c0c0",
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  activeText: {
    color: "#ffffff",
  },
  inactiveText: {
    color: "#555555",
  },
});

export default React.memo(ModeSelector);
