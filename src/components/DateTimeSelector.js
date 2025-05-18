
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DateTimeSelector({
  label,
  value,
  onChange,
  minimumDate,
  mode = "datetime",
}) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontSize: 16, marginBottom: 6 }}>{label}</Text>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={{
          padding: 12,
          borderRadius: 6,
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#ccc",
        }}
      >
        <Text>{value.toLocaleString()}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={value}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
}
