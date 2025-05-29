
import { Alert } from 'react-native';
import { EXPO_Url } from '@env';

const generarFormatosAlumnos = async (curso, asignatura) => {
    try {
        const response = await fetch(`${EXPO_Url}/formato/${curso}/${asignatura}/generarFormatos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (data.status) {
            Alert.alert('Correcto', data.mensaje);
        } else {
            Alert.alert('Error', data.mensaje);
        }
    } catch (error) {
        //console.error('Error al obtener las hojas de respuestas:', error.message);
        Alert.alert('Error', 'Hubo un problema al obtener las hojas de respuestas.');
    }
};

export default generarFormatosAlumnos;