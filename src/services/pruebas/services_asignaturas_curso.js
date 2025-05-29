// services_asignaturas_curso.js
import { EXPO_Url } from '@env';

const obtenerAsignaturasCurso = async (curso_id) => {
    try {
        const response = await fetch(`${EXPO_Url}/asignaturasporcurso/${curso_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log("Asignaturas obtenidas:", data);

        if (data.status) {
            return data.asignaturas; 
        } else {
            console.warn("No hay asignaturas para este curso.");
            return []; // Devuelve un array vacío si no hay asignaturas
        }
    } catch (error) {
        //console.error("Error al obtener las asignaturas:", error.message);
        return [];
    }
};

export default obtenerAsignaturasCurso;
