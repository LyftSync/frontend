import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const RoutePointsDisplay = ({ points, onRemovePoint, onClearAll }) => {
  if (!points || points.length === 0) {
    return null;
  }

  return (
    <View style={styles.pointListContainer}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {points.map((point, index) => (
          <View
            key={`list-${index}-${point.latitude}`}
            style={[
              styles.pointListItem,
              { backgroundColor: index === 0 ? "#e0f7fa" : "#ffebee" },
            ]}
          >
            <Ionicons
              name={index === 0 ? "navigate" : "flag"}
              size={16}
              color={index === 0 ? "green" : "red"}
              style={styles.pointIcon}
            />
            <Text
              style={styles.pointText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {`${index === 0 ? "P" : "D"}: ${point.name || `Lat: ${point.latitude.toFixed(2)}`}`}
            </Text>
            <TouchableOpacity
              onPress={() => onRemovePoint(index)}
              style={styles.removeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={18} color="#555" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={onClearAll} style={styles.clearAllButton}>
        <Text style={styles.clearAllText}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pointListContainer: {
    paddingVertical: 8,
    paddingLeft: 10,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  scrollViewContent: {
    alignItems: "center",
  },
  pointListItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    maxWidth: Dimensions.get("window").width * 0.5,
  },
  pointIcon: {
    marginRight: 5,
  },
  pointText: {
    fontSize: 13,
    marginHorizontal: 5,
    flexShrink: 1,
  },
  removeButton: {
    marginLeft: 5,
    padding: 2,
  },
  clearAllButton: {
    marginLeft: "auto",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  clearAllText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default React.memo(RoutePointsDisplay);
