import React, { useState } from 'react';
import { Modal, Text, Pressable, View, TextInput, Alert, ActivityIndicator } from 'react-native';
import styles from '../styles/style_modal_alumnos';
import AgregarAlumno from '../services/alumnos/services_agregar_alumnos';

const ModalAlumnos = ({ visible, onClose, curso, onAlumnoAdded }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const hideConfirmModal = () => {
        setNombre('');
        setApellido('');
        onClose();
    };

    const crearAlumno = async (event) => {
        event.preventDefault();

        if (!nombre.trim()) {
            Alert.alert('Error', 'Por favor, ingrese el nombre.');
            return;
        }

        if (!apellido.trim()) {
            Alert.alert('Error', 'Por favor, ingrese el apellido.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await AgregarAlumno(nombre, apellido, curso.id); // Usando curso.id para mayor claridad

            if (response && response.status === true) {
                const nuevoAlumno = {
                    id: response.alumno.id,
                    nombre: response.alumno.nombre,
                    apellido: response.alumno.apellido,
                    curso_id: response.alumno.curso_id
                };

                onAlumnoAdded(nuevoAlumno);
                hideConfirmModal();
            } else {
                Alert.alert('Error', response?.error || 'Hubo un problema al crear el alumno.');
            }
        } catch (error) {
            //console.error("Error al crear el alumno:", error);
            Alert.alert('Error', 'Hubo un problema al crear el alumno.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={hideConfirmModal}>
            <View style={styles.modalBackground}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.title}>Agregar Alumno</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese el Nombre del alumno"
                            value={nombre}
                            onChangeText={(text) => setNombre(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese el Apellido del alumno"
                            value={apellido}
                            onChangeText={(text) => setApellido(text)}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 300 }}>
                            <Pressable
                                style={[styles.buttonClose]}
                                onPress={hideConfirmModal}>
                                <Text style={styles.textStyle}>Cancelar</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button]}
                                onPress={crearAlumno}
                                disabled={isLoading}>
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.textStyle}>Guardar</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalAlumnos;
