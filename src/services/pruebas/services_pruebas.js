import { Alert } from 'react-native';
import { EXPO_Url } from '@env';

const obtenerNotasPorAsignatura = async (asignatura_id) => {
    try {
        const response = await fetch(`${EXPO_Url}/pruebas/notas_por_asignatura/${asignatura_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            Alert.alert('Error', data.error || 'Hubo un problema al obtener las notas.');
            return [];
        }
    } catch (error) {
        //console.error('Error al obtener las notas:', error.message);
        Alert.alert('Error', 'No se pudieron obtener las notas.');
        return [];
    }
};

export default obtenerNotasPorAsignatura;
