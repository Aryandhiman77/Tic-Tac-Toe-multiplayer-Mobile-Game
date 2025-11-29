import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

const QRScanner = () => {
  const [hasPermission, setHasPermission] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

  useEffect(() => {
    const getPermissions = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission !== 'authorized') {
        const newPermission = await Camera.requestCameraPermission();
        setHasPermission(newPermission === 'authorized');
      } else {
        setHasPermission(true);
      }

      // For Android 13+, request separately
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    getPermissions();
  }, []);

  useEffect(() => {
    if (barcodes.length > 0) {
      const qr = barcodes[0].displayValue;
      if (qr) {
        Alert.alert('QR Code Scanned', qr);
        console.log('Scanned QR Code:', qr);
      }
    }
  }, [barcodes]);

  if (!device) return <Text style={styles.loadingText}>Loading Camera...</Text>;
  if (!hasPermission) return <Text style={styles.permissionText}>Camera permission denied</Text>;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5} // optional, limit FPS for performance
      />
      <View style={styles.overlay}>
        <Text style={styles.instruction}>Align the QR code within the frame</Text>
      </View>
    </View>
  );
};

export default QRScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
  },
  instruction: {
    color: 'white',
    fontSize: 16,
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
  },
  permissionText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'red',
    fontSize: 18,
  },
});
