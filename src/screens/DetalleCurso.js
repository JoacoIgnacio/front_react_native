import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, Modal, TextInput, Pressable } from 'react-native';
import obtenerAlumnosPorCurso from '../services/alumnos/services_alumnos_curso';
import AgregarAlumno from '../services/alumnos/services_agregar_alumnos';
import editarAlumno from '../services/alumnos/services_editar_alumno';
import eliminarAlumno from '../services/alumnos/services_eliminar_alumno';
import Cargando from '../components/Cargando';

const DetalleCurso = ({ route }) => {
    const { curso } = route.params;
    const [alumnos, setAlumnos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

    useEffect(() => {
        fetchAlumnos();
    }, [curso]);

    const fetchAlumnos = async () => {
        setIsLoading(true);
        const data_alumnos = await obtenerAlumnosPorCurso(curso.id);
        setAlumnos(data_alumnos);
        setIsLoading(false);
    };

    const agregarAlumno = async () => {
        if (!nombre.trim() || !apellido.trim()) {
            Alert.alert('Error', 'El nombre y apellido son obligatorios.');
            return;
        }

        try {
            const response = await AgregarAlumno(nombre, apellido, curso.id);
            if (response) {
                Alert.alert('Correcto', 'Alumno agregado exitosamente.');
                setAlumnos(prevAlumnos => [...prevAlumnos, { nombre, apellido }]);
                setNombre('');
                setApellido('');
                setModalVisible(false);
            } else {
                Alert.alert('Error', 'No se pudo agregar el alumno.');
            }
        } catch (error) {
            Alert.alert('Error', `Hubo un problema al guardar el alumno: ${error.message}`);
        }
    };


    // Esta función debe ser la misma que utilizas en useEffect para cargar los alumnos
    const cargarAlumnosCurso = async () => {
        setIsLoading(true);
        try {
            const alumnosData = await obtenerAlumnosCurso(curso.id);
            //console.log("Alumnos cargados:", alumnosData);
            setAlumnos(alumnosData);
        } catch (error) {
            //console.error("Error al cargar los alumnos:", error);
            Alert.alert("Error", "Hubo un problema al cargar los alumnos.");
        } finally {
            setIsLoading(false);
        }
    };

    const mostrarModalEditar = (alumno) => {
        setAlumnoSeleccionado(alumno);
        setNombre(alumno.nombre);
        setApellido(alumno.apellido);
        setModalVisible(true);
    };

    const actualizarAlumno = async () => {
        if (!nombre.trim() || !apellido.trim()) {
            Alert.alert('Error', 'Nombre y Apellido son requeridos.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await editarAlumno(alumnoSeleccionado.id, nombre, apellido, curso.id);
            if (response) {
                setAlumnos(alumnos.map(alumno =>
                    alumno.id === alumnoSeleccionado.id ? { ...alumno, nombre, apellido } : alumno
                ));
                setModalVisible(false);
                setAlumnoSeleccionado(null);
                setNombre('');
                setApellido('');
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al editar el alumno.');
        } finally {
            setIsLoading(false);
        }
    };

    const eliminarAlumnoPorId = async (alumnoId) => {
        Alert.alert(
            "Eliminar Alumno",
            "¿Estás seguro de que deseas eliminar este alumno?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            const response = await eliminarAlumno(alumnoId);
                            if (response) {
                                setAlumnos(alumnos.filter(alumno => alumno.id !== alumnoId));
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Hubo un problema al eliminar el alumno.');
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={styles.title}>Detalle Curso</Text>
            <TouchableOpacity style={styles.agregarButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.agregarButtonText}>+ Agregar Alumno</Text>
            </TouchableOpacity>

            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderText}>Nombre</Text>
                    <Text style={styles.tableHeaderText}>Apellido</Text>
                    <Text style={styles.tableHeaderText}>Acciones</Text>
                </View>
                {alumnos.length > 0 ? (
                    alumnos.map((alumno, index) => (
                        <View key={alumno.id ? alumno.id : `alumno-${index}`} style={styles.tableRow}>
                            <Text>{alumno.nombre}</Text>
                            <Text>{alumno.apellido}</Text>
                            <View style={styles.actions}>
                                <TouchableOpacity style={styles.editar} onPress={() => mostrarModalEditar(alumno)}>
                                    <Text style={styles.actionText}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.eliminar} onPress={() => eliminarAlumnoPorId(alumno.id)}>
                                    <Text style={styles.actionText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>No hay alumnos en este curso.</Text>
                )}

            </View>

            {/* Modal para Agregar/Editar Alumno */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {alumnoSeleccionado ? "Editar Alumno" : "Agregar Alumno"}
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            value={nombre}
                            onChangeText={setNombre}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Apellido"
                            value={apellido}
                            onChangeText={setApellido}
                        />
                        <Pressable
                            style={styles.guardarButton}
                            onPress={alumnoSeleccionado ? actualizarAlumno : agregarAlumno}
                        >
                            <Text style={styles.buttonText}>
                                {alumnoSeleccionado ? "Guardar Cambios" : "Guardar"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {isLoading && <Cargando />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
    agregarButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, marginBottom: 15 },
    agregarButtonText: { color: '#FFFFFF', textAlign: 'center' },
    table: { marginTop: 15 },
    tableHeader: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#007BFF' },
    tableHeaderText: { fontWeight: 'bold', color: '#FFFFFF', padding: 5 },
    tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
    actions: { flexDirection: 'row', gap: 10 },
    editar: { backgroundColor: '#FFC107', padding: 5, borderRadius: 5 },
    eliminar: { backgroundColor: '#DC3545', padding: 5, borderRadius: 5 },
    actionText: { color: '#FFFFFF' },
    modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 10, width: 300 },
    input: { borderBottomWidth: 1, marginBottom: 15 },
    guardarButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5 },
    buttonText: { color: '#FFFFFF', textAlign: 'center' },
});

export default DetalleCurso;
