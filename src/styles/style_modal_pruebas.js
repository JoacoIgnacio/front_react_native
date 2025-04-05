import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Fondo oscuro
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // Asegura que la modal se vea encima de otros elementos
    },
    centeredView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalView: {
        width: '100%',
        alignItems: 'center',
    },
    selectCursoButton: {
        backgroundColor: '#1e90ff',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        width: '100%',
    },
    selectCursoText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        color: 'black',
        marginBottom: 15,
        backgroundColor: 'white',
    },
    buttonClose: {
        backgroundColor: '#dc3545',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
    },
    button: {
        backgroundColor: '#1e90ff',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default styles;
