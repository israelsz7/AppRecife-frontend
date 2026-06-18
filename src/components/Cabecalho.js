/**
 * Cabecalho simples para o topo das telas que nao usam o header nativo da
 * navegacao (abas de Localizacao e Registros). Mostra um titulo e um subtitulo.
 */
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export default function Cabecalho({ titulo, subtitulo }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
});
