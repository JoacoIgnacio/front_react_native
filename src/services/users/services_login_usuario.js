import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPO_Url } from '@env';

const loginUsuario = async (email, contrasena) => {
    if (!email || !contrasena) {
        Alert.alert('Error', 'Todos los campos son obligatorios');
        return false;
    }

    try {
        const response = await fetch(`${EXPO_Url}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, contrasena }),
        });

        const raw = await response.text();
        let data;

        try {
            data = JSON.parse(raw);
        } catch (e) {
            console.error("Respuesta inesperada:", raw);
            Alert.alert('Error', 'El servidor devolvió una respuesta no válida.');
            return false;
        }

        if (response.ok) {
            await AsyncStorage.setItem('accessToken', data.token);
            return true;
        } else {
            Alert.alert('Error', data.error || 'Login fallido');
            return false;
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        Alert.alert('Error', 'No se pudo conectar con el servidor');
        return false;
    }
};

export default loginUsuario;
