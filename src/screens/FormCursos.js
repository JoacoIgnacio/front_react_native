import React, { useState } from 'react';
import { Alert, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import styles from '../styles/style_form_cursos';
import guardarCurso from '../services/cursos/services_form_cursos';
import obtenerCursosPorIdCurso from '../services/cursos/services_curso_id';
import Cargando from '../components/Cargando';

const CrearCursoFormulario = ({ navigation }) => {
    const [curso, setCurso] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (curso.trim() === '') {
            setError('El nombre del curso es requerido');
            return;
        }

        setIsLoading(true);
        const response_guardar_curso = await guardarCurso(curso, 1); // user_id = 1

        if (response_guardar_curso.status) {
            navigation.navigate('Mis Cursos');
            Alert.alert('Correcto', response_guardar_curso.mensaje);
        } else {
            Alert.alert('Error', response_guardar_curso.error || 'Hubo un problema al crear el curso.');
        }
        setIsLoading(false);
    };


    return (
        <View style={styles.centeredView}>
            <TextInput
                style={styles.input}
                value={curso}
                onChangeText={(text) => setCurso(text)}
                placeholder="Ingrese el nombre del curso"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
                <AntDesign name="plussquareo" size={24} color="white" />
                <Text style={styles.buttonText}>Crear Curso</Text>
            </TouchableOpacity>
            {isLoading && (
                <Cargando/>
            )}
        </View>
    );
};

export default CrearCursoFormulario;
