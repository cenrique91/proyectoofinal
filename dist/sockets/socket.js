"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usuarios_lista_1 = require("../classes/usuarios-lista");
const usuario_1 = require("../classes/usuario");
exports.usuariosConectados = new usuarios_lista_1.UsuariosLista();
exports.conectarCliente = (cliente, io) => {
    const usuario = new usuario_1.Usuario(cliente.id);
    exports.usuariosConectados.agregar(usuario);
};
exports.desconectar = (cliente, io) => {
    cliente.on("disconnect", () => {
        console.log("Cliente Desconectado");
        exports.usuariosConectados.borrarUsuario(cliente.id);
        io.emit("usuarios-activos", exports.usuariosConectados.getLista());
    });
};
// Escuchar Mensajes
exports.mensaje = (cliente, io) => {
    cliente.on("mensaje", (payload) => {
        console.log("Mensaje Recibido", payload);
        io.emit("mensaje-nuevo", payload);
    });
};
// Configurar Usuario
exports.configurarUsuario = (cliente, io) => {
    cliente.on("configurar-usuario", (payload, callback) => {
        // console.log("configurando usuario", payload.nombre);
        exports.usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
        // TODO: Algoritmo de filtro de usuarios
        io.emit("usuarios-activos", exports.usuariosConectados.getLista());
        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre}, configurado`
        });
        // io.emit('mensaje-nuevo',payload);
    });
};
// Obtener Usuarios
exports.obtenerUsuarios = (cliente, io) => {
    cliente.on("obtener-usuarios", () => {
        io.to(cliente.id).emit("usuarios-activos", exports.usuariosConectados.getLista());
        // io.emit("usuarios-activos", usuariosConectados.getLista());
    });
};
