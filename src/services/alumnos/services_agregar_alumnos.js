import { Alert } from 'react-native';
import { EXPO_Url } from '@env';

const AgregarAlumno = async (nombre, apellido, curso) => {
    if (nombre.trim() === '' || apellido.trim() === '') {
        Alert.alert('Error', 'El nombre y apellido son obligatorios.');
        return;
    }

    const alumno = { nombre, apellido, curso_id: curso };

    try {
        const response = await fetch(`${EXPO_Url}/alumnos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(alumno),
        });

        const data = await response.json();
        return data.status ? data : null;
    } catch (error) {
        Alert.alert('Error', `Hubo un problema al agregar el alumno: ${error.message}`);
        return null;
    }
};

export default AgregarAlumno;
