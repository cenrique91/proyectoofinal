"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = __importDefault(require("./../classes/server"));
const socket_1 = require("../sockets/socket");
const sms_1 = require("./../controllers/sms");
const firebase_controller = __importStar(require("./../controllers/firebase"));
exports.router = express_1.Router();
exports.mensaje_router = express_1.Router();
exports.router.get("/enviarmensaje", sms_1.enviarMensaje);
// router.get("/buscar", firebase_controller.buscarCoordenadas);
exports.router.get('/getUsuarioId/:id', firebase_controller.buscarUsuarioId);
exports.router.post("/registrarUsuario", firebase_controller.registrarUsuario);
exports.router.post('/positions', firebase_controller.LatLongPref);
// router.get("/getUsuarioId", (req: Request, res: Response) => {
//   // const id = req.body.id;
//   const data = Server.instance.buscarUsuarioId();
//     res.json({
//       ok: true,
//       mensaje: "Usuario Encontrado",
//       data
//     });
// });
exports.router.get("/mensajes", (req, res) => {
    res.json({
        ok: true,
        mensaje: "Todo esta Bien!!!"
    });
});
exports.router.post("/mensajes", (req, res) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const payload = {
        cuerpo,
        de
    };
    const server = server_1.default.instance;
    server.io.emit("mensaje-nuevo", payload);
    res.json({
        ok: true,
        cuerpo,
        de
    });
});
exports.router.post("/mensajes/:id", (req, res) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;
    const payload = {
        de,
        cuerpo
    };
    const server = server_1.default.instance;
    server.io.in(id).emit("mensaje-privado", payload);
    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});
// Servicio para obtener todos los ID's de los usuarios
exports.router.get("/usuarios", (req, res) => {
    const server = server_1.default.instance;
    server.io.clients((err, clientes) => {
        if (err) {
            res.json({
                ok: false,
                err
            });
            return;
        }
        res.json({
            ok: true,
            clientes
        });
    });
});
// Obtener Usuarios y Nombres
exports.router.get("/usuarios/detalle", (req, res) => {
    res.json({
        ok: true,
        clientes: socket_1.usuariosConectados.getLista()
    });
});
exports.default = exports.router;
