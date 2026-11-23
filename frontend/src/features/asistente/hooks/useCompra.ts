import { useCallback, useRef, useState } from 'react';
import { useSesion } from '@/features/auth';
import { comprarEntradas } from '../servicios/servicioEntradas';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';
import type { EventoPublico } from '../tipos';
import { TARJETA_VACIA, validarTarjeta, type DatosTarjeta, type ErroresTarjeta } from '../utilidades/tarjeta';

export type PasoCompra = 'cantidad' | 'pago' | 'confirmar' | 'procesando' | 'exito';

const pausa = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useCompra(evento: EventoPublico, maxCompra: number) {
  const { perfil } = useSesion();
  const [paso, setPaso] = useState<PasoCompra>('cantidad');
  const [cantidad, setCantidad] = useState(1);
  const [tarjeta, setTarjeta] = useState<DatosTarjeta>(TARJETA_VACIA);
  const [errores, setErrores] = useState<ErroresTarjeta>({});
  const [compradas, setCompradas] = useState(0);
  const pagandoRef = useRef(false);

  const esGratis = evento.precio === 0;
  const total = evento.precio * cantidad;

  const reiniciar = useCallback(() => {
    setPaso('cantidad');
    setCantidad(1);
    setTarjeta(TARJETA_VACIA);
    setErrores({});
  }, []);

  const cambiarCantidad = (delta: number) => setCantidad((c) => Math.min(Math.max(1, maxCompra), Math.max(1, c + delta)));

  const cambiarTarjeta = <K extends keyof DatosTarjeta>(campo: K, valor: string) => {
    setTarjeta((t) => ({ ...t, [campo]: valor }));
    setErrores((e) => ({ ...e, [campo]: undefined }));
  };

  const continuarDesdeCantidad = () => setPaso(esGratis ? 'confirmar' : 'pago');

  const continuarDesdePago = () => {
    const e = validarTarjeta(tarjeta);
    setErrores(e);
    if (Object.keys(e).length === 0) setPaso('confirmar');
  };

  const atras = () => {
    if (paso === 'confirmar') setPaso(esGratis ? 'cantidad' : 'pago');
    else if (paso === 'pago') setPaso('cantidad');
  };

  const pagar = async () => {
    if (!perfil?.uid || pagandoRef.current) return;
    pagandoRef.current = true;
    setPaso('procesando');
    try {
      await pausa(1200);
      const r = await comprarEntradas(perfil.uid, evento.id, cantidad);
      setCompradas(r.entradas.length);
      setTarjeta(TARJETA_VACIA);
      setPaso('exito');
    } catch (e) {
      console.error('Error en la compra:', e);
      const codigo = (e as { code?: string })?.code ?? '';
      const mensaje = (e as { message?: string })?.message ?? '';
      mostrarAviso({
        titulo: 'No se pudo completar la compra',
        mensaje: codigo === 'permission-denied'
          ? 'Las reglas de Firestore no permitieron la compra. Revisa que ya publicaste las reglas nuevas (firebase deploy --only firestore:rules).'
          : codigo !== '' || mensaje === ''
            ? 'Ocurrió un error inesperado. Revisa tu conexión e inténtalo de nuevo.'
            : mensaje,
        tipo: 'error',
      });
      setPaso('confirmar');
    } finally {
      pagandoRef.current = false;
    }
  };

  return {
    paso, cantidad, tarjeta, errores, compradas, esGratis, total,
    reiniciar, cambiarCantidad, cambiarTarjeta, continuarDesdeCantidad, continuarDesdePago, atras, pagar,
  };
}