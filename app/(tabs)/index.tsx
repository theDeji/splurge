import SimpleBottomSheet from "@/components/BottomSheet";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";
import { usePersistCart } from "@/hooks/usePersistCart";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function HomeScreen() {
  const router = useRouter();
  usePersistCart();
  const dispatch = useDispatch();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  // sortedProducts is used as the data source for the FlatList
  const sortedProducts = useMemo(() => {
    if (sortOrder === "asc") {
      return [...PRODUCTS].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      return [...PRODUCTS].sort((a, b) => b.price - a.price);
    }
    return PRODUCTS;
  }, [sortOrder]);

  const sortLabel =
    sortOrder === "asc"
      ? "Price: Lowest → Highest"
      : sortOrder === "desc"
      ? "Price: Highest → Lowest"
      : "Sort: None";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Splurge 💸</Text>
        <TouchableOpacity
          onPress={() => setSheetVisible(true)}
          accessibilityLabel="filter-button"
        >
          <FontAwesome6 name="filter" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* show current sort label */}
      <View style={styles.sortRow}>
        <Text style={styles.sortText}>{sortLabel}</Text>
        {sortOrder && (
          <TouchableOpacity
            onPress={() => setSortOrder(null)}
            style={styles.clearBtn}
            accessibilityLabel="clear-sort"
          >
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={sortedProducts} // <- use sortedProducts here
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <SimpleBottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        snapHeight={260}
      >
        <Text style={sheetStyles.title}>Sort by Price</Text>

        <TouchableOpacity
          style={sheetStyles.option}
          onPress={() => {
            setSortOrder("asc");
            setSheetVisible(false);
          }}
        >
          <Text>Lowest to Highest</Text>
          <FontAwesome6 name="arrow-up-wide-short" size={24} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity
          style={sheetStyles.option}
          onPress={() => {
            setSortOrder("desc");
            setSheetVisible(false);
          }}
        >
          <Text>Highest to Lowest</Text>
          <FontAwesome6 name="arrow-down-wide-short" size={24} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[sheetStyles.option, { borderBottomWidth: 0 }]}
          onPress={() => {
            setSortOrder(null);
            setSheetVisible(false);
          }}
        >
          <Text>Clear</Text>
        </TouchableOpacity>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}

const sheetStyles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 72,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 22, fontWeight: "700" },
  cartBtn: { color: "#007EFF", fontSize: 16 },

  // sort label row
  sortRow: {
    height: 44,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#fafafa",
    backgroundColor: "#fff",
  },
  sortText: {
    color: "#666",
    fontSize: 14,
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#f2f2f2",
  },
  clearText: {
    fontSize: 13,
    color: "#333",
  },
});
