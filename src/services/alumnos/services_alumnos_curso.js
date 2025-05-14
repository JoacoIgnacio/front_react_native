// services_alumnos_curso.js
import { Alert } from 'react-native';
import { EXPO_Url } from '@env';

const obtenerAlumnosPorCurso = async (curso_id) => {
    try {
        const response = await fetch(`${EXPO_Url}/alumnos/curso/${curso_id}`);
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        Alert.alert('Error', `Hubo un problema al obtener los alumnos del curso: ${error.message}`);
        return [];
    }
};

export default obtenerAlumnosPorCurso;
