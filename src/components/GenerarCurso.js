import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const CrearCurso = () => {
    const navigation = useNavigation();

    const onPressPrueba = () => {
        if (navigation) {
            navigation.navigate('Crear Cursos');
        } else {
            Alert.alert('Error', 'No se pudo navegar al formulario de creación de cursos.');
        }
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onPressPrueba}>
                <AntDesign name="plussquareo" size={24} color="white" />
                <Text style={styles.buttonText}>Nuevo Curso</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
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


export default CrearCurso;