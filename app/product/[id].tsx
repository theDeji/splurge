import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { PRODUCTS } from "../../data/products";
import { addToCart } from "../../store/cartSlice";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = PRODUCTS.find((p) => p.id === id);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: "",
      headerBackTitle: "",
    });
  }, [navigation]);

  if (!product) return <Text>Product not found</Text>;

  return (
    <View style={styles.container}>
      <Image source={product.thumbnail} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>₦{product.price.toLocaleString()}</Text>
      <Text style={styles.desc}>{product.description}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          dispatch(addToCart({ productId: product.id, qty: 1 }));
          Toast.show({
            type: "success",
            text1: "Added to cart 🛒",
            text2: "Your item has been added successfully",
            position: "bottom",
            text1Style: {
              fontSize: 16,
            },
            text2Style: {
              fontSize: 14,
            },
          });
        }}
      >
        <Text style={styles.buttonText}>Add to cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  back: { marginBottom: 12, color: "#007AFF" },
  image: { width: "100%", height: 300, borderRadius: 8, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: "700" },
  price: { marginTop: 8, fontSize: 18 },
  desc: { marginTop: 12, color: "#444" },
  button: {
    marginTop: 24,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700" },
});
