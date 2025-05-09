import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const Navbar = () => {
  const navigation = useNavigation();

  const onPressMisPruebas = () => {
    navigation.navigate('Mis Hoja De Respuestas');
  };

  const onPressInicio = () => {
    navigation.navigate('Inicio');
  };

  const onPressCursos = () => {
    navigation.navigate('Mis Cursos');
  };

  const onPressUser = () => {
    navigation.navigate('UserProfileScreen');
  };

  return (
    <View style={styles.navbar}>
      <Icon onPress={onPressInicio} style={styles.icons} name="home" size={50} color="#FFFFFF" />
      <Icon onPress={onPressCursos} style={styles.icons} name="book" size={46} color="#FFFFFF" />
      <Icon onPress={onPressMisPruebas} style={styles.icons} name="file" size={40} color="#FFFFFF" />    
      <Icon onPress={onPressUser} style={styles.icons} name="user-circle" size={40} color="#FFFFFF" />    
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 80,
    backgroundColor: '#1e90ff',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 50
  },
  icons: {
    marginTop: 16
  }
});

export default Navbar;
