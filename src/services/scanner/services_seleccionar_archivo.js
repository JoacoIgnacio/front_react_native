import { Alert } from 'react-native';
import { EXPO_Url } from '@env';

const handlePostRequest = async ({ id, alumno, alternativas, ANSWER_KEY, imageUri, total_columnas }) => {
    const formData = new FormData();

    formData.append('image', {
        uri: imageUri,
        name: 'image.png',
        type: 'image/png'
    });

    formData.append('total_columnas', String(total_columnas));
    formData.append('alternativas', String(alternativas));
    formData.append('ANSWER_KEY', JSON.stringify(ANSWER_KEY));
    formData.append('alumno', JSON.stringify(alumno));
    formData.append('id', String(id));

    try {
        const response = await fetch(`${EXPO_Url}/scanner`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData
        });

        const data = await response.json();
        if (data.status) {
            return data;
        } else {
            Alert.alert('Error', data.mensaje || 'Hubo un problema al procesar la imagen');
            return null;
        }
    } catch (error) {
        console.error('Error al realizar POST:', error);
        Alert.alert('Error de red', error.message);
        return null;
    }
};

export default handlePostRequest;
