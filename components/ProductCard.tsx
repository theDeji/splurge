import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Product } from "../types";

export default function ProductCard({
  product,
  cart,
  addToCart,
  increment,
  decrement,
  clear,
  quantity,
}: {
  product: Product;
  cart?: boolean;
  addToCart?: () => void;
  increment?: () => void;
  decrement?: () => void;
  clear?: () => void;
  quantity?: number;
}) {
  const router = useRouter();
  return cart ? (
    <View style={styles.cartContainer}>
      <View style={styles.card}>
        <Image source={product.thumbnail} style={styles.thumb} />
        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>₦{product.price.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={clear}>
          <MaterialIcons name="delete" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.control}>
        <>
          <TouchableOpacity style={styles.iconBtn} onPress={decrement}>
            <Text style={styles.ctrl}>{"-"}</Text>
          </TouchableOpacity>
          <Text style={styles.qtt}>{`x ${quantity}`}</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={increment}>
            <Text style={styles.ctrl}>{"+"}</Text>
          </TouchableOpacity>
        </>
      </View>
    </View>
  ) : (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <Image source={product.thumbnail} style={styles.thumb} />
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>₦{product.price.toLocaleString()}</Text>
      </View>
      {/* <TouchableOpacity style={styles.iconBtn} onPress={addToCart}>
        <MaterialIcons name="add-shopping-cart" size={18} color="white" />
      </TouchableOpacity> */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    width: "100%",
  },
  cartContainer: {},
  control: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    alignSelf: "flex-end",
    paddingHorizontal: 15,
    width: "50%",
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Android shadow
    elevation: 3,
  },
  iconBtn: {
    width: 30,
    height: 30,
    backgroundColor: "#007EFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  thumb: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  content: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  qtt: { fontSize: 18, fontWeight: "700" },
  ctrl: { fontSize: 20, fontWeight: "600", color: "white" },
  price: { marginTop: 6, color: "#333" },
});
