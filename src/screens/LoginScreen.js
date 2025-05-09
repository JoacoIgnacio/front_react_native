import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/style_home';
import loginUsuario from '../services/users/services_login_usuario';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');

    const handleLogin = async () => {
        const logueado = await loginUsuario(email, contrasena);
        if (logueado) {
            navigation.replace('Inicio');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput style={styles.text} placeholder="Correo electrónico" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.text} placeholder="Contraseña" value={contrasena} onChangeText={setContrasena} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{ color: '#1e90ff', marginTop: 20, textAlign: 'center' }}>
                    ¿No tienes cuenta? Regístrate
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
