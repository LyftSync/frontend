import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const SearchResultItem = React.memo(({ item, onSelectItem }) => (
  <TouchableOpacity
    style={styles.resultItem}
    onPress={() => onSelectItem(item)}
  >
    <Ionicons
      name="location-sharp"
      size={18}
      color="#555"
      style={styles.itemIcon}
    />
    <View style={styles.itemTextContainer}>
      <Text style={styles.resultName} numberOfLines={1}>
        {item.name?.split(",")[0]}
      </Text>
      <Text style={styles.resultAddress} numberOfLines={1}>
        {item.name?.substring(item.name.indexOf(",") + 1).trim()}
      </Text>
    </View>
  </TouchableOpacity>
));

const SearchResultsList = ({
  searchResults,
  searchError,
  isVisible,
  onSelectItem,
  headerHeight,
}) => {
  if (!isVisible || (!searchResults?.length && !searchError)) {
    return null;
  }

  const renderItem = ({ item }) => (
    <SearchResultItem item={item} onSelectItem={onSelectItem} />
  );

  return (
    <View style={[styles.resultsOverlay, { top: headerHeight }]}>
      {searchError && <Text style={styles.errorText}>{searchError}</Text>}
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.osm_type}-${item.id}`}
        style={styles.resultsList}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          !searchError ? (
            <Text style={styles.noResultsText}>No results found.</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  resultsOverlay: {
    position: "absolute",
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    maxHeight: Dimensions.get("window").height * 0.4,
    zIndex: 9,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  resultsList: {},
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemIcon: {
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1,
  },
  resultName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  resultAddress: {
    fontSize: 12,
    color: "#666",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    padding: 10,
    fontSize: 14,
  },
  noResultsText: {
    color: "#666",
    textAlign: "center",
    padding: 15,
    fontSize: 14,
  },
});

export default React.memo(SearchResultsList);
