import { Alert } from 'react-native';
import { EXPO_Url } from '@env';

const generarArrayPreguntas = (numeroPreguntas) => {
    return Array.from({ length: numeroPreguntas }, (_, index) => index);
};

const AgregarPrueba = async (preguntas, alternativas, respuestas, asignatura, curso_id) => {

    if(curso_id === undefined || curso_id === 0){
        Alert.alert('Error', 'Seleccione un curso');
        return;
    }
    if (asignatura.trim() === '') {
        Alert.alert('Error', 'Ingrese la asignatura antes de continuar.');
        return;
    }
    if (asignatura.length > 16) {
        Alert.alert('Error', 'La asignatura no puede tener más de 16 caracteres.');
        return;
    }

    const preguntasArray = generarArrayPreguntas(preguntas);

    try {
        const datosHojadeRespuestas = {
            asignatura,
            preguntas: preguntasArray,
            respuestas,
            curso_id,
            alternativas,
        };

        const response = await fetch(`${EXPO_Url}/asignaturas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosHojadeRespuestas),
        });

        const data = await response.json();

        if (data.status) {
            return data;
        } else {
            Alert.alert('Error', data.error || 'Hubo un problema al crear la prueba.');
            return null;
        }
        

    } catch (error) {
        // Manejar errores de la solicitud
        //console.error('Error al enviar la solicitud:', error.message);
        Alert.alert('Error', 'Hubo un problema al enviar la solicitud.');
    }
};

export default AgregarPrueba;