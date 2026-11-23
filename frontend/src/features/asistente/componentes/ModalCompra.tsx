import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { useCompra, type PasoCompra } from '../hooks/useCompra';
import type { EventoPublico } from '../tipos';
import { formatearFechaHora, formatearPrecio } from '../utilidades/formato';
import { formatearNumeroTarjeta, formatearVencimiento, marcaTarjeta, ultimosCuatro } from '../utilidades/tarjeta';
import { CampoPago } from './CampoPago';
import { VistaTarjeta } from './VistaTarjeta';

interface Propiedades {
  visible: boolean;
  evento: EventoPublico;
  maxCompra: number;
  alCerrar: () => void;
  alVerEntradas: () => void;
}

const TITULO: Record<PasoCompra, string> = {
  cantidad: 'Elige tus entradas',
  pago: 'Datos de pago',
  confirmar: 'Confirma tu compra',
  procesando: 'Procesando pago',
  exito: '¡Compra exitosa!',
};

function Boton({ texto, alPulsar, tipo = 'primario', deshabilitado = false }: { texto: string; alPulsar: () => void; tipo?: 'primario' | 'contorno'; deshabilitado?: boolean }) {
  return (
    <Pressable
      onPress={deshabilitado ? undefined : alPulsar}
      disabled={deshabilitado}
      accessibilityRole="button"
      style={({ pressed }) => [estilos.boton, tipo === 'contorno' ? estilos.contorno : estilos.primario, pressed && { opacity: 0.85 }]}
    >
      <Text style={[estilos.textoBoton, tipo === 'contorno' && { color: Colores.primario }]}>{texto}</Text>
    </Pressable>
  );
}

const Fila = ({ etiqueta, valor, fuerte }: { etiqueta: string; valor: string; fuerte?: boolean }) => (
  <View style={estilos.filaResumen}>
    <Text style={[estilos.etiquetaResumen, fuerte && estilos.fuerte]}>{etiqueta}</Text>
    <Text style={[estilos.valorResumen, fuerte && estilos.fuerte]} numberOfLines={2}>{valor}</Text>
  </View>
);

