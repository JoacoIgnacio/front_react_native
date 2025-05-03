import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { AntDesign } from '@expo/vector-icons';
import styles from '../styles/style_home';


export default function HomeScreen() {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, []);

    const handleScanButtonPress = () => {
        if (hasCameraPermission === null) {
            return <View />;
        }
        if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        }

        navigation.navigate('Escanear Alumno');
    };

    return (
        <View style={styles.container}>
            <View style={styles.instructionsContainer}>
                <Text style={styles.title}>Cómo funciona</Text>
                <Text style={styles.subtitle}>Pasos a seguir:</Text>
                <Text style={styles.text}>1° Crea tu curso con tus alumnos</Text>
                <Text style={styles.text}>2° Crea tu hoja de respuestas</Text>
                <Text style={styles.text}>3° Selecciona las respuestas correctas</Text>
                <Text style={styles.text}>4° Escanea el QR del evaluado</Text>
                <Text style={styles.text}>5° Escanea la prueba del evaluado</Text>
                <Text style={styles.text}>6° Obten tu nota y repite</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleScanButtonPress}>
                    <AntDesign name="qrcode" size={24} color="white" />
                    <Text style={styles.buttonText}>Escanear QR</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
