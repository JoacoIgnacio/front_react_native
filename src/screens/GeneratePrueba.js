import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import GenerarHojaDeRepuesta from '../components/GenerarHojaDeRepuesta';

const GeneratePrueba = () => {
  const [cantidadPreguntas, setCantidadPreguntas] = useState(10);
  const [cantidadAlternativas, setCantidadAlternativas] = useState(3);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const maxPreguntas = 70;

  useEffect(() => {
    setMostrarFormulario(true);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Seleccione la cantidad de preguntas:</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={cantidadPreguntas}
          onValueChange={(itemValue) => setCantidadPreguntas(Number(itemValue))}
        >
          {Array.from({ length: maxPreguntas - 9 }, (_, i) => i + 10).map(value => (
            <Picker.Item key={value} label={`${value}`} value={value} />
          ))}
        </Picker>
      </View>

      <Text>Seleccione la cantidad de alternativas:</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={cantidadAlternativas}
          onValueChange={(itemValue) => setCantidadAlternativas(Number(itemValue))}
        >
          {[3, 4, 5].map(value => (
            <Picker.Item key={value} label={`${value}`} value={value} />
          ))}
        </Picker>
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
    padding: 20,
    justifyContent: 'center',
  },
  picker: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e90ff',
    marginBottom: 20
  },
});

export default GeneratePrueba;
