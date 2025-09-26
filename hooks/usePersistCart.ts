import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setCart } from "../store/cartSlice";

const CART_KEY = "cart";

export function usePersistCart() {
  const dispatch = useDispatch();
  const cart = useSelector((s: RootState) => s.cart.items);

  // load once on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(CART_KEY);
        if (raw) dispatch(setCart(JSON.parse(raw)));
      } catch (e) {
        console.log(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // save whenever cart changes
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
      } catch (e) {
        console.log(e);
      }
    })();
  }, [cart]);
}
