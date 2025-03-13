import React, { useState, useEffect } from 'react';
import { Modal, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import styles from '../styles/style_modal_pruebas';
import AgregarPrueba from '../services/pruebas/services_agregar_prueba';
import obtenerCursosPorUser from '../services/cursos/services_cursos_id_user';
import { Picker } from '@react-native-picker/picker';

const ModalHojaDeRespuesta = ({ visible, onClose, preguntas, alternativas, respuestas, onPruebaAdded }) => {
    const user_id = 1;
    const [asignatura, setAsignatura] = useState('');
    const [selectedCurso, setSelectedCurso] = useState();
    const [cursos, setCursos] = useState([]);
    

    const hideConfirmModal = () => {
        onClose();
    };

    useEffect(() => {
        const fetchCursos = async () => {
            const data_cursos = await obtenerCursosPorUser(user_id);
            setCursos(data_cursos);
        };
        fetchCursos();
    }, [user_id]);


    const crearHojaDeRespuesta = async () => {
        if (!selectedCurso || selectedCurso === "0") {
            Alert.alert('Error', 'Por favor, seleccione un curso.');
            return;
        }

        if (!asignatura.trim()) {
            Alert.alert('Error', 'Por favor, ingrese una asignatura.');
            return;
        }

        try {
            const response = await AgregarPrueba(preguntas, alternativas, respuestas, asignatura, selectedCurso);
            if (response !== undefined && response.status === true) {
                onPruebaAdded(response);
                setAsignatura('');
                onClose();
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Hubo un problema al crear la hoja de respuestas.');
        }
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={hideConfirmModal}>
            <View style={styles.modalBackground}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.piker}>
                            <Picker
                                selectedValue={selectedCurso}
                                onValueChange={(itemValue) => setSelectedCurso(itemValue)}>
                                <Picker.Item key="0" label="Seleccione un curso" value="0" />
                                {cursos ? (
                                    cursos.map((curso, index) => (
                                        <Picker.Item key={index} label={curso[1]} value={curso[0]} />
                                    ))
                                ) : (
                                    <Picker.Item label="No hay Cursos" value="0" />
                                )}
                            </Picker>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese la Asignatura"
                            value={asignatura}
                            onChangeText={(text) => setAsignatura(text)}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 300 }}>
                            <TouchableOpacity
                                style={styles.buttonClose}
                                onPress={hideConfirmModal}
                                activeOpacity={0.7}>
                                <Text style={styles.textStyle}>Cancelar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.button}
                                onPress={crearHojaDeRespuesta}
                                activeOpacity={0.7}>
                                <Text style={styles.textStyle}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalHojaDeRespuesta;