// src/screens/UserProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { EXPO_Url } from '@env';

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    obtenerDatosUsuario();
  }, []);

  const obtenerDatosUsuario = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.log("Token no encontrado, redirigiendo al login");
        navigation.replace('Login');
        return;
      }

      const response = await fetch(`${EXPO_Url}/auth/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUserInfo(data);
      } else {
        console.error("Error al obtener datos del usuario:", data);
        navigation.replace('Login');
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      navigation.replace('Login');
    }
  };

  const logoutUsuario = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      navigation.replace('Login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Perfil del Usuario</Text>
      <View style={styles.infoContainer}>
        {userInfo ? (
          <>
            <Text style={styles.infoText}>Nombre de usuario: {userInfo.username || "No disponible"}</Text>
            <Text style={styles.infoText}>Correo electrónico: {userInfo.email || "No disponible"}</Text>
          </>
        ) : (
          <Text style={styles.infoText}>Cargando información...</Text>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logoutUsuario}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserProfileScreen;
