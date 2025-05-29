// src/services/users/services_user.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPO_Url } from '@env';

// Obtener información del usuario autenticado
export const obtenerDatosUsuario = async (navigation) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      console.log("Token no encontrado, redirigiendo al login");
      navigation.replace('Login');
      return null;
    }

    const response = await fetch(`${EXPO_Url}/auth/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      //console.error("Error al obtener datos del usuario:", data);
      navigation.replace('Login');
      return null;
    }
  } catch (error) {
    //console.error("Error al obtener datos del usuario:", error);
    navigation.replace('Login');
    return null;
  }
};

// Cerrar sesión del usuario
export const logoutUsuario = async (navigation) => {
  try {
    await AsyncStorage.removeItem('accessToken');
    navigation.replace('Login');
  } catch (error) {
    //console.error("Error al cerrar sesión:", error);
  }
};
