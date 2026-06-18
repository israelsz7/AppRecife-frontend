/**
 * Componente para estados "vazios" ou de erro: mostra um icone, um titulo e
 * uma descricao. Usado quando uma lista nao tem resultados ou uma chamada
 * de rede falha.
 */
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

export default function EstadoVazio({
  icone = 'search-outline',
  titulo = 'Nada por aqui',
  descricao = '',
  cor = colors.textMuted,
}) {
  return (
    <View style={styles.container}>
      <Ionicons name={icone} size={56} color={cor} />
      <Text style={styles.titulo}>{titulo}</Text>
      {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  titulo: {
    marginTop: spacing.md,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  descricao: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
