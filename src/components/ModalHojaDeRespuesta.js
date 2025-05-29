import React, { useState, useEffect } from 'react';
import { Modal, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import styles from '../styles/style_modal_pruebas';
import AgregarPrueba from '../services/pruebas/services_agregar_prueba';
import obtenerCursosPorUser from '../services/cursos/services_cursos_id_user';
import SeleccionarCursoModal from './SeleccionarCursoModal';
import { obtenerDatosUsuario } from '../services/users/services_user';

const ModalHojaDeRespuesta = ({ visible, onClose, preguntas, alternativas, respuestas, onPruebaAdded }) => {
    
    const [asignatura, setAsignatura] = useState('');
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [cursos, setCursos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                //console.log("Obteniendo cursos del usuario autenticado...");
                const usuario = await obtenerDatosUsuario();
                if (!usuario || !usuario.id) {
                    throw new Error("Usuario no encontrado");
                }

                const data_cursos = await obtenerCursosPorUser(usuario.id);
                setCursos(data_cursos);
                //console.log("Cursos obtenidos:", data_cursos);
            } catch (error) {
                //console.error("Error al obtener cursos:", error);
                Alert.alert("Error", "Hubo un problema al obtener los cursos.");
            }
        };
        fetchCursos();
    }, []);


    const handleCursoSeleccionado = (curso) => {
        //console.log("Curso seleccionado:", curso);
        setSelectedCurso(curso);
        setModalVisible(false);
    };

    const crearHojaDeRespuesta = async () => {
        if (!selectedCurso || !selectedCurso.id) {
            Alert.alert('Error', 'Por favor, seleccione un curso.');
            return;
        }

        if (!asignatura.trim()) {
            Alert.alert('Error', 'Por favor, ingrese una asignatura.');
            return;
        }

        if (asignatura.length > 16) {
            Alert.alert('Error', 'La asignatura no puede tener más de 16 caracteres.');
            return;
        }

        try {
            const response = await AgregarPrueba(
                preguntas,
                alternativas,
                respuestas,
                asignatura,
                selectedCurso.id // Aquí se usa directamente el ID del curso seleccionado
            );

            if (response?.status) {
                onPruebaAdded(response);
                setAsignatura('');
                setSelectedCurso(null);
                onClose();
                Alert.alert('Éxito', 'Hoja de respuesta creada correctamente.');
            } else {
                Alert.alert('Error', response?.mensaje || 'Hubo un problema al crear la hoja de respuestas.');
            }
        } catch (error) {
            //console.error("Error al crear la hoja de respuesta:", error);
            Alert.alert('Error', 'Hubo un problema al crear la hoja de respuestas.');
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        {/* Botón para seleccionar curso */}
                        <TouchableOpacity
                            style={styles.selectCursoButton}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styles.selectCursoText}>
                                {selectedCurso ? `Curso: ${selectedCurso.curso}` : "Seleccionar Curso"}
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
                            placeholderTextColor="#555"
                            value={asignatura}
                            onChangeText={setAsignatura}
                        />

                        {/* Botones */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 300 }}>
                            <TouchableOpacity
                                style={styles.buttonClose}
                                onPress={onClose}
                            >
                                <Text style={styles.textStyle}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={crearHojaDeRespuesta}
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
