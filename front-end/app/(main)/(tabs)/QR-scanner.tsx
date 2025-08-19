// Идеальный UI 
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Dimensions } from "react-native";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
// import withAuthProtection from "../context/HomeScreen_protected";
import withAuthProtection from "@/components/common/ProtectedRoute";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");
const squareSize = width * 0.7;
const borderColor = "rgb(37,99,235)";

function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();
  const router = useRouter();
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);
// Alert
  // const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    // setScanned(true);
    // alert(`QR: ${data}`);
  // };

  // Открытие ссылки
  // const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    // setScanned(true);
    // Linking.openURL(data).catch(err => {
      // console.error("Не удалось открыть ссылку:", err);
    // });
  // };

  // Переход на экран репорта внутри приложения
  // const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    // setScanned(true);
    // const roomId = data.split('=')[1]; // Предполагаем, что QR содержит строку вида "room=101"
    // if (roomId) {
      // // router.push(`/report/${roomId}`); // Переход на экран репорта с ID комнаты
      // // router.push(`/report?room=${roomId}`); // Используем query параметр для передачи ID
      // router.push(`/report`); // Переход на экран репорта с ID комнаты
    // } else {
      // alert("Неверный формат QR кода");
    // }
  // };

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    setScanned(true);

    if (data.includes("http://localhost:8081/report")) {
      router.push("/report"); // ⬅️ переход внутри приложения
    } else {
      // fallback, если это внешняя ссылка
      Linking.openURL(data);
    }
  };

  if (!permission) {
    return <Text>Запрос разрешений...</Text>;
  }
  if (!permission.granted) {
    return (
      <View>
        <Text>Нет доступа к камере</Text>
        <Button title="Разрешить" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          {/* Оверлей с затемнением и прозрачным окном */}
          <View style={styles.overlay}>
            {/* Верхняя тёмная зона */}
            <View style={[styles.overlayPart, { height: (height - squareSize) / 2, width: "100%" }]} />

            {/* Центральная зона */}
            <View style={{ flexDirection: "row" }}>
              {/* Левая тёмная полоса */}
              <View style={[styles.overlayPart, { width: (width - squareSize) / 2 }]} />

              {/* Прозрачный квадрат с уголками */}
              <View style={styles.transparentSquare}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>

              {/* Правая тёмная полоса */}
              <View style={[styles.overlayPart, { width: (width - squareSize) / 2 }]} />
            </View>

            {/* Нижняя тёмная зона */}
            <View style={[styles.overlayPart, { height: (height - squareSize) / 2, width: "100%" }]} />
          </View>
        </CameraView>
      )}

      {scanned && (
        <Button title="Сканировать снова" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

export default withAuthProtection(QRScannerScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    alignItems: "center",
  },
  overlayPart: {
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  transparentSquare: {
    width: squareSize,
    height: squareSize,
    backgroundColor: "transparent",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: borderColor,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
});
