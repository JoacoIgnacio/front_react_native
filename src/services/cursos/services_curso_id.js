import { Alert } from 'react-native';
import { EXPO_Url } from '@env';

const obtenerCursosPorIdCurso = async (curso_id) => {
    try {
        const response = await fetch(`${EXPO_Url}/cursos/${curso_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            Alert.alert('Error', `Error en la solicitud: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data.curso ? data.curso : null;
    } catch (error) {
        Alert.alert('Error', `Error al obtener los datos: ${error.message}`);
        return null;
    }
};

export default obtenerCursosPorIdCurso;
