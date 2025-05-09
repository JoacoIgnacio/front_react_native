import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/style_home';
import { useNavigation } from '@react-navigation/native';
import registrarUsuario from '../services/users/services_registrar_usuario';

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {
        const registrado = await registrarUsuario(username, email, contrasena);
        if (registrado) {
            Alert.alert('Éxito', 'Usuario registrado correctamente');
            navigation.navigate('Login');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <TextInput style={styles.text} placeholder="Nombre de usuario" value={username} onChangeText={setUsername} />
            <TextInput style={styles.text} placeholder="Correo electrónico" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.text} placeholder="Contraseña" value={contrasena} onChangeText={setContrasena} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RegisterScreen;
