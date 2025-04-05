import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import styles from '../styles/style_detalle_curso';
import { AntDesign } from '@expo/vector-icons';
import ModalAlumnos from '../components/ModalAlumnos';
import obtenerAlumnosPorCurso from '../services/alumnos/services_alumnos_curso';
import eliminarAlumno from '../services/alumnos/services_eliminar_alumno';
import editarAlumno from '../services/alumnos/services_editar_alumno';
import Cargando from '../components/Cargando';

const DetalleCurso = ({ route }) => {
    const { curso } = route.params;
    const [alumnos, setAlumnos] = useState([]);
    const [editingAlumnoId, setEditingAlumnoId] = useState(null);
    const [editedAlumnoValues, setEditedAlumnoValues] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onPress = () => {
        setShowModal(true);
    };

    const handleEditChange = (field, value) => {
        setEditedAlumnoValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    useEffect(() => {
        const fetchCursos = async () => {
            const data_cursos = await obtenerAlumnosPorCurso(curso[0]);
            setAlumnos(data_cursos);
        };
        fetchCursos();
    }, [curso]);

    const handleAlumnoAdded = (nuevoAlumno) => {
        setIsLoading(true);
        setAlumnos((prevAlumnos) => [...prevAlumnos, nuevoAlumno]);

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const editar = async (nombre, apellido, alumno) => {
        try {
            setIsLoading(true);
            const nuevoNombre = editedAlumnoValues.nombre?.trim() ?? nombre;
            const nuevoApellido = editedAlumnoValues.apellido?.trim() ?? apellido;
            const alumnoId = await editarAlumno(alumno, nuevoNombre, nuevoApellido);

            if (alumnoId) {
                const nuevosAlumnos = alumnos.map(a => a[0] === alumnoId ? [a[0], nuevoNombre, nuevoApellido] : a);
                setAlumnos(nuevosAlumnos);
                setEditingAlumnoId(null);
                setEditedAlumnoValues({});
            }
        } catch (error) {
            Alert.alert("Error", error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    const eliminar = async (alumno) => {
        try {
            setIsLoading(true);
            const alumnoId = await eliminarAlumno(alumno);
            if (alumnoId) {
                setAlumnos(alumnos.filter(a => a[0] !== alumnoId));
            }
        } catch (error) {
            Alert.alert("Error", error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    const tableHead = ['Nombre', 'Apellido', 'Acciones'];
    const tableData = alumnos.map((alumno) => {
        const isEditing = editingAlumnoId === alumno[0];
        const nombre = isEditing ? editedAlumnoValues.nombre ?? alumno[1] : alumno[1];
        const apellido = isEditing ? editedAlumnoValues.apellido ?? alumno[2] : alumno[2];

        return [
            isEditing ? (
                <TextInput
                    key={`nombre-${alumno[0]}`}
                    placeholder="Nombre"
                    value={nombre}
                    onChangeText={(value) => handleEditChange('nombre', value)}
                    style={styles.tableText}
                />
            ) : (
                <Text key={`nombre-${alumno[0]}`} style={styles.tableText}>{nombre}</Text>
            ),
            isEditing ? (
                <TextInput
                    key={`apellido-${alumno[0]}`}
                    placeholder="Apellido"
                    value={apellido}
                    onChangeText={(value) => handleEditChange('apellido', value)}
                    style={styles.tableText}
                />
            ) : (
                <Text key={`apellido-${alumno[0]}`} style={styles.tableText}>{apellido}</Text>
            ),
            isEditing ? (
                <TouchableOpacity key={`acciones-${alumno[0]}`} onPress={(event) => { event.preventDefault(); editar(nombre, apellido, alumno[0]) }} style={styles.descarga}>
                    <Text style={styles.colorTextIcon}>Guardar Cambios</Text>
                </TouchableOpacity>
            ) : (
                <View key={`acciones-${alumno[0]}`}>
                    <TouchableOpacity onPress={() => setEditingAlumnoId(alumno[0])} style={styles.editar}>
                        <Text style={styles.colorTextIcon}>Editar Alumno</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={(event) => { event.preventDefault(); eliminar(alumno[0]) }} style={styles.eliminar}>
                        <Text style={styles.colorTextIcon}>Eliminar Alumno</Text>
                    </TouchableOpacity>
                </View>
            ),
        ];
    });

    return (
        <><ScrollView style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 20 }}>
            <View style={styles.container_general}>
                <Text style={styles.text}>{curso[1]}</Text>
                <View style={styles.container}>
                    <TouchableOpacity onPress={onPress} style={styles.button}>
                        <AntDesign name="plussquareo" size={24} color="white" />
                        <Text style={styles.buttonText}>Agregar Alumno</Text>
                    </TouchableOpacity>
                    <ModalAlumnos
                        curso={curso}
                        visible={showModal}
                        onClose={() => setShowModal(false)}
                        onAlumnoAdded={handleAlumnoAdded} />
                </View>
            </View>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#ccc' }}>
                <Row data={tableHead} style={styles.head} textStyle={styles.tableText} />
                <Rows data={tableData} textStyle={styles.tableText} />
            </Table>
        </ScrollView>
            {isLoading && (
                <Cargando />
            )}
        </>
    );
};

export default DetalleCurso;
