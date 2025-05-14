import React, { useState, useEffect } from 'react';
import styles from '../styles/style_cursos';
import CrearCurso from '../components/GenerarCurso';
import obtenerCursosPorUser from '../services/cursos/services_cursos_id_user';
import eliminarCurso from '../services/cursos/services_eliminar_curso';
import Cargando from '../components/Cargando';
import { Text, View, ScrollView, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';

const MisCursos = ({ navigation, route }) => {
	const user_id = 1;
	const [cursos, setCursos] = useState([]);
	const [cursoAEliminar, setCursoAEliminar] = useState(null);
	const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
	const nuevoCurso = route.params?.nuevoCurso;
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchCursos = async () => {
			setIsLoading(true);
			const data_cursos = await obtenerCursosPorUser(user_id);
			setCursos(data_cursos || []);
			setIsLoading(false);
		};
		fetchCursos();
	}, [user_id]);

	const verDetalleCurso = (curso) => {
		navigation.navigate('Detalle Curso', { curso });
	};

	const showConfirmDeleteModal = (curso) => {
		setCursoAEliminar(curso);
		setConfirmDeleteModalVisible(true);
	};

	const hideConfirmDeleteModal = () => {
		setCursoAEliminar(null);
		setConfirmDeleteModalVisible(false);
	};

	const eliminarCursoYAlumnos = async () => { 
		if (!cursoAEliminar) return;

		try {
			setIsLoading(true);
			const response = await eliminarCurso(cursoAEliminar.id);

			if (response) {
				setCursos((prevCursos) =>
					prevCursos.filter((curso) => curso.id !== cursoAEliminar.id)
				);
				Alert.alert("Curso eliminado", `El curso "${cursoAEliminar.curso}" y sus alumnos han sido eliminados.`);
			} else {
				Alert.alert("Error", "No se pudo eliminar el curso.");
			}
		} catch (error) {
			console.error("Error al eliminar el curso:", error);
			Alert.alert("Error", "Hubo un problema al eliminar el curso.");
		} finally {
			hideConfirmDeleteModal();
			setIsLoading(false);
		}
	};

	return (
		<ScrollView style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 20 }}>
			<View style={styles.container}>
				<CrearCurso />
				{cursos.length > 0 ? (
					cursos.map((curso) => (
						<View key={curso.id} style={styles.create}>
							<Text style={styles.text}>{curso.curso}</Text>
							<View style={{ flexDirection: 'row' }}>
								<TouchableOpacity style={styles.editar} onPress={() => verDetalleCurso(curso)}>
									<Text style={styles.colorTextIcon}>Ver Curso</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.eliminar} onPress={() => showConfirmDeleteModal(curso)}>
									<Text style={styles.colorTextIcon}>Eliminar Curso</Text>
								</TouchableOpacity>
							</View>
						</View>
					))
				) : (
					<Text>No hay cursos disponibles.</Text>
				)}

				<Modal visible={confirmDeleteModalVisible} transparent animationType="fade">
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>
								¿Seguro que desea borrar el curso "{cursoAEliminar?.curso}" y todos sus alumnos?
							</Text>
							<Pressable style={[styles.buttonbg, styles.cancelar]} onPress={hideConfirmDeleteModal}>
								<Text style={styles.textStyle}>Cancelar</Text>
							</Pressable>
							<Pressable style={[styles.buttonbg, styles.eliminar]} onPress={eliminarCursoYAlumnos}>
								<Text style={styles.textStyle}>Eliminar</Text>
							</Pressable>
						</View>
					</View>
				</Modal>
			</View>
			{isLoading && <Cargando />}
		</ScrollView>
	);
};

export default MisCursos;
