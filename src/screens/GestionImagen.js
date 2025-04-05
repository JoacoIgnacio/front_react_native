import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import ImagePickerComponent from '../components/ImagePickerComponent';
import CameraComponent from '../components/CameraComponent';
import { AntDesign } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const GestionImagen = ({ route }) => {
  const { asignatura, alumno, imagen } = route.params;

  const preguntasImagen = asignatura.preguntas;
  const respuestasImagen = asignatura.respuestas;

  const ANSWER_KEY = {};
  preguntasImagen.forEach((pregunta, index) => {
    ANSWER_KEY[pregunta.toString()] = respuestasImagen[index].toString();
  });

  const [imageDimensions, setImageDimensions] = useState(null);

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.buttonContainer}>
        <CameraComponent alumno={alumno} asignatura={asignatura} ANSWER_KEY={ANSWER_KEY} />
        <ImagePickerComponent alumno={alumno} asignatura={asignatura} ANSWER_KEY={ANSWER_KEY} />
      </View>

      <View style={styles.imageWrapper}>
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
  },
  image: {
    width: screenWidth - 40, // descontando padding horizontal
  },
});

export default GestionImagen;
