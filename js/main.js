/**
 * PATTITEXTEC - Sistema de Gestión de Usuarios v1.0
 * Conexión con Google Sheets DB
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCfFR5gISBjRbDkdKKQv36rnJvWjNhoNdzYFrZmiu5S8_TzM6ifW0T0Bj38YTYT9E0SA/exec";

async function registrarUsuario(user, pass, id) {
    // Referencia al contenedor de proyectos para mostrar el estado
    const statusContainer = document.getElementById('proyectos-container');
    const originalContent = statusContainer.innerHTML;

    // Efecto visual de carga en la terminal
    statusContainer.innerHTML = `
        <div class="card" style="border-color: #f00;">
            <p style="color: #0f0;">[ SISTEMA ]: INICIANDO PROTOCOLO DE CARGA...</p>
            <p style="color: #0f0;">[ DESTINO ]: GOOGLE_CLOUD_DATABASE</p>
            <p style="color: #0f0;">[ ESTADO ]: PROCESANDO...</p>
        </div>
    `;

    const datos = {
        usuario: user,
        password: pass,
        id: id
    };

    try {
        // Ejecutar el envío a la nube
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        // Simular éxito en la interfaz
        statusContainer.innerHTML = `
            <div class="card" style="border-color: #00FF00;">
                <h2 style="color: #fff;">REGISTRO EXITOSO</h2>
                <p>Usuario <strong>${user}</strong> ha sido indexado en la base de datos externa.</p>
                <p style="color: #004400;">ID_SESIÓN: ${id}</p>
                <button onclick="location.reload()" class="btn-descarga">> REINICIAR TERMINAL</button>
            </div>
        `;

    } catch (error) {
        console.error("ERROR_DATABASE_CONNECTION:", error);
        statusContainer.innerHTML = `
            <div class="card" style="border-color: #ff4444;">
                <h2 style="color: #ff4444;">[ FALLO_CRÍTICO ]</h2>
                <p>No se pudo conectar con el servidor de Google Sheets.</p>
                <button onclick="location.reload()" class="btn-descarga">> REINTENTAR</button>
            </div>
        `;
    }
}

// Log de sistema para la consola del navegador
console.log("%c PATTITEXTEC KERNEL READY ", "background: #000; color: #00ff00; border: 1px solid #00ff00;");
