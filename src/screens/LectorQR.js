import React, { useState, useEffect } from 'react';
import { Alert, Text, View, StyleSheet } from 'react-native';
import { CameraView, Camera } from "expo-camera";
import PasosModal from '../components/Modal';
import obtenerAsignaturas from '../services/pruebas/services_asignaturas_id';

const QRScannerScreen = ({ navigation }) => {
    const [showModal, setShowModal] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getCameraPermissions();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        if (scanned) return; // <- evita múltiples escaneos
        setScanned(true);
    
        try {
            const alumno = JSON.parse(data);
            const asignatura = await obtenerAsignaturas(alumno['asignatura_id']);
            navigation.replace('Gestion de prueba', { asignatura, alumno, imagen: ''}); // <-- replace evita volver hacia atrás escaneando de nuevo
        } catch (error) {
            Alert.alert("Error al leer el código QR", error.message);
            setScanned(false); // permite volver a intentar
        }
    };
    

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417"],
                }}
                style={StyleSheet.absoluteFillObject}
            />
            <PasosModal visible={showModal} onClose={() => setShowModal(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0,
        padding: 0,
    },
});

export default QRScannerScreen;

