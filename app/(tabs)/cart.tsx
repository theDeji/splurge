import ProductCard from "@/components/ProductCard";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { PRODUCTS } from "../../data/products";
import { RootState } from "../../store";
import { removeFromCart, updateQuantity } from "../../store/cartSlice";

export default function CartScreen() {
  const items = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch();

  const cartWithDetails = items.map((i) => {
    const product = PRODUCTS.find((p) => p.id === i.productId)!;
    return { ...i, product };
  });

  const total = cartWithDetails.reduce(
    (acc, cur) => acc + cur.product.price * cur.quantity,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cart</Text>
      </View>
      {!cartWithDetails.length ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="cart-remove" size={50} color="black" />
          <Text style={{ padding: 12, fontSize: 18 }}>
            Your cart is empty 😥
          </Text>
        </View>
      ) : (
        <FlatList
          data={cartWithDetails}
          keyExtractor={(i) => i.productId}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View>
              <ProductCard
                product={item.product}
                cart={true}
                quantity={item.quantity}
                decrement={() =>
                  dispatch(
                    updateQuantity({
                      productId: item.productId,
                      quantity: item.quantity - 1,
                    })
                  )
                }
                increment={() =>
                  dispatch(
                    updateQuantity({
                      productId: item.productId,
                      quantity: item.quantity + 1,
                    })
                  )
                }
                clear={() =>
                  dispatch(removeFromCart({ productId: item.productId }))
                }
              />
            </View>
          )}
        />
      )}
      {cartWithDetails.length ? (
        <View style={styles.footer}>
          <Text style={styles.total}>Total: ₦{total.toLocaleString()}</Text>
          <Pressable
            style={[
              styles.checkout,
              { backgroundColor: cartWithDetails.length ? "#007AFF" : "gray" },
            ]}
            disabled={cartWithDetails.length ? false : true}
            onPress={() => {
              // dispatch(clearCart());
              router.push("/product/checkout");
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Proceed to Checkout
            </Text>
          </Pressable>
        </View>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 10 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    height: 72,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  row: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  qtyRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: { fontSize: 20, paddingHorizontal: 8 },
  remove: { color: "red", marginLeft: 12 },
  footer: { padding: 12, borderTopWidth: 1, borderColor: "#eee" },
  total: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  checkout: {
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
});
