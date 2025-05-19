import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { DatePickerModal, TimePickerModal, registerTranslation, enGB} from "react-native-paper-dates";
registerTranslation("en", enGB)
export default function DateTimeSelector({
  label,
  value,
  onChange,
  minimumDate,
  mode = "datetime", // 'date', 'time', or 'datetime'
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const theme = useTheme();

  // Handle date selection
  const handleDateConfirm = ({ date }) => {
    setShowDatePicker(false);
    if (mode === "date") {
      onChange(date);
    } else {
      // Open time picker after date is selected (for 'datetime' mode)
      setShowTimePicker(true);
    }
  };

  // Handle time selection
  const handleTimeConfirm = ({ hours, minutes }) => {
    setShowTimePicker(false);
    const newDate = new Date(value);
    newDate.setHours(hours, minutes);
    onChange(newDate);
  };

  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontSize: 16, marginBottom: 6, color: theme.colors.text }}>
        {label}
      </Text>
      
      <TouchableOpacity
        onPress={() => {
          if (mode === "time") {
            setShowTimePicker(true);
          } else {
            setShowDatePicker(true);
          }
        }}
        style={{
          padding: 12,
          borderRadius: 6,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.outline,
        }}
      >
        <Text style={{ color: theme.colors.text }}>
          {value.toLocaleString()}
        </Text>
      </TouchableOpacity>

      {/* Date Picker (for 'date' or 'datetime' mode) */}
      <DatePickerModal
        mode="single"
        visible={showDatePicker}
        onDismiss={() => setShowDatePicker(false)}
        date={value}
        onConfirm={handleDateConfirm}
        minimumDate={minimumDate}
        locale="en" // Set the locale here
        theme={theme.dark ? "dark" : "light"}
      />

      {/* Time Picker (for 'time' or 'datetime' mode) */}
      <TimePickerModal
        visible={showTimePicker || (mode === "time" && showDatePicker)}
        onDismiss={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
        hours={value.getHours()}
        minutes={value.getMinutes()}
        locale="en" // Set the locale here
        theme={theme.dark ? "dark" : "light"}
      />
    </View>
  );
}
