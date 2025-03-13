import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableOpacity, Pressable, Alert, ScrollView } from 'react-native';
import obtenerAsignaturasCurso from '../services/pruebas/services_asignaturas_curso';
import obtenerCursosPorUser from '../services/cursos/services_cursos_id_user';
import eliminarHojasRespuestas from '../services/pruebas/services_eliminar_prueba';
import generarFormatosAlumnos from  '../services/pruebas/services_generar_formatos';
import obtenerCursosPorIdCurso from '../services/cursos/services_curso_id';
import styles from '../styles/style_asignaturas';
import { Picker } from '@react-native-picker/picker';
import Cargando from '../components/Cargando';

const VerAsignaturas = () => {
    const user_id = 1;
    const [asignaturas, setAsignaturas] = useState([]);
    const [hojaAEliminar, setHojasRespuestasAEliminar] = useState(null);
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
    const [cursos, setCursos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setAsignaturas([])
        const fetchCursos = async () => {
            const data_cursos = await obtenerCursosPorUser(user_id);
            setCursos(data_cursos);
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
            // Obtener cursos relacionados con el ID de la asignatura
            const result_cursos = await obtenerCursosPorIdCurso(asignatura[5]);

            // Si se obtienen los cursos correctamente, generar los formatos
            if (result_cursos) {
                // Suponiendo que generarFormatosCurso es la función para generar los formatos
                await generarFormatosAlumnos(result_cursos.curso['id'], asignatura[0]);
            }
        } catch (error) {
            console.error('Error al generar los formatos:', error.message);
        }
    };

    return (
        <><ScrollView style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 20 }}>
            <View style={styles.container}>
                <View style={styles.piker}>
                    <Picker
                        onValueChange={(itemValue) => {
                            try {
                                setIsLoading(true);
                                const fetchAsignaturas = async () => {
                                    const data_asignaturas = await obtenerAsignaturasCurso(itemValue[0]);
                                    setAsignaturas(data_asignaturas);
                                };
                                fetchAsignaturas();

                            } catch (error) {
                                Alert.alert("Error", error);
                            } finally {
                                setTimeout(() => {
                                    setIsLoading(false);
                                }, 2000);
                            }
                        }}>

                        <Picker.Item key="0" label="Seleccione un curso" value="0" />
                        {cursos ? (
                            cursos.map((curso, index) => (
                                <Picker.Item key={index} label={curso[1]} value={curso} />
                            ))
                        ) : (
                            <Picker.Item label="No hay Cursos" value="0" />
                        )}
                    </Picker>
                </View>
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

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={confirmDeleteModalVisible}
                    onRequestClose={hideConfirmDeleteModal}>
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
                                    onPress={hideConfirmDeleteModal}>
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
                                    }}>
                                    <Text style={styles.textStyle}>Eliminar</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
            {isLoading && (
                <Cargando />
            )}
        </>
    );
};

export default VerAsignaturas;