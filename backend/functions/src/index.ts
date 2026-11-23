import {setGlobalOptions} from "firebase-functions";

setGlobalOptions({maxInstances: 10});

export { alCambiarSolicitudVerificacion } from './modulos/verificacion/alCambiarSolicitudVerificacion';
export { comprarEntradas } from './modulos/entradas/comprarEntradas';