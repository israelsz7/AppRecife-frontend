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
import { useState, useLayoutEffect } from 'react';
import { ScrollView, View, Text, Alert, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { colors, spacing, radius, cardShadow } from '../theme';
import { capitalizarTexto, formatarNumero } from '../utils/formatadores';
import { obterLocalizacaoAtual } from '../services/locationService';
import { salvarRegistro, removerRegistro } from '../services/backendApi';
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

export default function DetalheScreen({ route, navigation }) {
  // `somenteLeitura` vem da aba "Salvos": o item ja foi salvo, entao
  // escondemos o icone de salvar e mostramos apenas os detalhes.
  const { medicamento, distrito, somenteLeitura = false } = route.params;
  const [salvando, setSalvando] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState(null);
  const [copiado, setCopiado] = useState(false);

  // Copia o nome da unidade de saude para a area de transferencia.
  async function copiarUnidade() {
    await Clipboard.setStringAsync(medicamento.unidade);
    setCopiado(true);
    // Volta o botao ao estado normal depois de 2 segundos.
    setTimeout(() => setCopiado(false), 2000);
  }

  // Alterna o estado de salvo: se ainda nao esta salvo, salva (POST);
  // se ja esta salvo, remove dos salvos (DELETE).
  async function alternarSalvar() {
    // --- Ja esta salvo: remover dos salvos ---
    if (registroSalvo) {
      try {
        setSalvando(true);
        await removerRegistro(registroSalvo.id);
        setRegistroSalvo(null);
        Alert.alert('Removido', `"${capitalizarTexto(medicamento.produto)}" saiu da aba Salvos.`);
      } catch (e) {
        Alert.alert('Não foi possível remover', e.message);
      } finally {
        setSalvando(false);
      }
      return;
    }

    // --- Ainda nao esta salvo: salvar com a localizacao atual ---
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
        'Salvo na aba Salvos',
        `"${capitalizarTexto(medicamento.produto)}" foi salvo junto com a sua localização atual.`
      );
    } catch (e) {
      Alert.alert('Não foi possível salvar', e.message);
    } finally {
      setSalvando(false);
    }
  }

  // Configura o header desta tela: fundo na cor primaria e, do lado direito,
  // um icone que ALTERNA o estado de salvo. Branco (contorno) = nao salvo;
  // dourado (preenchido) = salvo. Tocar quando ja esta salvo remove dos salvos.
  // No modo somente leitura (aberto a partir de Salvos) o icone nao aparece.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: colors.textOnPrimary,
      headerTitleStyle: { color: colors.textOnPrimary, fontWeight: '700' },
      headerShadowVisible: false,
      headerRight: somenteLeitura
        ? undefined
        : () =>
            salvando ? (
              <ActivityIndicator color={colors.textOnPrimary} style={styles.iconeHeader} />
            ) : (
              <Pressable onPress={alternarSalvar} hitSlop={12} style={styles.iconeHeader}>
                <Ionicons
                  name={registroSalvo ? 'bookmark' : 'bookmark-outline'}
                  size={24}
                  color={registroSalvo ? '#FACC15' : colors.textOnPrimary}
                />
              </Pressable>
            ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, salvando, registroSalvo, somenteLeitura]);

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

          {/* Botao para copiar o nome da unidade de saude */}
          <Botao
            titulo={copiado ? 'Nome copiado!' : 'Copiar nome da unidade'}
            icone={copiado ? 'checkmark' : 'copy-outline'}
            variante="secundaria"
            onPress={copiarUnidade}
          />
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
  iconeHeader: {
    marginRight: spacing.sm,
  },
});
