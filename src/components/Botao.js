/**
 * Botao reutilizavel com estados de carregamento e duas variantes visuais
 * (primaria preenchida e secundaria com contorno). Aceita um icone opcional.
 */
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

export default function Botao({
  titulo,
  onPress,
  carregando = false,
  disabled = false,
  icone,
  variante = 'primaria',
}) {
  const secundaria = variante === 'secundaria';
  const corConteudo = secundaria ? colors.primary : colors.textOnPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={carregando || disabled}
      style={({ pressed }) => [
        styles.base,
        secundaria ? styles.secundaria : styles.primaria,
        (pressed || carregando || disabled) && styles.pressionado,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={corConteudo} />
      ) : (
        <>
          {icone ? <Ionicons name={icone} size={18} color={corConteudo} /> : null}
          <Text style={[styles.texto, { color: corConteudo }]}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  primaria: {
    backgroundColor: colors.primary,
  },
  secundaria: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  pressionado: {
    opacity: 0.75,
  },
  texto: {
    fontSize: 15,
    fontWeight: '700',
  },
});
