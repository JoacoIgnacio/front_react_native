import React, { useState } from 'react';
import { Modal, Text, Pressable, View, TextInput, Alert} from 'react-native';
import styles from '../styles/style_modal_alumnos';
import AgregarAlumno from '../services/alumnos/services_agregar_alumnos';

const ModalAlumnos = ({ visible, onClose, curso, onAlumnoAdded }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');

    const hideConfirmModal = () => {
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
        try {
            const response = await AgregarAlumno(nombre, apellido, curso[0]);
            if (response.status === true) {
                const nuevoAlumno = [
                    response.alumno.id,
                    response.alumno.nombre,
                    response.alumno.apellido,
                    response.alumno.curso_id
                ];

                onAlumnoAdded(nuevoAlumno);
                setNombre('');
                setApellido('');
                onClose();
            }
        } catch (error) {
            console.error("Error al crear el alumno:", error);
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
                                onPress={crearAlumno}>
                                <Text style={styles.textStyle}>Guardar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>

    );
};

export default ModalAlumnos;