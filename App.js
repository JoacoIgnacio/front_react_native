import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import Navbar from './src/components/Navbar';
import QRScannerScreen from './src/screens/LectorQR';
import CameraComponent from './src/components/CameraComponent';
import GeneratePrueba from './src/screens/GeneratePrueba';
import MisHojaDeRespuestas from './src/screens/MisHojaDeRespuestas';
import MisCursos from './src/screens/cursos';
import DetalleCurso from './src/screens/DetalleCurso';
import CrearCursoFormulario from './src/screens/FormCursos';
import GestionImagen from './src/screens/GestionImagen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Stack = createStackNavigator();

const navigationOptions = {
    headerStyle: {
        backgroundColor: '#1e90ff',
    },
    headerTintColor: 'white',
};

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Inicio">
                    <Stack.Screen
                        name="Inicio"
                        component={HomeScreen}
                        options={navigationOptions}
                    />
                    <Stack.Screen
                        name="Escanear Alumno"
                        component={QRScannerScreen}
                        options={navigationOptions}
                    />
                    <Stack.Screen
                        name="Scanner"
                        component={CameraComponent}
                        options={navigationOptions}
                    />
                    <Stack.Screen
                        name="Crear Hoja De Respuesta"
                        component={GeneratePrueba}
                        options={navigationOptions}
                    />
                    <Stack.Screen
                        name="Mis Hoja De Respuestas"
                        component={MisHojaDeRespuestas}
                        options={navigationOptions}
                    />
                    <Stack.Screen
                        name="Mis Cursos"
                        component={MisCursos}
                        options={navigationOptions}
                    />
                    <Stack.Screen
                        name="Detalle Curso"
                        component={DetalleCurso}
                        options={navigationOptions}
                    />
                    <Stack.Screen
                        name="Crear Cursos"
                        component={CrearCursoFormulario}
                        options={navigationOptions}
                    />
                    <Stack.Screen
                        name="Gestion de prueba"
                        component={GestionImagen}
                        options={navigationOptions}
                    />
                </Stack.Navigator>
                <Navbar />
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
