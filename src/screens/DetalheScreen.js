/**
 * Tela de detalhe de um medicamento.
 *
 * Mostra todas as informacoes do item escolhido e permite "salvar" um registro
 * que RELACIONA esse medicamento com a LOCALIZACAO ATUAL do usuario. Esse e o
 * ponto onde os tres recursos se encontram:
 *   - dados da API do Recife (o medicamento),
 *   - geolocalizacao (expo-location),
 *   - backend (POST /api/registros).
 */
import { useState } from 'react';
import { ScrollView, View, Text, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, cardShadow } from '../theme';
import { capitalizarTexto, formatarNumero } from '../utils/formatadores';
import { obterLocalizacaoAtual } from '../services/locationService';
import { salvarRegistro } from '../services/backendApi';
import SeloEstoque from '../components/SeloEstoque';
import Botao from '../components/Botao';

// Linha "rotulo: valor" usada no cartao de informacoes.
function Linha({ icone, rotulo, valor }) {
  return (
    <View style={styles.linha}>
      <Ionicons name={icone} size={18} color={colors.primary} style={styles.linhaIcone} />
      <View style={styles.linhaTexto}>
        <Text style={styles.rotulo}>{rotulo}</Text>
        <Text style={styles.valor}>{valor}</Text>
      </View>
    </View>
  );
}

export default function DetalheScreen({ route }) {
  const { medicamento, distrito } = route.params;
  const [salvando, setSalvando] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState(null);

  async function salvarComLocalizacao() {
    try {
      setSalvando(true);

      // 1) Obtem a localizacao atual (pede permissao se necessario).
      const localizacao = await obterLocalizacaoAtual();

      // 2) Monta o corpo do registro (localizacao + dados do medicamento).
      const payload = {
        localizacao,
        medicamento: {
          distrito: medicamento.distrito,
          unidade: medicamento.unidade,
          produto: medicamento.produto,
          classe: medicamento.classe,
          apresentacao: medicamento.apresentacao,
          quantidade: medicamento.quantidade,
          codigoProduto: medicamento.codigo_produto,
        },
      };

      // 3) Envia para o backend (POST).
      const salvo = await salvarRegistro(payload);
      setRegistroSalvo(salvo);

      Alert.alert(
        'Registro salvo! ✅',
        'A sua localização foi associada a este medicamento. Veja na aba "Registros".'
      );
    } catch (e) {
      Alert.alert('Não foi possível salvar', e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        {/* Cartao principal com o nome e o estoque */}
        <View style={styles.cardPrincipal}>
          <View style={styles.iconeWrapper}>
            <Ionicons name="medkit" size={28} color={colors.primary} />
          </View>
          <Text style={styles.produto}>{capitalizarTexto(medicamento.produto)}</Text>
          <SeloEstoque quantidade={medicamento.quantidade} />
          <Text style={styles.quantidade}>
            {formatarNumero(medicamento.quantidade)} unidades em estoque
          </Text>
        </View>

        {/* Cartao de informacoes detalhadas */}
        <View style={styles.card}>
          <Text style={styles.tituloSecao}>Informações</Text>
          <Linha icone="business-outline" rotulo="Unidade de saúde" valor={capitalizarTexto(medicamento.unidade)} />
          <Linha icone="map-outline" rotulo="Distrito sanitário" valor={distrito.nome} />
          {medicamento.classe ? (
            <Linha icone="pricetag-outline" rotulo="Classe terapêutica" valor={capitalizarTexto(medicamento.classe)} />
          ) : null}
          {medicamento.apresentacao ? (
            <Linha icone="flask-outline" rotulo="Apresentação" valor={medicamento.apresentacao} />
          ) : null}
          {medicamento.codigo_produto ? (
            <Linha icone="barcode-outline" rotulo="Código do produto" valor={String(medicamento.codigo_produto)} />
          ) : null}
        </View>

        {/* Cartao de acao: salvar com a localizacao */}
        <View style={styles.card}>
          <Text style={styles.tituloSecao}>Salvar com a minha localização</Text>
          <Text style={styles.descricao}>
            Use o GPS do aparelho para registrar que você encontrou este medicamento.
            O registro fica salvo no backend e pode ser consultado depois.
          </Text>
          <Botao
            titulo={registroSalvo ? 'Salvar novamente' : 'Salvar com minha localização'}
            icone="location"
            carregando={salvando}
            onPress={salvarComLocalizacao}
          />

          {/* Confirmacao apos salvar */}
          {registroSalvo ? (
            <View style={styles.confirmacao}>
              <Ionicons name="checkmark-circle" size={18} color={colors.ok} />
              <Text style={styles.confirmacaoTexto}>
                Salvo em {registroSalvo.localizacao.latitude.toFixed(5)},{' '}
                {registroSalvo.localizacao.longitude.toFixed(5)}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  conteudo: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  cardPrincipal: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  iconeWrapper: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  produto: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  quantidade: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  linhaIcone: {
    marginTop: 2,
    marginRight: spacing.md,
  },
  linhaTexto: {
    flex: 1,
  },
  rotulo: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },
  valor: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  descricao: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  confirmacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    backgroundColor: colors.okBg,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  confirmacaoTexto: {
    flex: 1,
    fontSize: 13,
    color: colors.ok,
    fontWeight: '600',
  },
});
