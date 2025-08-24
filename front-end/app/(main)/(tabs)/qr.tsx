import React, { useState, useEffect } from "react"
import {View,Text,StyleSheet,TouchableOpacity,Dimensions,Alert} from "react-native"
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera"
import { useIsFocused } from "@react-navigation/native"
import { useRouter } from "expo-router"
import * as Linking from "expo-linking"
import withAuthProtection from "@/components/common/ProtectedRoute"
import { Ionicons } from "@expo/vector-icons"
import Feather from '@expo/vector-icons/Feather'

const { width, height } = Dimensions.get("window")
const SCAN_AREA_SIZE = width * 0.7
const BORDER_COLOR = "rgb(37, 99, 235)"

const QRScannerScreen = () => {

  // когда нажимаешь на таб qr,то qr открывается 
  // добавить крестик чтоб можно было закрыть qr ()
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const isFocused = useIsFocused()
  const router = useRouter()

  useEffect(()=>{
    if(!permission){
      requestPermission()
    }
  },[permission])

  const handleBarCodeScanned = ({data} : BarcodeScanningResult)=>{
    setScanned(true)
    
    if(data.includes("http://localhost:8081/report")){
      router.push("/report")
    }
    else{
      Alert.alert(
        "Внешняя ссылка",
        "Перейти по внешней ссылке?",
        [
          {
            text: "Отмена",
            onPress: () => setScanned(false),
            style: "cancel"
          },
          { 
            text: "Открыть", 
            onPress: () => {
              Linking.openURL(data);
              setScanned(false);
            }
          }
        ]
      );
    }
  }
  const handleRescan =()=>{
    setScanned(false)
  }

  if(!permission){
    return (
      <View style={styles.centered}>
        <Text>Запрос разрешений...</Text>
      </View>
    )
  }

  if(!permission.granted){
    return (
      <View style={styles.centered}>
        <Feather name="camera-off" size={64} color="#ccc" style={styles.icon} />
        <Text style={styles.permissionText}>Нет доступа к камере</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Предоставить доступ</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView style={styles.camera} facing="back" onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}>
          <View style={styles.overlay}>
            {/* Верхняя затемненная область */}
            <View style={[styles.overlaySection, { height: (height - SCAN_AREA_SIZE) / 2 }]} />
            
            {/* Центральная область с рамкой */}
            <View style={styles.middleSection}>
              <View style={[styles.overlaySection, { width: (width - SCAN_AREA_SIZE) / 2 }]} />
              
              <View style={styles.scanArea}>
                {/* Уголки рамки */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
                
                {/* Анимированная линия сканирования */}
                {!scanned && <View style={styles.scanLine} />}
              </View>
              
              <View style={[styles.overlaySection, { width: (width - SCAN_AREA_SIZE) / 2 }]} />
            </View>
            
            {/* Нижняя затемненная область с инструкцией */}
            <View style={[styles.overlaySection, { height: (height - SCAN_AREA_SIZE) / 2, justifyContent: 'flex-start' }]}>
              <Text style={styles.instructionText}>
                Наведите камеру на QR-код
              </Text>
            </View>
          </View>
        </CameraView>
      )}

      {scanned && (
        <View style={styles.rescanContainer}>
          <TouchableOpacity style={styles.rescanButton} onPress={handleRescan}>
            <Ionicons name="scan" size={24} color="white" />
            <Text style={styles.rescanText}>Сканировать снова</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default withAuthProtection(QRScannerScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  icon: {
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  permissionButton: {
    backgroundColor: BORDER_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlaySection: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  middleSection: {
    flexDirection: "row",
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: BORDER_COLOR,
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
  scanLine: {
    height: 2,
    width: "90%",
    backgroundColor: BORDER_COLOR,
    position: "absolute",
  },
  instructionText: {
    color: "white",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
    fontWeight: "500",
  },
  rescanContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  rescanButton: {
    flexDirection: "row",
    backgroundColor: BORDER_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    gap: 8,
  },
  rescanText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});