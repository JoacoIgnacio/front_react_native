import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import GenerarHojaDeRepuesta from '../components/GenerarHojaDeRepuesta';

const screenWidth = Dimensions.get('window').width;

const GeneratePrueba = () => {
  const [cantidadPreguntas, setCantidadPreguntas] = useState(10);
  const [cantidadAlternativas, setCantidadAlternativas] = useState(3);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const maxPreguntas = 66;

  useEffect(() => {
    setMostrarFormulario(true);
  }, []);

  const calcularPosicion = (valor, min, max) => {
    const porcentaje = (valor - min) / (max - min);
    const desplazamiento = porcentaje * (screenWidth - 60); // 60 = padding horizontal aprox.
    return desplazamiento;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cantidad de preguntas</Text>
      <View style={styles.sliderContainer}>
        <View style={[styles.bubble, { left: calcularPosicion(cantidadPreguntas, 10, maxPreguntas) }]}>
          <Text style={styles.bubbleText}>{cantidadPreguntas}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={10}
          maximumValue={maxPreguntas}
          step={1}
          value={cantidadPreguntas}
          onValueChange={setCantidadPreguntas}
          minimumTrackTintColor="#1e90ff"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1e90ff"
        />
      </View>

      <Text style={styles.label}>Cantidad de alternativas</Text>
      <View style={styles.sliderContainer}>
        <View style={[styles.bubble, { left: calcularPosicion(cantidadAlternativas, 3, 5) }]}>
          <Text style={styles.bubbleText}>{cantidadAlternativas}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={3}
          maximumValue={5}
          step={1}
          value={cantidadAlternativas}
          onValueChange={setCantidadAlternativas}
          minimumTrackTintColor="#1e90ff"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1e90ff"
        />
      </View>

      {mostrarFormulario && (
        <GenerarHojaDeRepuesta
          preguntas={cantidadPreguntas}
          alternativas={cantidadAlternativas}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sliderContainer: {
    marginBottom: 40,
    justifyContent: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  bubble: {
    position: 'absolute',
    top: -30,
    backgroundColor: '#1e90ff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bubbleText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GeneratePrueba;
