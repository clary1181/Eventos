import React, { useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colores } from '@/compartido/tema';
import { estilos } from './CampoTexto.estilos';

type Propiedades = TextInputProps & {
  icono: keyof typeof Ionicons.glyphMap;
  error?: string;
  esContrasenia?: boolean;
};

export function CampoTexto({ icono, error, esContrasenia = false, style, ...resto }: Propiedades) {
  const [visible, establecerVisible] = useState(false);

  return (
    <View style={estilos.envoltorio}>
      <View style={[estilos.campo, !!error && estilos.campoError]}>
        <Ionicons name={icono} size={22} color={Colores.primarioOscuro} style={estilos.icono} />
        <TextInput
          style={[estilos.entrada, style]}
          placeholderTextColor={Colores.textoSuave}
          secureTextEntry={esContrasenia && !visible}
          autoCorrect={false}
          {...resto}
        />
        {esContrasenia && (
          <Pressable
            onPress={() => establecerVisible((v) => !v)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <Ionicons
              name={visible ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={Colores.textoSuave}
            />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={estilos.textoError}>{error}</Text>}
    </View>
  );
}
