import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SeleccionarCursoModal = ({ visible, cursos, onSelectCurso, onClose }) => {
    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Seleccionar Curso</Text>
                    
                    {cursos.map((curso, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.cursoButton}
                            onPress={() => onSelectCurso && onSelectCurso(curso)} // Verificamos que onSelectCurso exista
                        >
                            <Text style={styles.cursoText}>{curso[1]}</Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    cursoButton: {
        backgroundColor: '#1e90ff',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginVertical: 5,
    },
    cursoText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    cancelText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SeleccionarCursoModal;
