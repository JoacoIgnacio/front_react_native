import { Alert } from 'react-native';
import { EXPO_Url } from '@env';

const eliminarAsignaturaCompleta = async (asignatura_id) => {
    try {
        const response = await fetch(`${EXPO_Url}/asignaturas_completa/${asignatura_id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        if (data.status) {
            return true;
        } else {
            Alert.alert('Error', data.mensaje || 'No se pudo eliminar la asignatura.');
            return false;
        }
    } catch (error) {
        console.error('Error al eliminar asignatura:', error.message);
        Alert.alert('Error', 'Hubo un problema al eliminar la asignatura.');
        return false;
    }
};

export default eliminarAsignaturaCompleta;
