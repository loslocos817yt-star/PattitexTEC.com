/**
 * PATTITEXTEC - Sistema de Cuentas y DB v2.0
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCfFR5gISBjRbDkdKKQv36rnJvWjNhoNdzYFrZmiu5S8_TzM6ifW0T0Bj38YTYT9E0SA/exec";

// Función para abrir/cerrar la ventana del usuario
function toggleUserModal() {
    const modal = document.getElementById('user-modal');
    const overlay = document.getElementById('overlay');
    
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        overlay.classList.add('active');
        actualizarInterfazModal(); // Revisa si hay sesión al abrir
    } else {
        modal.classList.add('hidden');
        overlay.classList.remove('active');
    }
}

// Cierra modal al tocar el fondo oscuro
document.getElementById('overlay').addEventListener('click', () => {
    document.getElementById('user-modal').classList.add('hidden');
});

// Revisa si hay datos guardados y pinta la ventana correcta
function actualizarInterfazModal() {
    const modalContent = document.getElementById('modal-content');
    const usuarioGuardado = JSON.parse(localStorage.getItem('pattitex_cuenta'));

    if (usuarioGuardado) {
        // SI YA TIENE CUENTA
        document.getElementById('modal-title').innerText = "PERFIL_DE_USUARIO";
        modalContent.innerHTML = `
            <div class="profile-info">
                <p>NÚM. DE CUENTA (ID): <span>${usuarioGuardado.id}</span></p>
                <p>USUARIO: <span>${usuarioGuardado.usuario}</span></p>
                <p>CONTRASEÑA: <span>[ ${usuarioGuardado.password} ]</span></p>
            </div>
            <button class="btn-descarga" style="width:100%; margin-top: 15px; border-color: #ff4444; color: #ff4444 !important;" onclick="cerrarSesion()">> CERRAR_SESIÓN</button>
        `;
    } else {
        // SI NO TIENE CUENTA (Crear una)
        document.getElementById('modal-title').innerText = "CREAR_CUENTA";
        modalContent.innerHTML = `
            <p style="color: #004400; margin-top: 0;">> REGISTRO EN LA NUBE</p>
            <input type="text" id="reg-user" class="input-terminal" placeholder="NUEVO_USUARIO_">
            <input type="password" id="reg-pass" class="input-terminal" placeholder="CONTRASEÑA_">
            <button class="btn-descarga" style="width:100%;" onclick="crearCuenta()">> REGISTRAR</button>
            <p id="reg-status" style="margin-top: 10px; font-size: 0.9rem; text-align: center;"></p>
        `;
    }
}

// Función que crea la cuenta, genera el ID y lo manda al Excel
async function crearCuenta() {
    const u = document.getElementById('reg-user').value;
    const p = document.getElementById('reg-pass').value;
    const statusText = document.getElementById('reg-status');

    if(!u || !p) {
        statusText.style.color = "#ff4444";
        statusText.innerText = "[ ERROR ]: CAMPOS_VACIOS";
        return;
    }

    statusText.style.color = "#00ff00";
    statusText.innerText = "PROCESANDO...";

    // Generar un ID numérico aleatorio (Ej: 8392) simulando el número de cuenta
    const numeroCuenta = Math.floor(1000 + Math.random() * 9000);

    const datosCuenta = {
        usuario: u,
        password: p,
        id: numeroCuenta
    };

    try {
        // 1. Mandarlo al Google Sheets
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosCuenta)
        });

        // 2. Guardarlo en el celular (Local Storage)
        localStorage.setItem('pattitex_cuenta', JSON.stringify(datosCuenta));

        statusText.innerText = "¡CUENTA CREADA!";
        
        // Refrescar modal después de un segundo
        setTimeout(() => {
            actualizarInterfazModal();
        }, 1000);

    } catch (error) {
        statusText.style.color = "#ff4444";
        statusText.innerText = "[ ERROR ]: FALLO_DE_RED";
    }
}

// Función para borrar los datos del teléfono
function cerrarSesion() {
    localStorage.removeItem('pattitex_cuenta');
    actualizarInterfazModal();
}

console.log("%c SISTEMA DE USUARIOS CARGADO ", "background: #000; color: #0f0; border: 1px solid #0f0;");
