import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
    },
    modalView: {
        margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,// Add black border
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
    },
    button: {
        width: 100,
        backgroundColor: '#0780F8',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonClose: {
        width: 100,
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 10,
        textAlign: 's',
    },
    input: {
        width: 300,
        height: 45,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderColor: '#B4B4B4', // Color del borde
        borderWidth: 1,        // Ancho del borde
        borderRadius: 5,
        fontSize: 16,
        marginBottom: 20
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default styles;