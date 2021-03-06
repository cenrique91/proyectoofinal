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
const express_1 = __importDefault(require("express"));
const environments_1 = require("../global/environments");
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const socket = __importStar(require("../sockets/socket"));
const firebase_1 = require("../controllers/firebase");
// var admin = require("firebase-admin");
// var bodyParser = require("body-parser");
// admin.initializeApp({
//   credential: admin.credential.cert(require("./KEYFB.json")),
//   databaseURL: "https://proyectofinalcodigo5-82c87.firebaseio.com"
// });
class Server {
    constructor() {
        this.app = express_1.default();
        this.port = environments_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
        this.io = socket_io_1.default(this.httpServer);
        this.escucharSockets();
    }
    // buscarUsuarioId() {
    //   var database = admin.database();
    //   let ref = database.ref("/t_usuarios");
    //   ref.orderByKey().equalTo("987654321").on("value", function(snapshot:any) {
    //     var data = snapshot.val();   //Data is in JSON format.
    //     console.log(data);
    //     return data;
    //   });
    // }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    escucharSockets() {
        console.log("Escuchando conexiones - sockets");
        this.io.on("connection", cliente => {
            // console.log("Cliente Conectado");
            // console.log(cliente.id);
            // Conectar Cliente
            socket.conectarCliente(cliente, this.io);
            // Configurar Usuario
            socket.configurarUsuario(cliente, this.io);
            // Obtener Usuarios Activos
            socket.obtenerUsuarios(cliente, this.io);
            // Mensajes
            socket.mensaje(cliente, this.io);
            // Desconectar
            socket.desconectar(cliente, this.io);
        });
    }
    configurarRutas() {
        this.app.get('/', (req, res) => {
            res.status(200).send('Servidor OK!');
        });
        // this.app.post('/hola', function DataPost(req, res) {
        //   console.log(' este es mensahe del post ' + req.body.message);
        // });
        // this.app.post('/getusuario', getUsuario);
        this.app.post('/positions', firebase_1.LatLongPref);
        // this.app.post('/confirmationCode', confirmationCode);
    }
    habilitarCORS() {
        this.app.use((req, res, next) => {
            // http://127.0.0.1:5500/Frontend/dist/index.html
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-type, Authorization');
            // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            next();
        });
    }
    start(callback) {
        this.httpServer.listen(this.port, callback());
    }
}
exports.default = Server;
