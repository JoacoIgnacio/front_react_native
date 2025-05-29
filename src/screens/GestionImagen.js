// ... importaciones
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Alert, ScrollView, Dimensions, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import ImagePickerComponent from '../components/ImagePickerComponent';
import CameraComponent from '../components/CameraComponent';
import { AntDesign } from '@expo/vector-icons';
import { EXPO_Url } from '@env';

const screenWidth = Dimensions.get('window').width;

const GestionImagen = ({ route, navigation }) => {
  const { asignatura, alumno, imagen, respuestas, correctas, total_preguntas } = route.params;

  const preguntasImagen = asignatura.preguntas;
  const respuestasImagen = asignatura.respuestas;

  const ANSWER_KEY = {};
  preguntasImagen.forEach((pregunta, index) => {
    ANSWER_KEY[pregunta.toString()] = respuestasImagen[index].toString();
  });

  const [imageDimensions, setImageDimensions] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Redimensionar la imagen para que escale correctamente en el front
  useEffect(() => {
    if (imagen) {
      Image.getSize(
        imagen,
        (width, height) => {
          const ratio = screenWidth / width;
          const scaledHeight = height * ratio;
          setImageDimensions({ width: screenWidth, height: scaledHeight });
        },
        (error) => {
          console.error('Error al obtener dimensiones de la imagen:', error);
        }
      );
    }
  }, [imagen]);
  
  const handleGuardarPrueba = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`${EXPO_Url}/guardar-prueba`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asignatura_id: asignatura.id,
          alumno_id: alumno.id,
          respuestas: respuestas,
          correctas: correctas,
          incorrectas: total_preguntas - correctas,
          total_preguntas: total_preguntas,
        }),
      });

      const data = await response.json();

      if (data.status) {
        Alert.alert('Éxito', 'Prueba guardada exitosamente');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.mensaje || 'Error al guardar la prueba');
      }
    } catch (error) {
      console.error('Error al guardar la prueba:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar la prueba');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmarGuardar = () => {
    Alert.alert(
      'Confirmar Guardado',
      '¿Seguro que deseas guardar esta prueba?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Guardar', onPress: handleGuardarPrueba }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.buttonContainer}>
        <CameraComponent alumno={alumno} asignatura={asignatura} ANSWER_KEY={ANSWER_KEY} />
        <ImagePickerComponent alumno={alumno} asignatura={asignatura} ANSWER_KEY={ANSWER_KEY} />
      </View>

      <ScrollView horizontal contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={[styles.imageWrapper, { minHeight: 1000 }]}>
          {imagen && imageDimensions ? (
            <Image
              source={{ uri: imagen }}
              style={[styles.image, imageDimensions]}
              resizeMode="contain"
              onError={() => Alert.alert('Error al cargar la imagen')}
            />
          ) : (
            <AntDesign name="filetext1" size={150} color="white" />
          )}
        </View>
      </ScrollView>

      {/* Botón Confirmar y Guardar */}
      {imagen && (
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={confirmarGuardar} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <AntDesign name="checkcircleo" size={24} color="white" />
                <Text style={styles.textButton}>Confirmar y Guardar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  imageWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: screenWidth - 40,
  },
  saveButtonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#28a745',
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

export default GestionImagen;
