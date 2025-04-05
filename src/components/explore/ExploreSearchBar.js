import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ExploreSearchBar = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  isSearching,
  onClearSearch,
  inputRef,
  onFocus,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.icon} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search for destination..."
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
          onSubmitEditing={() => onSearchSubmit(searchQuery)}
          onFocus={onFocus}
          blurOnSubmit={false}
        />
        {isSearching && (
          <ActivityIndicator size="small" color="#555" style={styles.loader} />
        )}
        {searchQuery.length > 0 && !isSearching && (
          <TouchableOpacity onPress={onClearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 5 : 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f8f8f8",
    zIndex: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  icon: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    height: "100%",
  },
  loader: {
    marginHorizontal: 8,
  },
  clearButton: {
    padding: 8,
  },
});

export default ExploreSearchBar;
