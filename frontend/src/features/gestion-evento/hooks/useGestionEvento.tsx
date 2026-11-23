import React, { useState } from 'react';
import { useRouter, type Href } from 'expo-router';
import type { Evento } from '@/features/eventos';
import { HojaAccionesEvento, type AccionEvento } from '../componentes/HojaAccionesEvento';
import { eliminarEvento } from '../servicios/servicioGestionEvento';
import { mostrarAviso } from '@/compartido/avisos/AvisosProvider';

const EDITABLES = ['pendiente_aprobacion', 'requiere_correccion', 'aprobado'];

export function useGestionEvento() {
  const router = useRouter();
  const [evento, setEvento] = useState<Evento | null>(null);
  const cerrar = () => setEvento(null);
  const luego = (f: () => void) => { cerrar(); setTimeout(f, 250); };

  const verEstadisticas = (e: Evento) => router.push(`/organizador/estadisticas-evento?id=${e.id}` as Href);
  const verEntradas = (e: Evento) => router.push(`/organizador/entradas-vendidas?id=${e.id}` as Href);

  const eliminar = (e: Evento) => {
    if (e.vendidas > 0) {
      mostrarAviso({
        titulo: 'No se puede eliminar',
        mensaje: `"${e.titulo}" ya tiene ${e.vendidas} ${e.vendidas === 1 ? 'entrada vendida' : 'entradas vendidas'}. Para proteger a quienes ya compraron, un evento con ventas no se elimina.`,
        tipo: 'error',
      });
      return;
    }
    mostrarAviso({
      titulo: 'Eliminar evento',
      mensaje: `Se eliminará "${e.titulo}" de forma permanente. Esta acción no se puede deshacer.`,
      tipo: 'error',
      textoCancelar: 'Cancelar',
      textoConfirmar: 'Eliminar',
      alConfirmar: () =>
          eliminarEvento(e.id).catch((err) => {
            console.error('Error al eliminar el evento:', err);
            mostrarAviso({ titulo: 'No se pudo eliminar', mensaje: 'Revisa tu conexión y que hayas publicado las reglas nuevas. Si alguien compró entradas mientras tanto, ya no se puede eliminar.', tipo: 'error' });
          }),
    });
  };

  const acciones: AccionEvento[] = evento
    ? [
        { icono: 'stats-chart-outline', titulo: 'Ver estadísticas', alPulsar: () => luego(() => verEstadisticas(evento)) },
        { icono: 'people-outline', titulo: 'Entradas vendidas', detalle: 'Quién compró y cuáles ya se validaron', alPulsar: () => luego(() => verEntradas(evento)) },
        ...(EDITABLES.includes(evento.estado)
          ? [{ icono: 'pencil-outline' as const, titulo: 'Editar evento', alPulsar: () => luego(() => router.push(`/organizador/editar-evento?id=${evento.id}` as Href)) }]
          : []),
        {
          icono: 'trash-outline',
          titulo: 'Eliminar evento',
          peligro: true,
          deshabilitada: evento.vendidas > 0,
          detalle: evento.vendidas > 0 ? `No disponible: ${evento.vendidas} ${evento.vendidas === 1 ? 'entrada vendida' : 'entradas vendidas'}` : 'Solo si aún no vendes entradas',
          alPulsar: () => luego(() => eliminar(evento)),
        },
      ]
    : [];

  const hoja = <HojaAccionesEvento visible={!!evento} titulo={evento?.titulo ?? ''} acciones={acciones} alCerrar={cerrar} />;
  return { abrirMenu: setEvento, verEstadisticas, hoja };
}
