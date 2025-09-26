// src/components/SimpleBottomSheet.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  onCloseComplete?: () => void;
  children?: React.ReactNode;
  snapHeight?: number;
};

export default function SimpleBottomSheet({
  visible,
  onClose,
  onCloseComplete,
  children,
  snapHeight = 260,
}: Props) {
  // internal mounted state so Modal remains mounted while animating out
  const [mounted, setMounted] = useState<boolean>(visible);

  const translateY = useRef(new Animated.Value(snapHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // helper to run open animation
  const openAnim = () => {
    translateY.setValue(snapHeight);
    backdropOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0.5,
        duration: 220,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(translateY, {
        toValue: 0,
        stiffness: 120,
        damping: 14,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // helper to run close animation
  const closeAnim = (): Promise<void> =>
    new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
        Animated.timing(translateY, {
          toValue: snapHeight,
          duration: 180,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
      ]).start(() => resolve());
    });

  // react to visible prop changes
  useEffect(() => {
    if (visible) {
      // mount and open
      setMounted(true);
      // small timeout to ensure Modal mounted before running animation
      requestAnimationFrame(() => openAnim());
    } else {
      // run close animation, then unmount
      if (mounted) {
        closeAnim().then(() => {
          setMounted(false);
          if (onCloseComplete) onCloseComplete();
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!mounted) return null;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          onClose();
        }}
      >
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
          pointerEvents={visible ? "auto" : "none"}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.sheetContainer,
          {
            transform: [{ translateY }],
            height: snapHeight,
            bottom: 0,
          },
        ]}
      >
        <View style={styles.handle} />
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#000",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  sheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  handle: {
    width: 36,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
});
