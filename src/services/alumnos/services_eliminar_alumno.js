import { Alert } from 'react-native';
import { EXPO_Url } from '@env';

const eliminarAlumno = async (alumnoId) => {
    try {
        const response = await fetch(`${EXPO_Url}/alumnos/${alumnoId}`, {
            method: 'DELETE',
        });

        return response.ok ? alumnoId : null;
    } catch (error) {
        Alert.alert('Error', `Hubo un problema al eliminar el alumno: ${error.message}`);
        return null;
    }
};

export default eliminarAlumno;
