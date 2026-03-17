/**
 * PATTITEXTEC - Sistema de Gestión de Usuarios y Panel Admin
 * Versión: 3.1 "Cyber-Sec Update"
 */

const PATTITEX = {
    config: {
        apiUrl: "https://script.google.com/macros/s/AKfycbxCfFR5gISBjRbDkdKKQv36rnJvWjNhoNdzYFrZmiu5S8_TzM6ifW0T0Bj38YTYT9E0SA/exec",
        // ⚠️ ADVERTENCIA: En un entorno real, JAMÁS pongas contraseñas aquí.
        adminKey: "Pattitex999" 
    },

    elementos: {
        get modal() { return document.getElementById('user-modal'); },
        get overlay() { return document.getElementById('overlay'); },
        get contenido() { return document.getElementById('modal-content'); },
        get titulo() { return document.getElementById('modal-title'); }
    },

    // --- CONTROL DE INTERFAZ ---

    toggleModal: function() {
        const isHidden = this.elementos.modal.classList.contains('hidden');
        
        if (isHidden) {
            this.elementos.modal.classList.remove('hidden');
            this.elementos.overlay.classList.add('active');
            this.renderizarInterfaz();
        } else {
            this.elementos.modal.classList.add('hidden');
            this.elementos.overlay.classList.remove('active');
        }
    },

    renderizarInterfaz: function() {
        const usuarioGuardado = JSON.parse(localStorage.getItem('pattitex_cuenta'));

        if (usuarioGuardado) {
            this.vistaPerfil(usuarioGuardado);
        } else {
            this.vistaRegistro();
        }
    },

    // --- VISTAS PRINCIPALES ---

    vistaPerfil: function(user) {
        this.elementos.titulo.innerText = "SYSTEM_PROFILE";
        this.elementos.contenido.innerHTML = `
            <div class="profile-info" style="border-left: 3px solid #0f0; padding-left: 10px; margin-bottom: 20px;">
                <p style="margin: 5px 0; color: #aaa;">ID_CUENTA: <span style="color:#0f0; font-weight: bold;">#${user.id}</span></p>
                <p style="margin: 5px 0; color: #aaa;">USUARIO: <span style="color:#fff;">${user.usuario}</span></p>
                <p style="margin: 5px 0; color: #aaa;">STATUS: <span style="color:#0f0;" class="blink">ACTIVE_NODE</span></p>
            </div>
            <button class="btn-descarga" style="width:100%; margin-top:10px; border: 1px solid #0044ff; color:#0044ff; background: transparent; cursor: pointer; padding: 10px;" onclick="PATTITEX.vistaLoginAdmin()">> ADMIN_PANEL</button>
            <button class="btn-descarga" style="width:100%; margin-top:10px; border: 1px solid #ff4444; color:#ff4444; background: transparent; cursor: pointer; padding: 10px;" onclick="PATTITEX.cerrarSesion()">> LOGOUT</button>
        `;
    },

    vistaRegistro: function() {
        this.elementos.titulo.innerText = "CREATE_ID";
        this.elementos.contenido.innerHTML = `
            <p style="color: #00f000; font-size: 0.9em;">> AWAITING_NEW_USER_DATA...</p>
            <input type="text" id="reg-user" class="input-terminal" placeholder="USER_NAME" style="width: 100%; margin-bottom: 10px; padding: 8px; background: #000; color: #0f0; border: 1px solid #0f0;">
            <input type="password" id="reg-pass" class="input-terminal" placeholder="PASSWORD" style="width: 100%; margin-bottom: 15px; padding: 8px; background: #000; color: #0f0; border: 1px solid #0f0;">
            <button class="btn-descarga" style="width:100%; padding: 10px; background: #002200; border: 1px solid #0f0; color: #0f0; cursor: pointer;" onclick="PATTITEX.crearCuenta()">> INITIALIZE_ACCOUNT</button>
            <p id="reg-status" style="margin-top:15px; font-size:0.8rem; text-align:center; height: 1em; color: #ffaa00;"></p>
        `;
    },

    vistaLoginAdmin: function() {
        this.elementos.titulo.innerText = "ADMIN_VERIFICATION";
        this.elementos.contenido.innerHTML = `
            <p style="color:#ffaa00;">[!] ACCESO RESTRINGIDO A NIVEL ROOT</p>
            <p style="font-size:0.8rem; color:#aaa;">INGRESE LLAVE DE ENCRIPTACIÓN:</p>
            <input type="password" id="admin-key" class="input-terminal" placeholder="PASSWORD_" style="width: 100%; margin-bottom: 10px; padding: 8px; background: #000; color: #0f0; border: 1px solid #0f0;">
            <button class="btn-descarga" style="width:100%; padding: 10px; background: #220000; border: 1px solid #ff0000; color: #ff0000; cursor: pointer;" onclick="PATTITEX.verificarAdmin()">> LOGIN_ROOT</button>
            <button class="btn-descarga" style="width:100%; margin-top:10px; padding: 10px; border:none; background: transparent; color: #fff; cursor: pointer;" onclick="PATTITEX.renderizarInterfaz()">> ABORTAR</button>
            <p id="admin-error" style="color:#ff4444; margin-top:10px; font-size:0.8rem; display:none;"></p>
        `;
    },

    // --- LÓGICA DE NEGOCIO ---

    verificarAdmin: function() {
        const inputKey = document.getElementById('admin-key').value;
        const errorMsg = document.getElementById('admin-error');
        const boton = document.querySelector('button[onclick="PATTITEX.verificarAdmin()"]');

        // Efecto visual de carga
        boton.innerText = "> VALIDATING_HASH...";
        boton.disabled = true;

        setTimeout(() => {
            if (inputKey === this.config.adminKey) {
                this.cargarTablaAdmin();
            } else {
                errorMsg.style.display = "block";
                errorMsg.innerText = "[ ERROR ]: ACCESO_DENEGADO_IP_RASTREADA";
                boton.innerText = "> LOGIN_ROOT";
                boton.disabled = false;
                
                setTimeout(() => {
                    this.toggleModal(); 
                    console.warn("⚠️ ALERTA DE SEGURIDAD: Intento de acceso no autorizado.");
                    alert("⚠️ ALERTA DE SEGURIDAD: Intento de acceso no autorizado.");
                }, 1500);
            }
        }, 800); // Retraso falso de 800ms para darle efecto dramático
    },

    cargarTablaAdmin: async function() {
        this.elementos.contenido.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p style="color:#0f0;" class="blink">[ DESCIFRANDO_DATOS_EN_LA_NUBE... ]</p>
            </div>
        `;

        try {
            const res = await fetch(this.config.apiUrl);
            const usuarios = await res.json();
            
            let html = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <p style="color:#0f0; font-size:0.9rem;">> NODOS_DETECTADOS: <span style="font-weight:bold;">${usuarios.length}</span></p>
                </div>
                <div style="max-height:220px; overflow-y:auto; border:1px solid #0f0; padding:10px; background: #001100;">
                    <table style="width:100%; color:#0f0; font-size:0.85rem; text-align:left; border-collapse: collapse;">
                        <tr style="border-bottom:2px solid #0f0;">
                            <th style="padding: 5px 0;">USER_ID</th>
                            <th style="padding: 5px 0;">HASH_KEY</th>
                        </tr>
            `;
            
            usuarios.forEach(u => {
                // Enmascaramos la contraseña visualmente (solo muestra los últimos 2 caracteres si tiene más de 4)
                const maskedPass = u.password.length > 4 
                    ? '*'.repeat(u.password.length - 2) + u.password.slice(-2) 
                    : '****';

                html += `
                    <tr style="border-bottom: 1px solid #004400;">
                        <td style="padding: 5px 0;">${u.usuario}</td>
                        <td style="padding: 5px 0; color: #00aa00;">${maskedPass}</td>
                    </tr>
                `;
            });

            html += `
                    </table>
                </div>
                <button class="btn-descarga" style="width:100%; margin-top:15px; padding: 10px; background: #002200; border: 1px solid #0f0; color: #0f0; cursor: pointer;" onclick="PATTITEX.renderizarInterfaz()">> CERRAR_CONEXIÓN</button>
            `;
            
            this.elementos.contenido.innerHTML = html;
        } catch (e) {
            console.error("Error al conectar con la DB:", e);
            this.elementos.contenido.innerHTML = `
                <p style="color:#ff4444; text-align: center; font-weight: bold;">[ FATAL_ERROR_CONEXIÓN_DB ]</p>
                <button class="btn-descarga" style="width:100%; margin-top:15px; padding: 10px; border: 1px solid #ff4444; color: #ff4444; background: transparent; cursor: pointer;" onclick="PATTITEX.renderizarInterfaz()">> VOLVER</button>
            `;
        }
    },

    crearCuenta: async function() {
        const u = document.getElementById('reg-user').value.trim();
        const p = document.getElementById('reg-pass').value.trim();
        const status = document.getElementById('reg-status');

        if(!u || !p) {
            status.style.color = "#ff4444";
            status.innerText = "> ERROR: DATOS_INCOMPLETOS";
            return;
        }

        const btn = document.querySelector('button[onclick="PATTITEX.crearCuenta()"]');
        btn.disabled = true;
        btn.innerText = "> CONNECTING...";
        status.style.color = "#0f0";
        status.innerText = "> ESTABLECIENDO_ENLACE_SEGURO...";

        // Generar ID hex-style para que se vea más cool
        const numeroCuenta = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
        const datos = { usuario: u, password: p, id: numeroCuenta };

        try {
            await fetch(this.config.apiUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            localStorage.setItem('pattitex_cuenta', JSON.stringify(datos));
            status.innerText = "> ENLACE_ESTABLECIDO_CON_ÉXITO";
            
            setTimeout(() => this.renderizarInterfaz(), 1200);
        } catch (e) {
            btn.disabled = false;
            btn.innerText = "> INITIALIZE_ACCOUNT";
            status.style.color = "#ff4444";
            status.innerText = "> FATAL: PROTOCOLO_RECHAZADO";
        }
    },

    cerrarSesion: function() {
        localStorage.removeItem('pattitex_cuenta');
        this.renderizarInterfaz();
    }
};

// Exponer la función global antigua por si la llamas desde un botón HTML (e.g. <button onclick="toggleUserModal()">)
window.toggleUserModal = () => PATTITEX.toggleModal();
