import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import handlePostRequest from '../services/scanner/services_seleccionar_archivo';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  '[expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated',
]);

export default function CameraComponent({ alumno, asignatura, ANSWER_KEY }) {
    const navigation = useNavigation();
    const handleTomarFoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            alert("Permiso denegado para usar la cámara.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });


        if (result.canceled || !result.assets || result.assets.length === 0) {
            return;
        }

        const imageUri = result.assets[0].uri;


        try {
            const fileInfo = await FileSystem.getInfoAsync(imageUri);
            if (!fileInfo.exists) {
                alert("El archivo no existe.");
                return;
            }

            const response = await handlePostRequest({
                id: asignatura.id,
                alumno,
                alternativas: asignatura.alternativas,
                ANSWER_KEY,
                imageUri: fileInfo.uri,
                total_columnas: asignatura.total_columnas,
            });

            if (response?.image) {
                navigation.navigate('Gestion de prueba', {
                    alumno,
                    asignatura,
                    imagen: response.image,
                    respuestas: response.respuestas,             // ✅ ¡ESTÁ OK!
                    correctas: response.correctas,
                    total_preguntas: response.total_preguntas
                  });
                  
            } else {
                Alert.alert("Error", "Error al procesar la imagen.");
            }
        } catch (error) {
            //console.error("Error al obtener información del archivo:", error);
            Alert.alert("Error", "Ha ocurrido un error al procesar la imagen.");
        }
    };

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={handleTomarFoto}>
                <Ionicons name="scan" size={24} color="white" />
                <Text style={styles.textButton}>Escanear Prueba</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textButton: {
        color: 'white',
        marginLeft: 10,
    },
});
