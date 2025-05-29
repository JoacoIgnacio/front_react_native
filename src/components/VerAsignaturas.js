// IMPORTACIONES
import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableOpacity, Pressable, Alert, ScrollView } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import { useFocusEffect } from '@react-navigation/native';

import obtenerAsignaturasCurso from '../services/pruebas/services_asignaturas_curso';
import obtenerCursosPorUser from '../services/cursos/services_cursos_id_user';
import eliminarHojasRespuestas from '../services/pruebas/services_eliminar_prueba';
import obtenerNotasPorAsignatura from '../services/pruebas/services_pruebas';
import eliminarAsignaturaCompleta from '../services/pruebas/services_eliminar_asignatura_completa';
import { obtenerDatosUsuario } from '../services/users/services_user';

import styles from '../styles/style_asignaturas';
import SeleccionarCursoModal from '../components/SeleccionarCursoModal';
import Cargando from '../components/Cargando';
import { EXPO_Url } from '@env';

const VerAsignaturas = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [hojaAEliminar, setHojasRespuestasAEliminar] = useState(null);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [notasModalVisible, setNotasModalVisible] = useState(false);
  const [notasAlumnos, setNotasAlumnos] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const cargarCursosUsuario = async () => {
        try {
          const usuario = await obtenerDatosUsuario();
          if (!usuario || !usuario.id) {
            throw new Error('Usuario no encontrado');
          }

          const data_cursos = await obtenerCursosPorUser(usuario.id);
          setCursos(data_cursos);
        } catch (error) {
          //console.error("Error al obtener cursos:", error);
          Alert.alert("Error", "Hubo un problema al obtener los cursos.");
        } finally {
          setIsLoading(false);
        }
      };

      cargarCursosUsuario();
    }, [])
  );



  const showConfirmDeleteModal = (asignatura) => {
    setHojasRespuestasAEliminar(asignatura);
    setConfirmDeleteModalVisible(true);
  };

  const hideConfirmDeleteModal = () => {
    setHojasRespuestasAEliminar(null);
    setConfirmDeleteModalVisible(false);
  };

  const descargarYCompartirFormatos = async (asignatura) => {
    try {
      const cursoId = asignatura.curso_id || asignatura[5];
      const asignaturaId = asignatura.id || asignatura[0];

      //console.log("cursoId:", cursoId, "asignaturaId:", asignaturaId);

      if (!cursoId || !asignaturaId) {
        Alert.alert("Error", "No se pudo determinar el curso o la asignatura.");
        return;
      }

      const zipUrl = `${EXPO_Url}/alumnos/${cursoId}/${asignaturaId}/descargarFormatos`;
      const zipFileUri = `${FileSystem.documentDirectory}${cursoId}_${asignaturaId}_formatos.zip`;

      // Verifica si ya existe
      const fileInfo = await FileSystem.getInfoAsync(zipFileUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(zipFileUri, { idempotent: true });
      }

      const downloadResumable = FileSystem.createDownloadResumable(zipUrl, zipFileUri);
      const { uri } = await downloadResumable.downloadAsync();

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Descargado", "El archivo fue descargado, pero no se puede compartir automáticamente.");
      }
    } catch (error) {
      //console.error("Error al descargar o compartir formatos:", error);
      Alert.alert("Error", "Hubo un problema al intentar descargar los formatos.");
    }
  };
  const descargarFormatoGeneral = async (asignatura) => {
    try {
      const cursoId = asignatura.curso_id || asignatura[5];
      const asignaturaId = asignatura.id || asignatura[0];

      if (!cursoId || !asignaturaId) {
        Alert.alert("Error", "No se pudo determinar el curso o la asignatura.");
        return;
      }

      const imageUrl = `${EXPO_Url}/formato_general/${cursoId}/${asignaturaId}`;
      const fileUri = `${FileSystem.documentDirectory}formato_general_${cursoId}_${asignaturaId}.png`;

      // Elimina si ya existe
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
      }

      const downloadResumable = FileSystem.createDownloadResumable(imageUrl, fileUri);
      const { uri } = await downloadResumable.downloadAsync();

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Descargado", "La imagen fue descargada, pero no se puede compartir automáticamente.");
      }
    } catch (error) {
      //console.error("Error al descargar formato general:", error);
      Alert.alert("Error", "Hubo un problema al descargar el formato general.");
    }
  };

  const verNotas = async (asignatura_id) => {
    setIsLoading(true);
    try {
      const notas = await obtenerNotasPorAsignatura(asignatura_id);
      setNotasAlumnos(notas);
      setNotasModalVisible(true);
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudieron obtener las notas.");
    } finally {
      setIsLoading(false);
    }
  };

  const numeroALetra = (num) => {
    const letras = ['a', 'b', 'c', 'd', 'e'];
    return letras[num] || '-';
  };

  const verMasDetalle = (nota) => {
    const respuestasArray = Array.isArray(nota.respuestas) ? nota.respuestas : [];
    const respuestasLetras = respuestasArray.map(num => numeroALetra(num)).join(', ');

    Alert.alert(
      "Detalle del alumno",
      `${nota.nombre}\n\nCorrectas: ${nota.correctas}/${nota.total_preguntas}\n\nRespuestas:\n${respuestasLetras}`
    );
  };


  const eliminarNota = async (nota) => {
    Alert.alert(
      'Eliminar Nota',
      `¿Seguro que quieres eliminar la nota de "${nota.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const resultado = await eliminarHojasRespuestas(nota.id);
              if (resultado) {
                setNotasAlumnos(prevNotas => prevNotas.filter(n => n.id !== nota.id));
                Alert.alert('Éxito', 'Nota eliminada correctamente.');
              }
            } catch (error) {
              //console.error('Error al eliminar la nota:', error.message);
              Alert.alert('Error', 'No se pudo eliminar la nota.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const eliminarAsignaturaSeleccionada = async () => {
    hideConfirmDeleteModal();
    if (hojaAEliminar) {
      const response = await eliminarAsignaturaCompleta(hojaAEliminar.id);
      if (response) {
        setAsignaturas(prev => prev.filter(a => a.id !== hojaAEliminar.id));
      }
    }
  };

  // Función actualizada en VerAsignaturas:
  
  const handleCursoSeleccionado = (curso) => {
      //console.log("Curso seleccionado:", curso); // Verificar que el curso llega correctamente
      if (!curso || !curso.id) {
          Alert.alert("Error", "Curso no válido. Inténtalo de nuevo.");
          return;
      }

      setSelectedCurso(curso);
      setModalVisible(false);
      setIsLoading(true);

      const fetchAsignaturas = async () => {
          try {
              const data_asignaturas = await obtenerAsignaturasCurso(curso.id); // Asegúrate de que sea curso.id
              //console.log("Asignaturas obtenidas:", data_asignaturas);
              setAsignaturas(data_asignaturas || []);
          } catch (error) {
              //console.error("Error al obtener las asignaturas:", error);
              Alert.alert("Error", "Hubo un problema al obtener las asignaturas.");
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
          <TouchableOpacity
            style={styles.selectCursoButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.selectCursoText}>
                {selectedCurso ? `Curso: ${selectedCurso.curso}` : "Seleccionar Curso"}
            </Text>
          </TouchableOpacity>

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
                  <Text style={styles.text}>{asignatura.asignatura}</Text>
                  <View>
                    <TouchableOpacity style={styles.descarga} onPress={() => descargarYCompartirFormatos(asignatura)}>
                      <Text style={styles.colorTextIcon}>Descargar Formatos Alumnos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.descarga} onPress={() => verNotas(asignatura.id)}>
                      <Text style={styles.colorTextIcon}>Ver Notas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.eliminar} onPress={() => showConfirmDeleteModal(asignatura)}>
                      <Text style={styles.colorTextIcon}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text>No hay hojas de respuestas.</Text>
          )}

          {/* Modal eliminar asignatura */}
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
                    ¿Seguro que desea borrar la asignatura "{hojaAEliminar[1]}"?
                  </Text>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                  <Pressable style={[styles.buttonbg]} onPress={hideConfirmDeleteModal}>
                    <Text style={styles.textStyle}>Cancelar</Text>
                  </Pressable>
                  <Pressable style={[styles.buttonbg, styles.eliminar]} onPress={eliminarAsignaturaSeleccionada}>
                    <Text style={styles.textStyle}>Eliminar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          {/* Modal notas alumnos */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={notasModalVisible}
            onRequestClose={() => setNotasModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Notas de la Asignatura</Text>
                <ScrollView style={{ width: '100%' }}>
                  {notasAlumnos.map((nota, idx) => (
                    <View key={idx} style={styles.rowNota}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                          <Text style={styles.nombreAlumno}>{nota.nombre}</Text>
                          <Text style={styles.puntaje}>
                            {nota.correctas}/{nota.total_preguntas} correctas
                          </Text>
                        </View>
                        <View style={styles.iconosContainer}>
                          <TouchableOpacity onPress={() => verMasDetalle(nota)}>
                            <FontAwesome name="eye" size={22} color="#3498db" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => eliminarNota(nota)} style={{ marginLeft: 15 }}>
                            <FontAwesome name="trash" size={22} color="#e74c3c" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={[styles.buttonbg, styles.cerrar]}
                  onPress={() => setNotasModalVisible(false)}
                >
                  <Text style={styles.textStyle}>Cerrar</Text>
                </TouchableOpacity>
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
