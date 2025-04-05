import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
	},
	create: {
		width: '100%',
		padding: 10,
		marginTop: 20,
		marginBottom: 20,
		borderRadius: 5,
		borderWidth: 2,
		borderColor: '#1e90ff'
	},
	text: {
		color: '#343a40',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20
	},
	editar: {
		backgroundColor: '#ffc107',
		padding: 10,
		borderRadius: 5,
		marginBottom: 5
	},
	descarga: {
		backgroundColor: '#28a745',
		padding: 10,
		borderRadius: 5,
		marginBottom: 5
	},
	eliminar: {
		backgroundColor: '#dc3545',
		padding: 10,
		borderRadius: 5,
		marginBottom: 5
	},
	rowContainer: {
		margin: 10,
	},
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
	buttonbg: {
		width: 100,
		backgroundColor: '#1e90ff',
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
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	piker: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1e90ff',
        marginBottom: 20
    },
	colorTextIcon:{
        fontWeight: 'bold',
        textAlign:'center',
        color: 'white'
    },
	selectCursoButton: {
		backgroundColor: '#1e90ff', // Azul similar a "Nueva Hoja De Respuesta"
		padding: 15,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 10, // Espaciado
	},
	selectCursoText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	
});

export default styles;