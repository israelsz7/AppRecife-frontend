/**
 * Card que exibe um medicamento retornado pela API do Recife: nome do produto,
 * unidade de saude, apresentacao e o selo de estoque com a quantidade.
 * Ao tocar, navega para a tela de detalhe.
 */
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, cardShadow } from '../theme';
import { capitalizarTexto, formatarNumero } from '../utils/formatadores';
import SeloEstoque from './SeloEstoque';

export default function MedicamentoCard({ item, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressionado]}
    >
      {/* Cabecalho: nome do produto */}
      <View style={styles.topo}>
        <View style={styles.iconeWrapper}>
          <Ionicons name="medkit" size={18} color={colors.primary} />
        </View>
        <Text style={styles.produto} numberOfLines={2}>
          {capitalizarTexto(item.produto)}
        </Text>
      </View>

      {/* Unidade de saude */}
      <View style={styles.linha}>
        <Ionicons name="business-outline" size={14} color={colors.textMuted} />
        <Text style={styles.unidade} numberOfLines={1}>
          {capitalizarTexto(item.unidade)}
        </Text>
      </View>

      {/* Rodape: selo de estoque + quantidade + apresentacao */}
      <View style={styles.rodape}>
        <SeloEstoque quantidade={item.quantidade} />
        <View style={styles.rodapeDireita}>
          {item.apresentacao ? (
            <View style={styles.chip}>
              <Text style={styles.chipTexto}>{item.apresentacao}</Text>
            </View>
          ) : null}
          <Text style={styles.quantidade}>{formatarNumero(item.quantidade)} un.</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
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
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconeWrapper: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  produto: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
  },
  unidade: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  rodapeDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
  },
  chipTexto: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  quantidade: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
});
