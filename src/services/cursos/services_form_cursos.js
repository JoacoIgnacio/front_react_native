import { EXPO_Url } from '@env';

const guardarCurso = async (curso, user_id) => {
    const nuevoCurso = {
        curso,
        activo: true,
        user_id
    };

    try {
        const response = await fetch(`${EXPO_Url}/cursos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoCurso),
        });

        const data = await response.json();
        return response.ok ? data : data;
    } catch (error) {
        return { error: `Error al guardar el curso: ${error.message}` };
    }
}

export default guardarCurso;
