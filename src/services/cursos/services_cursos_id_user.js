// services_cursos_id_user.js
import { EXPO_Url } from '@env';
import { Alert } from 'react-native';

const obtenerCursosPorUser = async (user_id) => {
    try {
        const response = await fetch(`${EXPO_Url}/cursos/user_id/${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            Alert.alert('Error', `Error al obtener cursos: ${errorText}`);
            return [];
        }

        const data = await response.json();
        return data.cursos || [];
    } catch (error) {
        //console.error("Error al obtener cursos:", error);
        Alert.alert('Error', `Error de red: ${error.message}`);
        return [];
    }
};

export default obtenerCursosPorUser;
