import { useContext } from 'react';
import { SesionContexto } from '../contexto/SesionContexto';

export const useSesion = () => useContext(SesionContexto);
