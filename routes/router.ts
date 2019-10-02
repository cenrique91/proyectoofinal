import { Router, Request, Response } from "express";
import Server from "./../classes/server";
import { usuariosConectados } from "../sockets/socket";
import { enviarMensaje } from "./../controllers/sms";
import * as firebase_controller from "./../controllers/firebase";

export const router = Router();
export let mensaje_router = Router();

router.get("/enviarmensaje", enviarMensaje);
// router.get("/buscar", firebase_controller.buscarCoordenadas);

// router.get('/getUsuarioId/:id',firebase_controller.buscarUsuarioId);
router.post("/registrarUsuario", firebase_controller.registrarUsuario);

// router.get("/getUsuarioId", (req: Request, res: Response) => {
//   // const id = req.body.id;
//   const data = Server.instance.buscarUsuarioId();
//     res.json({
//       ok: true,
//       mensaje: "Usuario Encontrado",
//       data
//     });
// });

router.get("/mensajes", (req: Request, res: Response) => {
  res.json({
    ok: true,
    mensaje: "Todo esta Bien!!!"
  });
});

router.post("/mensajes", (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;

  const payload = {
    cuerpo,
    de
  };

  const server = Server.instance;
  server.io.emit("mensaje-nuevo", payload);
  res.json({
    ok: true,
    cuerpo,
    de
  });
});

router.post("/mensajes/:id", (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;
  const id = req.params.id;

  const payload = {
    de,
    cuerpo
  };

  const server = Server.instance;
  server.io.in(id).emit("mensaje-privado", payload);
  res.json({
    ok: true,
    cuerpo,
    de,
    id
  });
});

// Servicio para obtener todos los ID's de los usuarios
router.get("/usuarios", (req: Request, res: Response) => {
  const server = Server.instance;
  server.io.clients((err: any, clientes: string[]) => {
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
router.get("/usuarios/detalle", (req: Request, res: Response) => {
  res.json({
    ok: true,
    clientes: usuariosConectados.getLista()
  });
});

export default router;
