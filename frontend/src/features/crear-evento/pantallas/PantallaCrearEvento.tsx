import React, { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { FormularioEvento } from '../componentes/FormularioEvento';
import { useFormularioEvento } from '../hooks/useFormularioEvento';

export function PantallaCrearEvento() {
  const formulario = useFormularioEvento();
  useFocusEffect(useCallback(() => { setStatusBarStyle('dark'); }, []));

  return (
    <FormularioEvento
      formulario={formulario}
      titulo="Crear evento"
      subtitulo="Cuéntanos los detalles de tu evento en Ensenada."
      textoBoton="Enviar a revisión"
    />
  );
}
