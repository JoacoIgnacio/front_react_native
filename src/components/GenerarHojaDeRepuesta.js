import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import ModalHojaDeRespuesta from './ModalHojaDeRespuesta';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Cargando from '../components/Cargando';

const Alternativa = ({ indice, onPress, isSelected }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={[styles.alternativa, isSelected && styles.selectedAlternativa]}>
            <Text>{indice + 1}</Text>
        </View>
    </TouchableOpacity>
);

const GenerarHojaDeRepuesta = ({ preguntas, alternativas }) => {
    const [respuestas, setRespuestas] = useState(Array(preguntas).fill(null));
    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    // Actualiza respuestas cuando cambien preguntas o alternativas
    useEffect(() => {
        setRespuestas(Array(preguntas).fill(null));
    }, [preguntas, alternativas]);
    const handleRespuestaChange = (index, value) => {
        const nuevasRespuestas = [...respuestas];
        nuevasRespuestas[index] = value;
        setRespuestas(nuevasRespuestas);
    };

    const handleSubirPrueba = () => {
        const preguntasSinResponder = respuestas.reduce((sinResponder, respuesta, index) => {
            if (respuesta === null) {
                sinResponder.push(index + 1);
            }
            return sinResponder;
        }, []);

        if (preguntasSinResponder.length === 0) {
            setShowModal(true);
        } else {
            const preguntasSinResponderString = preguntasSinResponder.join(', ');
            Alert.alert('Error', `Debes contestar la(s) pregunta(s) ${preguntasSinResponderString} antes de subir la prueba`);
        }
    };

    const handlePruebaAdded = (hojaDeRespuesta) => {
        setIsLoading(true);
        if (hojaDeRespuesta.status) {
            setIsLoading(false);
            Alert.alert('Correcto', hojaDeRespuesta.mensaje);
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Mis Hoja De Respuestas' }],
                })
            );
        }
    };

    return (
        <><ScrollView>
            <View style={styles.container}>
                {[...Array(preguntas).keys()].map((index) => (
                    <View key={index} style={styles.preguntaContainer}>
                        <Text>Pregunta {index + 1}:</Text>
                        <View style={styles.alternativasContainer}>
                            {[...Array(alternativas).keys()].map((value) => (
                                <Alternativa
                                    key={value}
                                    indice={value}
                                    onPress={() => handleRespuestaChange(index, value)}
                                    isSelected={respuestas[index] === value}
                                />
                            ))}
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={styles.button} onPress={handleSubirPrueba}>
                    <AntDesign name="plussquareo" size={24} color="white" />
                    <Text style={styles.buttonText}>Subir Hoja De Respuesta</Text>
                </TouchableOpacity>

                <ModalHojaDeRespuesta
                    visible={showModal}
                    respuestas={respuestas}
                    preguntas={preguntas}
                    alternativas={alternativas}
                    onClose={() => setShowModal(false)}
                    onPruebaAdded={handlePruebaAdded} />
            </View>
        </ScrollView>
            {isLoading && (
                <Cargando />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
    },
    preguntaContainer: {
        marginBottom: 20,
    },
    alternativasContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8,
    },
    alternativa: {
        backgroundColor: '#1e90ff',
        padding: 10,
        textAlign: 'center',
        alignContent: 'center',
        alignItems: 'center',
        width: 40,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'blue',
        marginRight: 8,
    },
    selectedAlternativa: {
        backgroundColor: 'blue',
        borderColor: 'white',
    },
    button: {
        width: '100%',
        backgroundColor: '#1e90ff',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});

export default GenerarHojaDeRepuesta;
