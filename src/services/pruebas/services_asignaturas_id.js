
import { Alert } from 'react-native';
import { EXPO_Url } from '@env';

const obtenerAsignaturas = async (id) => {
    try {
        const response = await fetch(`${EXPO_Url}/asignaturas/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data.status) {
            return data.asignatura;
        } else {
            Alert.alert('Error', data.error || 'Hubo un problema al obtener los hojas de respuestas.');
            return null;
        }
    } catch (error) {
        //console.error('Error al obtener las hojas de respuestas:', error.message);
        Alert.alert('Error', 'Hubo un problema al obtener las hojas de respuestas.');
    }
};

export default obtenerAsignaturas;