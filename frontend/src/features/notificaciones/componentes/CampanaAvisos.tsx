import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { BotonIcono } from '@/compartido/componentes';
import { useSesion } from '@/features/auth';
import { useAvisos } from '../hooks/useAvisos';
import { escucharToquesPush, registrarTokenPush } from '../servicios/servicioPush';

export function CampanaAvisos() {
  const router = useRouter();
  const { perfil } = useSesion();
  const { sinLeer } = useAvisos(perfil?.uid, perfil?.rol === 'administrador');

  useEffect(() => {
    if (!perfil?.uid) return;
    escucharToquesPush();
    void registrarTokenPush(perfil.uid, perfil.rol);
  }, [perfil?.uid, perfil?.rol]);

  return (
    <View>
      <BotonIcono icono="notifications-outline" etiqueta="Avisos" onPress={() => router.push('/notificaciones' as Href)} />
      {sinLeer > 0 && (
        <View style={estilos.insignia} pointerEvents="none">
          <Text style={estilos.numero}>{sinLeer > 9 ? '9+' : sinLeer}</Text>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  insignia: { position: 'absolute', top: -2, right: -2, minWidth: 20, height: 20, borderRadius: 10, backgroundColor: '#E53935', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: '#FFFFFF' },
  numero: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
});
