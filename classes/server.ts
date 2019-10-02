import express from "express";
import { SERVER_PORT } from "../global/environments";
import socketIO from "socket.io";
import http from "http";
import * as socket from "../sockets/socket";
import { Request, Response, NextFunction } from "express";
import { mensaje_router } from "../routes/router";
import { LatLongPref } from "../controllers/firebase";

// var admin = require("firebase-admin");
// var bodyParser = require("body-parser");
// admin.initializeApp({
//   credential: admin.credential.cert(require("./KEYFB.json")),
//   databaseURL: "https://proyectofinalcodigo5-82c87.firebaseio.com"
// });

export default class Server {
  private static _instance: Server;
  public app: express.Application;
  public port: number;

  public io: socketIO.Server;
  private httpServer: http.Server;

  private constructor() {
    this.app = express();
    this.port = SERVER_PORT;
    this.httpServer = new http.Server(this.app);
    this.io = socketIO(this.httpServer);
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

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private escucharSockets() {
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
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).send('Servidor OK!');
    });

    // this.app.post('/hola', function DataPost(req, res) {
    //   console.log(' este es mensahe del post ' + req.body.message);
    // });
    // this.app.post('/getusuario', getUsuario);
    this.app.post('/positions', LatLongPref);
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


  start(callback: Function) {
    this.httpServer.listen(this.port, callback());
  }
}
