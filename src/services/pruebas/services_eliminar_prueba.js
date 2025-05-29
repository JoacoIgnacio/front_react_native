import { Alert } from 'react-native';
import { EXPO_Url } from '@env';

const eliminarHojasRespuestas = async (pruebaId) => {
    try {
        const response = await fetch(`${EXPO_Url}/pruebas/${pruebaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return pruebaId;
        } else {
            //console.error('Error en la respuesta DELETE:', response.statusText);
            Alert.alert('Error', 'Hubo un problema al eliminar la prueba.');
        }
    } catch (error) {
        //console.error('Error al enviar la solicitud DELETE:', error.message);
        Alert.alert('Error', 'Hubo un problema al eliminar la prueba.');
    }
};

export default eliminarHojasRespuestas;
