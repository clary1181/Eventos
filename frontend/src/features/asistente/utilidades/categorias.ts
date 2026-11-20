import type { Ionicons } from '@expo/vector-icons';

type Icono = React.ComponentProps<typeof Ionicons>['name'];

export const ICONO_CATEGORIA: Record<string, Icono> = {
  Todos: 'grid-outline',
  Música: 'musical-notes-outline',
  Gastronomía: 'restaurant-outline',
  Cultura: 'library-outline',
  Arte: 'color-palette-outline',
  Deportes: 'football-outline',
  Otros: 'ellipsis-horizontal-circle-outline',
};

// Colores de la etiqueta de categoría (fondo, texto)
const COLOR_CATEGORIA: Record<string, [string, string]> = {
  Música: ['#EFE8FB', '#5E1F9C'],
  Gastronomía: ['#FDE8D4', '#C2570C'],
  Cultura: ['#E3F0FC', '#1D5FA8'],
  Arte: ['#FCE4F0', '#B02A74'],
  Deportes: ['#E4F4E7', '#1B7F3B'],
  Otros: ['#EEEDF2', '#55516B'],
};
export const coloresCategoria = (c: string): [string, string] => COLOR_CATEGORIA[c] ?? COLOR_CATEGORIA.Otros;
