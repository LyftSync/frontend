import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Switch,
  Alert,
} from "react-native";
import useAuthStore from "../../stores/authStore";
import { apiRequest } from "../../utils/api";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

export default function UpdateProfileScreen() {
  const navigation = useNavigation();
  const { user, fetchUser, token } = useAuthStore(); // Token might not be directly needed if apiRequest handles it
  const [name, setName] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [phone, setPhone] = useState("");
  // For simplicity, emergency contacts are not fully implemented in this form
  // const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [role, setRole] = useState("rider");
  const [vehicleType, setVehicleType] = useState("motorbike");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");

  const [loading, setLoading] = useState(false);
  const [isDriverRole, setIsDriverRole] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setProfilePictureUrl(user.profilePictureUrl || "");
      setPhone(user.phone || "");
      setRole(user.role || "rider");
      setIsDriverRole(user.role === "driver" || user.role === "both");
      if (user.vehicleDetails) {
        setVehicleType(user.vehicleDetails.type || "motorbike");
        setRegistrationNumber(user.vehicleDetails.registrationNumber || "");
        setLicenseNumber(user.vehicleDetails.licenseNumber || "");
        setVehicleModel(user.vehicleDetails.model || "");
      }
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    const updatedData = {
      name,
      profilePictureUrl,
      phone,
      role: isDriverRole ? (role === "rider" ? "both" : "driver") : "rider", // Simplified logic
    };

    if (isDriverRole || role === "driver" || role === "both") {
      if (!registrationNumber || !licenseNumber) {
        showMessage({
          message:
            "Vehicle registration and license number are required for drivers.",
          type: "danger",
        });
        setLoading(false);
        return;
      }
      updatedData.vehicleDetails = {
        type: vehicleType,
        registrationNumber,
        licenseNumber,
        model: vehicleModel,
      };
      updatedData.role = "driver"; // if they provide vehicle details, set them as driver or both
    } else {
      updatedData.role = "rider";
      updatedData.vehicleDetails = null; // Clear vehicle details if not a driver
    }

    try {
      const response = await apiRequest(
        "/api/users/profile",
        "PUT",
        updatedData,
      );
      await fetchUser(); // Refresh user data in store
      showMessage({
        message: "Profile updated successfully!",
        type: "success",
      });
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: `Error updating profile: ${error.message}`,
        type: "danger",
      });
      console.error("Update profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDriverRole = () => {
    const newIsDriverRole = !isDriverRole;
    setIsDriverRole(newIsDriverRole);
    if (newIsDriverRole) {
      // If becoming a driver, default to 'driver' role, or 'both' if they were 'rider'
      setRole(user?.role === "rider" ? "both" : "driver");
    } else {
      // If unchecking driver, become 'rider'
      setRole("rider");
    }
  };

  if (!user) {
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: "center" }}
        size="large"
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
      />

      <Text style={styles.label}>Profile Picture URL</Text>
      <TextInput
        style={styles.input}
        value={profilePictureUrl}
        onChangeText={setProfilePictureUrl}
        placeholder="http://example.com/image.png"
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Register as Driver/Offer Rides?</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDriverRole ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleDriverRole}
          value={isDriverRole}
        />
      </View>

      {isDriverRole && (
        <>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>
          <Text style={styles.label}>Vehicle Type (motorbike/scooter)</Text>
          <TextInput
            style={styles.input}
            value={vehicleType}
            onChangeText={setVehicleType}
            placeholder="e.g., motorbike"
          />

          <Text style={styles.label}>Registration Number</Text>
          <TextInput
            style={styles.input}
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
            placeholder="Vehicle Registration"
          />

          <Text style={styles.label}>License Number</Text>
          <TextInput
            style={styles.input}
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            placeholder="Driving License"
          />

          <Text style={styles.label}>Vehicle Model</Text>
          <TextInput
            style={styles.input}
            value={vehicleModel}
            onChangeText={setVehicleModel}
            placeholder="e.g., Honda CBR"
          />
        </>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginVertical: 20 }}
        />
      ) : (
        <Button title="Update Profile" onPress={handleUpdateProfile} />
      )}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 10,
    marginBottom: 10,
    borderTopWidth: 1,
    paddingTop: 10,
    borderColor: "#DDD",
  },
});