export function ModalCompra({ visible, evento, maxCompra, alCerrar, alVerEntradas }: Propiedades) {
  const inset = useSafeAreaInsets();
  const c = useCompra(evento, maxCompra);
  const { paso } = c;
  const ocupado = paso === 'procesando';
  const numeroPaso = paso === 'cantidad' ? 1 : paso === 'pago' ? 2 : 3;
  const totalPasos = c.esGratis ? 2 : 3;

  useEffect(() => { if (visible) c.reiniciar(); }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const cerrar = () => { if (!ocupado) alCerrar(); };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={cerrar}>
      <KeyboardAvoidingView style={estilos.fondo} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable style={estilos.cierreFondo} onPress={cerrar} />
        <View style={[estilos.hoja, { paddingBottom: Math.max(20, inset.bottom + 12), maxHeight: '88%' }]}>
          <View style={estilos.cabecera}>
            <View style={{ flex: 1 }}>
              <Text style={estilos.titulo}>{TITULO[paso]}</Text>
              {paso !== 'exito' && paso !== 'procesando' && (
                <Text style={estilos.paso}>Paso {c.esGratis && numeroPaso === 3 ? 2 : numeroPaso} de {totalPasos}</Text>
              )}
            </View>
            {!ocupado && (
              <Pressable onPress={cerrar} hitSlop={10} accessibilityLabel="Cerrar">
                <Ionicons name="close" size={28} color={Colores.primarioOscuro} />
              </Pressable>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {paso === 'cantidad' && (
              <>
                <Text style={estilos.evento} numberOfLines={2}>{evento.titulo}</Text>
                <Text style={estilos.subevento}>{formatearFechaHora(evento.fechaInicio)}</Text>
                <View style={estilos.selector}>
                  <Pressable style={estilos.mas} disabled={c.cantidad <= 1} onPress={() => c.cambiarCantidad(-1)} accessibilityLabel="Menos">
                    <Ionicons name="remove" size={28} color={c.cantidad <= 1 ? '#C9BCE0' : Colores.primario} />
                  </Pressable>
                  <Text style={estilos.numero}>{c.cantidad}</Text>
                  <Pressable style={estilos.mas} disabled={c.cantidad >= maxCompra} onPress={() => c.cambiarCantidad(1)} accessibilityLabel="Más">
                    <Ionicons name="add" size={28} color={c.cantidad >= maxCompra ? '#C9BCE0' : Colores.primario} />
                  </Pressable>
                </View>
                <Text style={estilos.nota}>Puedes comprar hasta {maxCompra} {maxCompra === 1 ? 'entrada' : 'entradas'} más.</Text>
                <View style={estilos.total}>
                  <Text style={estilos.etiquetaTotal}>Total</Text>
                  <Text style={estilos.valorTotal}>{formatearPrecio(c.total)}</Text>
                </View>
                <Boton texto="Continuar" alPulsar={c.continuarDesdeCantidad} />
              </>
            )}

            {paso === 'pago' && (
              <>
                <VistaTarjeta datos={c.tarjeta} />
                <View style={estilos.aviso}>
                  <Ionicons name="information-circle-outline" size={20} color="#B4530A" />
                  <Text style={estilos.textoAviso}>
                    Pago simulado: no se cobra nada. No escribas datos de una tarjeta real. Prueba con 4242 4242 4242 4242, cualquier fecha futura y cualquier CVV.
                  </Text>
                </View>
                <CampoPago
                  etiqueta="Nombre del titular" value={c.tarjeta.titular} onChangeText={(t) => c.cambiarTarjeta('titular', t)}
                  placeholder="Como aparece en la tarjeta" autoCapitalize="characters" error={c.errores.titular} maxLength={40}
                />
                <CampoPago
                  etiqueta="Número de tarjeta" value={c.tarjeta.numero} onChangeText={(t) => c.cambiarTarjeta('numero', formatearNumeroTarjeta(t))}
                  placeholder="0000 0000 0000 0000" keyboardType="number-pad" error={c.errores.numero} maxLength={19}
                />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <CampoPago
                      etiqueta="Vencimiento" value={c.tarjeta.vencimiento} onChangeText={(t) => c.cambiarTarjeta('vencimiento', formatearVencimiento(t))}
                      placeholder="MM/AA" keyboardType="number-pad" error={c.errores.vencimiento} maxLength={5}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <CampoPago
                      etiqueta="CVV" value={c.tarjeta.cvv} onChangeText={(t) => c.cambiarTarjeta('cvv', t.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••" keyboardType="number-pad" secureTextEntry error={c.errores.cvv} maxLength={4}
                    />
                  </View>
                </View>
                <View style={estilos.acciones}>
                  <Boton tipo="contorno" texto="Atrás" alPulsar={c.atras} />
                  <Boton texto="Revisar compra" alPulsar={c.continuarDesdePago} />
                </View>
              </>
            )}

            {paso === 'confirmar' && (
              <>
                <View style={estilos.resumen}>
                  <Fila etiqueta="Evento" valor={evento.titulo} />
                  <Fila etiqueta="Fecha" valor={formatearFechaHora(evento.fechaInicio)} />
                  <Fila etiqueta="Lugar" valor={evento.lugar} />
                  <Fila etiqueta="Entradas" valor={`${c.cantidad} × ${formatearPrecio(evento.precio)}`} />
                  {!c.esGratis && <Fila etiqueta="Pago con" valor={`${marcaTarjeta(c.tarjeta.numero)} •••• ${ultimosCuatro(c.tarjeta.numero)}`} />}
                  <View style={estilos.divisor} />
                  <Fila etiqueta="Total a pagar" valor={formatearPrecio(c.total)} fuerte />
                </View>
                <Text style={estilos.nota}>Al confirmar se emitirán tus entradas con su código QR. Pago simulado: no se hará ningún cargo real.</Text>
                <View style={estilos.acciones}>
                  <Boton tipo="contorno" texto="Atrás" alPulsar={c.atras} />
                  <Boton texto={c.esGratis ? 'Obtener entradas' : `Pagar ${formatearPrecio(c.total)}`} alPulsar={c.pagar} />
                </View>
              </>
            )}

            {paso === 'procesando' && (
              <View style={estilos.centro}>
                <ActivityIndicator size="large" color={Colores.primario} />
                <Text style={estilos.nota}>Procesando pago simulado…{'\n'}No cierres esta pantalla.</Text>
              </View>
            )}

            {paso === 'exito' && (
              <View style={estilos.centro}>
                <View style={estilos.circuloExito}><Ionicons name="checkmark" size={46} color="#FFFFFF" /></View>
                <Text style={estilos.evento}>{c.compradas} {c.compradas === 1 ? 'entrada lista' : 'entradas listas'}</Text>
                <Text style={estilos.nota}>Ya están en “Mis eventos”. Tu código QR se activa unas horas antes del inicio.</Text>
                <View style={[estilos.acciones, { width: '100%' }]}>
                  <Boton tipo="contorno" texto="Seguir viendo" alPulsar={alCerrar} />
                  <Boton texto="Ver mis entradas" alPulsar={alVerEntradas} />
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: Colores.fondoModal, justifyContent: 'flex-end' },
  cierreFondo: { flex: 1 },
  hoja: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 28, maxHeight: '92%' },
  cabecera: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  titulo: { fontSize: 22, fontWeight: '800', color: Colores.primarioOscuro },
  paso: { fontSize: 13, color: Colores.textoSuave, marginTop: 2 },
  evento: { fontSize: 18, fontWeight: '800', color: '#1F1B2E', textAlign: 'center' },
  subevento: { fontSize: 14, color: Colores.textoSuave, textAlign: 'center', marginTop: 4 },
  selector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28, marginTop: 22 },
  mas: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F1EAFC', alignItems: 'center', justifyContent: 'center' },
  numero: { fontSize: 38, fontWeight: '800', color: Colores.primarioOscuro, minWidth: 50, textAlign: 'center' },
  nota: { fontSize: 13, color: Colores.textoSuave, textAlign: 'center', marginTop: 10, lineHeight: 18 },
  total: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, marginBottom: 18, borderTopWidth: 1, borderTopColor: '#EEE8F7' },
  etiquetaTotal: { fontSize: 16, fontWeight: '700', color: '#1F1B2E' },
  valorTotal: { fontSize: 22, fontWeight: '800', color: Colores.primario },
  aviso: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', backgroundColor: '#FDE8D4', borderRadius: 14, padding: 12, marginTop: 14 },
  textoAviso: { flex: 1, fontSize: 12.5, color: '#7A3A08', lineHeight: 17 },
  acciones: { flexDirection: 'row', gap: 12, marginTop: 20 },
  boton: { flex: 1, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  primario: { backgroundColor: Colores.primario },
  contorno: { borderWidth: 1.5, borderColor: Colores.primario, backgroundColor: '#FFFFFF' },
  textoBoton: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  resumen: { backgroundColor: '#F6F2FD', borderRadius: 18, padding: 16, gap: 10 },
  filaResumen: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  etiquetaResumen: { fontSize: 14, color: Colores.textoSuave },
  valorResumen: { flex: 1, textAlign: 'right', fontSize: 14, fontWeight: '600', color: '#1F1B2E' },
  fuerte: { fontSize: 18, fontWeight: '800', color: Colores.primario },
  divisor: { height: 1, backgroundColor: '#E4DEF0' },
  centro: { alignItems: 'center', paddingVertical: 24, gap: 6 },
  circuloExito: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#1B9E4B', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
});
