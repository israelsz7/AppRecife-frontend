/**
 * Tokens de design reutilizados em todo o app: cores, espacamentos, raios de
 * borda, sombras e estilos de texto. Centralizar isso mantem a aparencia
 * consistente entre as telas.
 */
import { colors } from './colors';

export { colors };

// Escala de espacamento (margens/paddings) em pixels.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

// Raios de borda (cantos arredondados).
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

// Sombra suave e moderna para os cards (iOS usa shadow*, Android usa elevation).
export const cardShadow = {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,
};
