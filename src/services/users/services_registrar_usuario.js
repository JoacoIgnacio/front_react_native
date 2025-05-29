import { Alert } from 'react-native';
import { EXPO_Url } from '@env';

const registrarUsuario = async (username, email, contrasena) => {
    if (!username || !email || !contrasena) {
        Alert.alert('Error', 'Completa todos los campos');
        return false;
    }

    try {
        const response = await fetch(`${EXPO_Url}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                email,
                contrasena,
                activo: true
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return true;
        } else {
            Alert.alert('Error', data.error || 'No se pudo registrar');
            return false;
        }
    } catch (error) {
        //console.error('Error al registrar usuario:', error.message);
        Alert.alert('Error', 'No se pudo conectar con el servidor');
        return false;
    }
};

export default registrarUsuario;
