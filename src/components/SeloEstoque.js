/**
 * Selo (badge) colorido que indica a situacao do estoque de um medicamento.
 * A cor vem da funcao statusEstoque() em utils/formatadores.
 */
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';
import { statusEstoque } from '../utils/formatadores';

// Mapeia o "tipo" devolvido por statusEstoque para um par de cores (fundo/texto).
const CORES = {
  ok: { fundo: colors.okBg, texto: colors.ok },
  alerta: { fundo: colors.alertaBg, texto: colors.alerta },
  perigo: { fundo: colors.perigoBg, texto: colors.perigo },
  neutro: { fundo: colors.neutroBg, texto: colors.neutro },
};

export default function SeloEstoque({ quantidade }) {
  const { label, tipo } = statusEstoque(quantidade);
  const cor = CORES[tipo] || CORES.neutro;

  return (
    <View style={[styles.selo, { backgroundColor: cor.fundo }]}>
      <View style={[styles.ponto, { backgroundColor: cor.texto }]} />
      <Text style={[styles.texto, { color: cor.texto }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    gap: 6,
  },
  ponto: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  texto: {
    fontSize: 12,
    fontWeight: '700',
  },
});
