import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableOpacity, Pressable, Alert, ScrollView } from 'react-native';
import obtenerAsignaturasCurso from '../services/pruebas/services_asignaturas_curso';
import obtenerCursosPorUser from '../services/cursos/services_cursos_id_user';
import eliminarHojasRespuestas from '../services/pruebas/services_eliminar_prueba';
import generarFormatosAlumnos from '../services/pruebas/services_generar_formatos';
import obtenerCursosPorIdCurso from '../services/cursos/services_curso_id';
import styles from '../styles/style_asignaturas';
import SeleccionarCursoModal from '../components/SeleccionarCursoModal';
import Cargando from '../components/Cargando';

const VerAsignaturas = () => {
    const user_id = 1;
    const [asignaturas, setAsignaturas] = useState([]);
    const [hojaAEliminar, setHojasRespuestasAEliminar] = useState(null);
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setAsignaturas([]);
        const fetchCursos = async () => {
            try {
                const data_cursos = await obtenerCursosPorUser(user_id);
                setCursos(data_cursos);
            } catch (error) {
                console.error("Error al obtener los cursos:", error);
            }
        };
        fetchCursos();
    }, [user_id]);

    const showConfirmDeleteModal = (curso) => {
        setHojasRespuestasAEliminar(curso);
        setConfirmDeleteModalVisible(true);
    };

    const hideConfirmDeleteModal = () => {
        setHojasRespuestasAEliminar(null);
        setConfirmDeleteModalVisible(false);
    };

    const generarFormatos = async (asignatura) => {
        try {
            const result_cursos = await obtenerCursosPorIdCurso(asignatura[5]);
            if (result_cursos) {
                await generarFormatosAlumnos(result_cursos.curso['id'], asignatura[0]);
            }
        } catch (error) {
            console.error('Error al generar los formatos:', error.message);
        }
    };

    const handleCursoSeleccionado = (curso) => {
        setSelectedCurso(curso);
        setModalVisible(false);
        setIsLoading(true);

        // Obtener asignaturas del curso seleccionado
        const fetchAsignaturas = async () => {
            try {
                const data_asignaturas = await obtenerAsignaturasCurso(curso[0]);
                setAsignaturas(data_asignaturas);
            } catch (error) {
                Alert.alert("Error", error.message || "No se pudo obtener las asignaturas.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAsignaturas();
    };

    return (
        <>
            <ScrollView style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 20 }}>
                <View style={styles.container}>

                    {/* Botón para seleccionar curso con estilo mejorado */}
                    <TouchableOpacity
                        style={styles.selectCursoButton}
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

                    {asignaturas.length > 0 ? (
                        asignaturas.map((asignatura, index) => (
                            <View key={index} style={styles.create}>
                                <View style={styles.rowContainer}>
                                    <Text style={styles.text}>{asignatura[1]}</Text>
                                    <View>
                                        <TouchableOpacity style={styles.descarga} onPress={() => generarFormatos(asignatura)}>
                                            <Text style={styles.colorTextIcon}>Generar Formatos</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text>No hay hojas de respuestas.</Text>
                    )}

                    {/* Modal de Confirmación para Eliminar */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={confirmDeleteModalVisible}
                        onRequestClose={hideConfirmDeleteModal}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                {hojaAEliminar && (
                                    <Text style={styles.modalText}>
                                        ¿Seguro que desea borrar la asignatura de respuesta "{hojaAEliminar[1]}"?
                                    </Text>
                                )}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                                    <Pressable
                                        style={[styles.buttonbg]}
                                        onPress={hideConfirmDeleteModal}
                                    >
                                        <Text style={styles.textStyle}>Cancelar</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.buttonbg, styles.eliminar]}
                                        onPress={async () => {
                                            hideConfirmDeleteModal();
                                            const response = await eliminarHojasRespuestas(hojaAEliminar[0]);
                                            if (response) {
                                                setAsignaturas((prevHojas) => prevHojas.filter((asignatura) => asignatura[0] !== hojaAEliminar[0]));
                                            }
                                        }}
                                    >
                                        <Text style={styles.textStyle}>Eliminar</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
            {isLoading && <Cargando />}
        </>
    );
};

export default VerAsignaturas;
