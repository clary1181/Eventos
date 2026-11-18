import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ModalCentrado } from '@/compartido/componentes';
import { Colores } from '@/compartido/tema';
import { estilos } from './SelectorFecha.estilos';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS_SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const ANIOS_ATRAS = 100;

const dos = (n: number) => String(n).padStart(2, '0');

// Lee "DD/MM/AAAA"; devuelve null si está incompleta
const leer = (texto: string) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  return m ? { dia: Number(m[1]), mes: Number(m[2]) - 1, anio: Number(m[3]) } : null;
};

interface Props {
  visible: boolean;
  valor: string; // DD/MM/AAAA o vacío
  alCerrar: () => void;
  alElegir: (fecha: string) => void; // devuelve DD/MM/AAAA
}

// Calendario pequeño para elegir fecha de nacimiento (no permite fechas futuras)
export function SelectorFecha({ visible, valor, alCerrar, alElegir }: Props) {
  const hoy = new Date();
  const anioHoy = hoy.getFullYear();
  const mesHoy = hoy.getMonth();
  const anioMin = anioHoy - ANIOS_ATRAS;

  const [anio, establecerAnio] = useState(anioHoy - 20);
  const [mes, establecerMes] = useState(0);
  const [verAnios, establecerVerAnios] = useState(false);

  // Al abrir, se posiciona en la fecha ya elegida (o en 20 años atrás)
  useEffect(() => {
    if (!visible) return;
    const actual = leer(valor);
    establecerAnio(actual?.anio ?? anioHoy - 20);
    establecerMes(actual?.mes ?? 0);
    establecerVerAnios(false);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const seleccionada = leer(valor);
  const puedeAvanzar = anio < anioHoy || (anio === anioHoy && mes < mesHoy);
  const puedeRetroceder = anio > anioMin || mes > 0;

  const moverMes = (delta: number) => {
    let m = mes + delta;
    let a = anio;
    if (m < 0) { m = 11; a -= 1; }
    if (m > 11) { m = 0; a += 1; }
    establecerMes(m);
    establecerAnio(a);
  };

  // Celdas del mes: huecos iniciales (semana empieza en lunes) + días
  const huecos = (new Date(anio, mes, 1).getDay() + 6) % 7;
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  const celdas: (number | null)[] = [...Array(huecos).fill(null), ...Array.from({ length: totalDias }, (_, i) => i + 1)];

  const anios = Array.from({ length: ANIOS_ATRAS + 1 }, (_, i) => anioHoy - i);

  return (
    <ModalCentrado visible={visible} alCerrar={alCerrar}>
      <View style={estilos.cabecera}>
        <Pressable onPress={() => moverMes(-1)} disabled={verAnios || !puedeRetroceder} hitSlop={10} style={(!puedeRetroceder || verAnios) && estilos.apagado}>
          <Ionicons name="chevron-back" size={24} color={Colores.primario} />
        </Pressable>

        <Pressable style={estilos.tituloMes} onPress={() => establecerVerAnios((v) => !v)}>
          <Text style={estilos.textoTitulo}>{verAnios ? 'Elige el año' : `${MESES[mes]} ${anio}`}</Text>
          <Ionicons name={verAnios ? 'chevron-up' : 'chevron-down'} size={18} color={Colores.primarioOscuro} />
        </Pressable>

        <Pressable onPress={() => moverMes(1)} disabled={verAnios || !puedeAvanzar} hitSlop={10} style={(!puedeAvanzar || verAnios) && estilos.apagado}>
          <Ionicons name="chevron-forward" size={24} color={Colores.primario} />
        </Pressable>
      </View>

      {verAnios ? (
        <ScrollView style={estilos.listaAnios} contentContainerStyle={estilos.rejillaAnios} showsVerticalScrollIndicator={false}>
          {anios.map((a) => (
            <Pressable
              key={a}
              style={[estilos.celdaAnio, a === anio && estilos.celdaActiva]}
              onPress={() => { establecerAnio(a); establecerVerAnios(false); }}
            >
              <Text style={[estilos.textoAnio, a === anio && estilos.textoActivo]}>{a}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <>
          <View style={estilos.fila}>
            {DIAS_SEMANA.map((d, i) => (
              <Text key={i} style={estilos.diaSemana}>{d}</Text>
            ))}
          </View>
          <View style={estilos.fila}>
            {celdas.map((dia, i) => {
              if (dia === null) return <View key={`h${i}`} style={estilos.celda} />;
              const futuro = new Date(anio, mes, dia) > hoy;
              const activo = seleccionada?.dia === dia && seleccionada.mes === mes && seleccionada.anio === anio;
              return (
                <Pressable
                  key={dia}
                  style={estilos.celda}
                  disabled={futuro}
                  onPress={() => { alElegir(`${dos(dia)}/${dos(mes + 1)}/${anio}`); alCerrar(); }}
                >
                  <View style={[estilos.circulo, activo && estilos.celdaActiva]}>
                    <Text style={[estilos.textoDia, activo && estilos.textoActivo, futuro && estilos.textoApagado]}>{dia}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </>
      )}
    </ModalCentrado>
  );
}