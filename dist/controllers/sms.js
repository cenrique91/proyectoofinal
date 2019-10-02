"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accountSid = "AC3f8cb29969036e1427288dc218d27a2b";
const authToken = "49aa9f42172953a7e823721a1ed32439";
const client = require("twilio")(accountSid, authToken);
exports.enviarMensaje = (req, res) => {
    let smsData = {};
    const enviarSms = client.messages.create({
        // to: "+51982001278,+51980912431,+51958171388,+51923557053",
        to: "+51958171388",
        from: "+12024995747",
        body: "Prueba 01 - Proyecto Final CodiGo5 - GeoChat - Avisan en el grupo si les llega este mensaje"
    });
    enviarSms.then((message) => {
        console.log("Mensaje Creado");
        console.log(message.sid);
        console.log("Mensaje enviado correctamente...");
        res.send(200);
    }).catch((error) => {
        console.log(error);
        res.send("Error!!!" + error);
    });
    //   enviarSms.end((respuesta: any) => {
    //     if (respuesta.error) {
    //       res.send("ERROR");
    //     } else {
    //       res.send(respuesta.body);
    //     }
    //   });
};
