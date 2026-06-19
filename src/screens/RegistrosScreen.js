/**
 * Tela de Registros.
 *
 * Exibe os dados que foram PERSISTIDOS NO BACKEND (GET /api/registros): cada
 * registro associa a localizacao do usuario a um medicamento consultado.
 * Recarrega automaticamente sempre que a aba ganha foco e suporta "puxar para
 * atualizar" e excluir um registro.
 */
import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Alert, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, cardShadow } from '../theme';
import { capitalizarTexto, formatarData, formatarNumero } from '../utils/formatadores';
import { listarRegistros, removerRegistro, BACKEND_URL } from '../services/backendApi';
import Cabecalho from '../components/Cabecalho';
import Carregando from '../components/Carregando';
import EstadoVazio from '../components/EstadoVazio';

// Card de um registro salvo.
function RegistroCard({ registro, onExcluir, onAbrir }) {
  const { localizacao, medicamento } = registro;
  return (
    <Pressable
      onPress={onAbrir}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressionado]}
    >
      <View style={styles.topo}>
        <View style={styles.iconeWrapper}>
          <Ionicons name="bookmark" size={16} color={colors.primary} />
        </View>
        <Text style={styles.produto} numberOfLines={2}>
          {capitalizarTexto(medicamento.produto)}
        </Text>
        <Pressable onPress={onExcluir} hitSlop={8}>
          <Ionicons name="trash-outline" size={20} color={colors.perigo} />
        </Pressable>
      </View>

      <View style={styles.linha}>
        <Ionicons name="business-outline" size={14} color={colors.textMuted} />
        <Text style={styles.linhaTexto} numberOfLines={1}>
          {capitalizarTexto(medicamento.unidade)}
        </Text>
      </View>

      <View style={styles.linha}>
        <Ionicons name="location-outline" size={14} color={colors.textMuted} />
        <Text style={styles.linhaTexto}>
          {localizacao.latitude.toFixed(5)}, {localizacao.longitude.toFixed(5)}
        </Text>
      </View>

      <View style={styles.rodape}>
        <Text style={styles.estoque}>
          {medicamento.quantidade != null
            ? `${formatarNumero(medicamento.quantidade)} un. em estoque`
            : 'Estoque não informado'}
        </Text>
        <Text style={styles.data}>{formatarData(registro.criadoEm)}</Text>
      </View>
    </Pressable>
  );
}

export default function RegistrosScreen({ navigation }) {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async (ehRefresh = false) => {
    try {
      if (ehRefresh) setAtualizando(true);
      else setCarregando(true);
      setErro(null);
      const lista = await listarRegistros();
      setRegistros(lista);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  // Recarrega toda vez que a aba "Registros" entra em foco.
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  // Abre a tela de detalhes (somente leitura) com os dados do registro salvo.
  // Convertemos do formato salvo no backend para o formato esperado pela
  // tela de detalhe (que originalmente recebe dados crus da API do Recife).
  function abrirDetalhe(registro) {
    const m = registro.medicamento;
    navigation.navigate('Detalhe', {
      somenteLeitura: true,
      distrito: { nome: m.distrito != null ? `Distrito Sanitário ${m.distrito}` : 'Distrito não informado' },
      medicamento: {
        produto: m.produto,
        unidade: m.unidade,
        classe: m.classe,
        apresentacao: m.apresentacao,
        quantidade: m.quantidade,
        codigo_produto: m.codigoProduto,
        distrito: m.distrito,
      },
    });
  }

  function confirmarExclusao(registro) {
    Alert.alert('Excluir registro', 'Deseja remover este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await removerRegistro(registro.id);
            setRegistros((atual) => atual.filter((r) => r.id !== registro.id));
          } catch (e) {
            Alert.alert('Erro', e.message);
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" />
      <Cabecalho
        titulo="Salvos"
        subtitulo="Medicamentos que você salvou junto com a sua localização."
      />

      {carregando ? (
        <Carregando mensagem="Carregando registros..." />
      ) : erro ? (
        <EstadoVazio
          icone="cloud-offline-outline"
          titulo="Backend indisponível"
          descricao={`${erro}\n\nVerifique se o servidor está rodando em:\n${BACKEND_URL}`}
          cor={colors.perigo}
        />
      ) : (
        <FlatList
          data={registros}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => carregar(true)}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <EstadoVazio
              icone="bookmarks-outline"
              titulo="Nenhum registro ainda"
              descricao="Abra um medicamento e toque em “Salvar” para criar o primeiro registro."
            />
          }
          renderItem={({ item }) => (
            <RegistroCard
              registro={item}
              onAbrir={() => abrirDetalhe(item)}
              onExcluir={() => confirmarExclusao(item)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  lista: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  cardPressionado: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconeWrapper: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
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
    marginTop: spacing.sm,
  },
  linhaTexto: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  estoque: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  data: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
