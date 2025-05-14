import { Alert } from 'react-native';
import { EXPO_Url } from '@env';

const eliminarCurso = async (curso_id) => {
    try {
        const response = await fetch(`${EXPO_Url}/cursos/${curso_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (data.status) {
            Alert.alert('Éxito', `Curso eliminado correctamente. Alumnos eliminados: ${data.alumnos_eliminados}`);
            return true;
        } else {
            Alert.alert('Error', data.error || 'Hubo un problema al eliminar el curso.');
            return false;
        }
    } catch (error) {
        Alert.alert('Error', `Error al eliminar el curso: ${error.message}`);
        return false;
    }
};

export default eliminarCurso;
