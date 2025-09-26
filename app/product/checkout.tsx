import { clearCart } from "@/store/cartSlice";
import { router, useNavigation } from "expo-router";
import React, { useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { PRODUCTS } from "../../data/products";
import { RootState } from "../../store";

export default function CheckoutScreen() {
  const items = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const cartWithDetails = items.map((i) => {
    const product = PRODUCTS.find((p) => p.id === i.productId)!;
    return { ...i, product };
  });

  const subtotal = cartWithDetails.reduce(
    (acc, cur) => acc + cur.product.price * cur.quantity,
    0
  );

  // simple business rules
  const deliveryFee = useMemo(() => (subtotal > 20000 ? 0 : 1500), [subtotal]);
  const taxRate = 0.075;
  const tax = Math.round(subtotal * taxRate);
  const discount = 0;
  const total = subtotal + deliveryFee + tax - discount;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: "Checkout",
      headerBackTitle: "",
    });
  }, [navigation]);

  const handleCheckout = () => {
    setLoading(!loading);
    setTimeout(() => {
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Your order has been confirmed 🎊",
        text2: "Thanks for slurging with us.",
        position: "bottom",
        text1Style: {
          fontSize: 16,
        },
        text2Style: {
          fontSize: 14,
        },
      });
      dispatch(clearCart());
      router.push("/");
    }, 3000);
  };

  const renderItem = ({ item }: any) => {
    const lineTotal = item.product.price * item.quantity;
    return (
      <View style={styles.row}>
        <Image source={item.product.thumbnail} style={styles.thumb} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.prodName}>{item.product.name}</Text>
          <Text style={styles.prodDesc}>
            ₦{item.product.price.toLocaleString()}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.qty}>x{item.quantity}</Text>
          <Text style={styles.lineTotal}>₦{lineTotal.toLocaleString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 10 }}
      >
        <Text style={styles.title}>Order Summary</Text>

        <FlatList
          data={cartWithDetails}
          keyExtractor={(i) => i.productId}
          renderItem={renderItem}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />

        <View style={{ height: 12 }} />

        {/* Price breakdown card */}
        <View style={styles.card}>
          <Text style={[styles.subtitle, { marginBottom: 8 }]}>
            Price Details
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>₦{subtotal.toLocaleString()}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>Delivery</Text>
            <Text style={styles.value}>
              {deliveryFee === 0 ? "Free" : `₦${deliveryFee.toLocaleString()}`}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>Tax (7.5%)</Text>
            <Text style={styles.value}>₦{tax.toLocaleString()}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Discount</Text>
              <Text style={styles.value}>-₦{discount.toLocaleString()}</Text>
            </View>
          )}

          <View style={[styles.summaryRow, { marginTop: 8 }]}>
            <Text style={[styles.label, { fontWeight: "700" }]}>Total</Text>
            <Text style={[styles.value, { fontWeight: "700" }]}>
              ₦{total.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Checkout button */}
        <View style={{ paddingHorizontal: 6, marginTop: 16 }}>
          <Pressable
            disabled={loading} //limit button press when loading
            style={[styles.checkout, styles.checkoutPrimary]}
            onPress={handleCheckout}
          >
            {loading ? (
              <ActivityIndicator size={24} color={"white"} />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Confirm Order
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
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
    paddingHorizontal: 8,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
    backgroundColor: "#fff",
    borderRadius: 10,
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
  checkoutPrimary: {
    backgroundColor: "#007AFF",
  },

  // new styles
  thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: "#f5f5f5" },
  prodName: { fontSize: 16, fontWeight: "600" },
  prodDesc: { color: "#666", marginTop: 4 },
  qty: { color: "#444", marginBottom: 6 },
  lineTotal: { fontWeight: "700" },

  card: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    // subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  subtitle: { fontSize: 16, fontWeight: "700" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: { color: "#666" },
  value: { color: "#111" },
});
