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
        setScanned(true);
        setShowModal(false);
        try {
            // Dividir la cadena en partes
            const parts = data.split(" ");

            // Crear un objeto JSON con las partes
            const alumno = {
                id: parseInt(parts[0], 10),
                nombre: parts[1],
                apellido: parts[2],
                curso_id: parseInt(parts[3], 10),
                asignatura_id: parts[4]
            };

            const asignatura = await obtenerAsignaturas(alumno['asignatura_id']);
            navigation.navigate('Gestion de prueba', { asignatura, alumno });
        } catch (error) {
            Alert.alert(`Error parsing JSON: ${error}`);
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
        padding: 0
    },

});

export default QRScannerScreen;
