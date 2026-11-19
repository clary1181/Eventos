// Conteos del panel; null = no se pudo leer (reglas, red, colección aún inexistente)
export type Conteo = number | null;

export interface ResumenPlataforma {
  usuarios: Conteo;
  eventosTotales: Conteo;
  eventosVerificados: Conteo;
  entradas: Conteo;
}

export interface TareasPendientes {
  organizadoresPorVerificar: Conteo;
  eventosPorRevisar: Conteo;
  reportesSinRevisar: Conteo;
}

export interface ResumenAdministrador {
  plataforma: ResumenPlataforma;
  tareas: TareasPendientes;
}
