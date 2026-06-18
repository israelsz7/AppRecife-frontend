/**
 * Indicador de carregamento centralizado, com mensagem opcional.
 */
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export default function Carregando({ mensagem = 'Carregando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  mensagem: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: 14,
  },
});
