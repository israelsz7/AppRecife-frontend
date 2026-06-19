/**
 * Card que representa um Distrito Sanitario na tela inicial. Mostra o numero
 * do distrito em um circulo, o nome e uma seta indicando que e clicavel.
 */
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, cardShadow } from '../theme';

export default function DistritoCard({ distrito, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressionado]}
    >
      <View style={styles.circulo}>
        <Text style={styles.numero}>{distrito.numero}</Text>
      </View>

      <View style={styles.meio}>
        <Text style={styles.nome} numberOfLines={1}>{distrito.nome}</Text>
        {/* numberOfLines + altura minima fixa deixam todos os cards do mesmo
            tamanho, independente da quantidade de bairros. */}
        <Text style={styles.subtitulo} numberOfLines={2}>
          {distrito.bairros}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  pressionado: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  circulo: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numero: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  meio: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  nome: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  subtitulo: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    marginTop: 4,
    // Reserva o espaco de 2 linhas para que todos os cards tenham a mesma altura.
    minHeight: 36,
  },
});
