const URL_API_almacen_central = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/api').replace(/\/$/, '');

function construirUrl(ruta) {
    const rutaNormalizada = String(ruta || '').replace(/^\//, '');
    return `${URL_API_almacen_central}/${rutaNormalizada}`;
}

export async function cargarDatos(ruta){
    let url = construirUrl(ruta)
    try{
        let respuesta  = await fetch(url, {
            "method": 'GET',
            "headers": {
                "Content-Type": 'application/json'  
            }
        });
        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API: " + respuesta.statusText);
        };
        
        return await respuesta.json();
    } catch (error) {
        console.error("Error durante la solicitud:", error);
        throw error;
    };
};
export async function enviarDatos(ruta, fila){
    let url = construirUrl(ruta)
    try {
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(fila),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error("Error en la respuesta de la API: " + response.statusText);
        }
        // Convertir la respuesta a JSON
        let data = await response.json();
        return data;  // Retorna el JSON con la respuesta de la API

    } catch (error) {
        console.error("Error durante la solicitud:", error);
        throw error;  // Propaga el error si lo hay
    }
};

export function generarFecha(){
    const fecha = new Date(); 
    const dia = String(fecha.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos 
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Asegura que el mes tenga dos dígitos 
    const anio = fecha.getFullYear();
    const hora = String(fecha.getHours()).padStart(2, '0')
    const minuto = String(fecha.getMinutes()).padStart(2, '0')
    const segundo = String(fecha.getSeconds()).padStart(2, '0')
    return `${anio}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
};