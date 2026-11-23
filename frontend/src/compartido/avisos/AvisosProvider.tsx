import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BotonContorno, BotonPrimario, ModalCentrado } from '@/compartido/componentes';
import { Colores, Espaciado, Fuentes, Tipografia } from '@/compartido/tema';

export type TipoAviso = 'error' | 'info' | 'exito';

export interface OpcionesAviso {
  titulo: string;
  mensaje: string;
  tipo?: TipoAviso;
  textoAceptar?: string;
  textoCancelar?: string;
  textoConfirmar?: string;
  textoAccion?: string;
  alAceptar?: () => void;
  alConfirmar?: () => void;
  alAccion?: () => void;
  alCancelar?: () => void;
}

interface EstadoAviso extends OpcionesAviso {
  visible: boolean;
}

type MostrarAviso = (opciones: OpcionesAviso) => void;

const AvisoContexto = createContext<MostrarAviso>(() => undefined);
let mostrarAvisoGlobal: MostrarAviso = () => undefined;

export const mostrarAviso: MostrarAviso = (opciones) => mostrarAvisoGlobal(opciones);

export function AvisosProvider({ children }: { children: React.ReactNode }) {
  const [aviso, establecerAviso] = useState<EstadoAviso>({
    visible: false,
    titulo: '',
    mensaje: '',
  });

  useEffect(() => {
    mostrarAvisoGlobal = (opciones) => establecerAviso({ ...opciones, visible: true });
    return () => { mostrarAvisoGlobal = () => undefined; };
  }, []);

  const ocultar = useCallback(() => establecerAviso((actual) => ({ ...actual, visible: false })), []);
  const cerrar = useCallback(() => {
    const accion = aviso.alCancelar;
    ocultar();
    accion?.();
  }, [aviso, ocultar]);

  const confirmar = useCallback(() => {
    const accion = aviso.alConfirmar ?? aviso.alAceptar;
    ocultar();
    accion?.();
  }, [aviso, ocultar]);

  const valor = useMemo<MostrarAviso>(() => (opciones) => {
    establecerAviso({ ...opciones, visible: true });
  }, []);

  const esConfirmacion = !!aviso.textoConfirmar && !!aviso.alConfirmar;
  const icono = aviso.tipo === 'exito'
    ? { nombre: 'checkmark-circle' as const, color: Colores.exito }
    : aviso.tipo === 'info'
      ? { nombre: 'information-circle' as const, color: Colores.primario }
      : { nombre: 'close-circle' as const, color: Colores.error };

  return (
    <AvisoContexto.Provider value={valor}>
      {children}
      <ModalCentrado visible={aviso.visible} alCerrar={cerrar}>
        <Ionicons name={icono.nombre} size={64} color={icono.color} style={{ alignSelf: 'center', marginBottom: Espaciado.md }} />
        <Text style={{ fontSize: 22, fontFamily: Fuentes.extranegrita, color: Colores.primarioOscuro, textAlign: 'center', marginBottom: Espaciado.lg }}>
          {aviso.titulo}
        </Text>
        <Text style={{ fontSize: Tipografia.cuerpo, fontFamily: Fuentes.regular, color: Colores.textoSuave, textAlign: 'center', lineHeight: 22, marginBottom: Espaciado.lg }}>
          {aviso.mensaje}
        </Text>
        {esConfirmacion ? (
          <View style={{ gap: Espaciado.sm }}>
            <BotonPrimario titulo={aviso.textoConfirmar ?? 'Confirmar'} onPress={confirmar} />
            <BotonContorno titulo={aviso.textoCancelar ?? 'Cancelar'} onPress={cerrar} />
          </View>
        ) : aviso.textoAccion && aviso.alAccion ? (
          <>
            <BotonPrimario
              titulo={aviso.textoAceptar ?? 'Aceptar'}
              onPress={() => {
                ocultar();
                aviso.alAceptar?.();
              }}
            />
            <BotonContorno
              titulo={aviso.textoAccion}
              onPress={() => {
                ocultar();
                aviso.alAccion?.();
              }}
            />
            {aviso.alCancelar && (
              <BotonContorno titulo={aviso.textoCancelar ?? 'Cancelar'} onPress={cerrar} />
            )}
          </>
        ) : (
          <BotonPrimario
            titulo={aviso.textoAceptar ?? 'Entendido'}
            onPress={() => {
              const accion = aviso.alAceptar;
              cerrar();
              accion?.();
            }}
          />
        )}
      </ModalCentrado>
    </AvisoContexto.Provider>
  );
}

export function useAviso(): MostrarAviso {
  return useContext(AvisoContexto);
}
