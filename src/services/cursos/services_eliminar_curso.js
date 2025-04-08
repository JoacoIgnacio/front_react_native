import { Alert } from 'react-native';
import eliminarCurso from '../cursos/services_eliminar_curso';
import { EXPO_Url } from '@env';

const eliminarAlumnosAsignaturasYCurso = async (curso_id) => {
    try {
        // 1. Eliminar alumnos
        await fetch(`${EXPO_Url}/eliminaralumnosporcurso/${curso_id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        // 2. Obtener asignaturas del curso
        const responseAsignaturas = await fetch(`${EXPO_Url}/asignaturasporcurso/${curso_id}`);
        const data = await responseAsignaturas.json();

        if (data.status && Array.isArray(data.asignaturas) && data.asignaturas.length > 0) {
            for (let asignatura of data.asignaturas) {
                await fetch(`${EXPO_Url}/asignaturas/${asignatura[0]}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }

        // 3. Eliminar curso
        const eliminarCursoResponse = await fetch(`${EXPO_Url}/cursos/${curso_id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!eliminarCursoResponse.ok) throw new Error('Error al eliminar el curso');
        return true;

    } catch (error) {
        console.error('Error al eliminar curso y asociados:', error);
        return false;
    }
};


export default eliminarAlumnosAsignaturasYCurso;
