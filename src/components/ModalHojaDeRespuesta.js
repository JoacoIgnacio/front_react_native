import React, { useState, useEffect } from 'react';
import { Modal, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import styles from '../styles/style_modal_pruebas';
import AgregarPrueba from '../services/pruebas/services_agregar_prueba';
import obtenerCursosPorUser from '../services/cursos/services_cursos_id_user';
import SeleccionarCursoModal from './SeleccionarCursoModal';

const ModalHojaDeRespuesta = ({ visible, onClose, preguntas, alternativas, respuestas, onPruebaAdded }) => {
    const user_id = 1;
    const [asignatura, setAsignatura] = useState('');
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [cursos, setCursos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                console.log("Obteniendo cursos...");
                const data_cursos = await obtenerCursosPorUser(user_id);
                setCursos(data_cursos);
                console.log("Cursos obtenidos:", data_cursos);
            } catch (error) {
                console.error("Error al obtener cursos:", error);
            }
        };
        fetchCursos();
    }, [user_id]);

    const handleCursoSeleccionado = (curso) => {
        console.log("Curso seleccionado:", curso);
        setSelectedCurso(curso);
        setModalVisible(false);
    };

    const crearHojaDeRespuesta = async () => {
        if (!selectedCurso) {
            Alert.alert('Error', 'Por favor, seleccione un curso.');
            return;
        }

        if (!asignatura.trim()) {
            Alert.alert('Error', 'Por favor, ingrese una asignatura.');
            return;
        }

        try {
            const response = await AgregarPrueba(preguntas, alternativas, respuestas, asignatura, selectedCurso[0]); // Enviamos solo el ID del curso
            if (response !== undefined && response.status === true) {
                onPruebaAdded(response);
                setAsignatura('');
                onClose();
            } else {
                Alert.alert('Error', response?.mensaje || 'Hubo un problema al crear la hoja de respuestas.');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Hubo un problema al crear la hoja de respuestas.');
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}  // Asegurar que el valor `visible` está bien manejado
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        {/* Botón VISUAL para seleccionar curso */}
                        <TouchableOpacity
                            style={styles.selectCursoButton} // Se asegura que el botón tenga un fondo visible
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styles.selectCursoText}>
                                {selectedCurso ? `Curso: ${selectedCurso[1]}` : "Seleccionar Curso"}
                            </Text>
                        </TouchableOpacity>

                        {/* Modal para seleccionar curso */}
                        <SeleccionarCursoModal
                            visible={modalVisible}
                            cursos={cursos}
                            onSelectCurso={handleCursoSeleccionado}
                            onClose={() => setModalVisible(false)}
                        />

                        {/* Campo de texto para la asignatura */}
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese la Asignatura"
                            placeholderTextColor="#555"  // Se cambia el color para asegurar visibilidad
                            value={asignatura}
                            onChangeText={setAsignatura}
                        />

                        {/* Botones */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 300 }}>
                            <TouchableOpacity
                                style={styles.buttonClose}
                                onPress={onClose}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.textStyle}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={crearHojaDeRespuesta}
                                activeOpacity={0.7}
                            >
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
