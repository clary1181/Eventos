import { Alert } from 'react-native';

// Marcador de botones cuya función se construye en una etapa posterior
export const avisarProximamente = (funcion: string) =>
  Alert.alert('Próximamente', `${funcion} estará disponible en una próxima etapa.`);
