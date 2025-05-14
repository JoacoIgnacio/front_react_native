import { Alert } from 'react-native';
import { EXPO_Url } from '@env';

const editarAlumno = async (alumnoId, nuevoNombre, nuevoApellido, curso_id) => {
    try {
        const response = await fetch(`${EXPO_Url}/alumnos/${alumnoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nuevoNombre,
                apellido: nuevoApellido,
                curso_id
            }),
        });

        return response.ok ? alumnoId : null;
    } catch (error) {
        Alert.alert('Error', `Hubo un problema al editar el alumno: ${error.message}`);
        return null;
    }
};

export default editarAlumno;
