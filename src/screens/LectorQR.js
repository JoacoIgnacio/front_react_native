import React, { useState, useEffect } from 'react';
import { Alert, Text, View, StyleSheet } from 'react-native';
import { CameraView, Camera } from "expo-camera";
import PasosModal from '../components/Modal';
import obtenerAsignaturas from '../services/pruebas/services_asignaturas_id';

const QRScannerScreen = ({ navigation }) => {
    const [showModal, setShowModal] = useState(true);  // ← Primero se muestra el modal
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
        if (scanned) return;
        setScanned(true);

        try {
            const alumno = JSON.parse(data);
            const asignatura = await obtenerAsignaturas(alumno['asignatura_id']);

            // ✅ Redirige correctamente
            navigation.replace('Gestion de prueba', {
                asignatura,
                alumno,
                imagen: ''
            });

        } catch (error) {
            Alert.alert(
                "Error",
                "El código QR no es válido.",
                [{ text: "OK", onPress: () => navigation.replace("Inicio") }]
            );
        } finally {
            setTimeout(() => setScanned(false), 2000);
        }
    };

    if (hasPermission === null) {
        return <Text>Solicitando permisos de cámara...</Text>;
    }

    if (hasPermission === false) {
        return <Text>No se puede acceder a la cámara.</Text>;
    }

    return (
        <View style={styles.container}>
            {!showModal && (
                <CameraView
                    cameraType="back"
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                    style={StyleSheet.absoluteFillObject}
                />
            )}
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
