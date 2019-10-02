"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UsuariosLista {
    constructor() {
        this.lista = [];
    }
    // Agregar un usuario
    agregar(usuario) {
        this.lista.push(usuario);
        console.log(this.lista);
        return usuario;
    }
    actualizarNombre(id, nombre) {
        for (let usuario of this.lista) {
            if (usuario.id === id) {
                usuario.nombre = nombre;
                break;
            }
        }
        console.log("====== Actualizando Usuario ======");
        console.log(this.lista);
    }
    // Obtener lista de usuarios
    getLista() {
        return this.lista.filter(usuario => usuario.nombre !== 'sin-nombre ');
    }
    // Obtener un Usuario
    getUsuario(id) {
        return this.lista.find(usuario => usuario.id === id);
    }
    // Obtener usuarios en una sala en paticular
    getUsuariosEnSala(sala) {
        return this.lista.filter(usuario => usuario.sala === sala);
    }
    // Borra un usuario
    borrarUsuario(id) {
        const tempUsuario = this.getUsuario(id);
        this.lista = this.lista.filter(usuario => usuario.id !== id);
        console.log(this.lista);
        return tempUsuario;
    }
}
exports.UsuariosLista = UsuariosLista;
