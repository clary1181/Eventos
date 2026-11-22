import React from 'react';
import { Stack } from 'expo-router';
import { GuardiaRol } from '@/features/auth';
import { RecordatoriosAsistente } from '@/features/recordatorios';

export default function LayoutAsistente() {
  return (
    <GuardiaRol rol="asistente">
      <RecordatoriosAsistente />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(pestanas)" />
        <Stack.Screen name="evento/[id]" />
      </Stack>
    </GuardiaRol>
  );
}
