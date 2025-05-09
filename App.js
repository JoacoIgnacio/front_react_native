import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();

import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';

// Pantallas
import HomeScreen from './src/screens/HomeScreen';
import QRScannerScreen from './src/screens/LectorQR';
import CameraComponent from './src/components/CameraComponent';
import GeneratePrueba from './src/screens/GeneratePrueba';
import MisHojaDeRespuestas from './src/screens/MisHojaDeRespuestas';
import MisCursos from './src/screens/cursos';
import DetalleCurso from './src/screens/DetalleCurso';
import CrearCursoFormulario from './src/screens/FormCursos';
import GestionImagen from './src/screens/GestionImagen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SplashScreen from './src/screens/SplashScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';

import Navbar from './src/components/Navbar';

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
      <MainApp />
    </GestureHandlerRootView>
  );
}

const MainApp = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const navigationRef = useRef(null);
  const routeNameRef = useRef();

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          if (navigationRef.current) {
            const initialRoute = navigationRef.current.getCurrentRoute()?.name;
            routeNameRef.current = initialRoute;
            setShowNavbar(!['Login', 'Register', 'Splash'].includes(initialRoute));
          }
        }}
        onStateChange={() => {
          const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
          setShowNavbar(!['Login', 'Register', 'Splash'].includes(currentRouteName));
        }}
      >
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registrarse', ...navigationOptions }} />
          <Stack.Screen name="Inicio" component={HomeScreen} options={navigationOptions} />
          <Stack.Screen name="Escanear Alumno" component={QRScannerScreen} options={navigationOptions} />
          <Stack.Screen name="Scanner" component={CameraComponent} options={navigationOptions} />
          <Stack.Screen name="Crear Hoja De Respuesta" component={GeneratePrueba} options={navigationOptions} />
          <Stack.Screen name="Mis Hoja De Respuestas" component={MisHojaDeRespuestas} options={navigationOptions} />
          <Stack.Screen name="Mis Cursos" component={MisCursos} options={navigationOptions} />
          <Stack.Screen name="Detalle Curso" component={DetalleCurso} options={navigationOptions} />
          <Stack.Screen name="Crear Cursos" component={CrearCursoFormulario} options={navigationOptions} />
          <Stack.Screen name="Gestion de prueba" component={GestionImagen} options={navigationOptions} />
          <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} options={{ title: 'Perfil del Usuario' }} />
        </Stack.Navigator>
        {showNavbar && <Navbar />}
      </NavigationContainer>
    </View>
  );
};
