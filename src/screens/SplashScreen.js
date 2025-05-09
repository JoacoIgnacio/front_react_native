// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const checkLogin = async () => {
            const token = await AsyncStorage.getItem('accessToken'); // Cambiado a accessToken
            if (token) {
                navigation.replace('Inicio');
            } else {
                navigation.replace('Login');
            }
        };
        checkLogin();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#1e90ff" />
        </View>
    );
};

export default SplashScreen;
