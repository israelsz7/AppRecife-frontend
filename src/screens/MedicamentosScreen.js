/**
 * Tela de medicamentos de um distrito.
 *
 * Como a busca de texto ("q") da API do Recife so encontra palavras inteiras,
 * aqui adotamos outra estrategia: baixamos TODOS os medicamentos do distrito
 * uma unica vez e filtramos LOCALMENTE por trecho do nome. Assim:
 *   - digitar "dipi" ja encontra "DIPIRONA 500MG";
 *   - a busca funciona tanto para o medicamento quanto para a unidade de saude.
 *
 * Para manter a tela fluida, mostramos os resultados em "paginas" locais
 * (carrega mais ao rolar) em vez de renderizar milhares de itens de uma vez.
 */
import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme';
import { buscarTodosMedicamentos } from '../services/dadosRecifeApi';
import { formatarNumero, normalizarTexto } from '../utils/formatadores';
import MedicamentoCard from '../components/MedicamentoCard';
import Carregando from '../components/Carregando';
import EstadoVazio from '../components/EstadoVazio';

// Quantos itens exibir por vez (paginacao local ao rolar).
const PAGINA = 30;

export default function MedicamentosScreen({ route, navigation }) {
  const { distrito } = route.params;

  const [todos, setTodos] = useState([]); // lista completa do distrito
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [termo, setTermo] = useState('');
  const [limite, setLimite] = useState(PAGINA); // quantos resultados mostrar

  // Mostra o nome do distrito no titulo do header da navegacao.
  useEffect(() => {
    navigation.setOptions({ title: distrito.nome });
  }, [navigation, distrito]);

  // Baixa todos os medicamentos do distrito quando a tela abre.
  useEffect(() => {
    let ativo = true; // evita atualizar estado se a tela for fechada antes
    (async () => {
      try {
        setCarregando(true);
        setErro(null);
        const lista = await buscarTodosMedicamentos(distrito.resourceId);
        if (ativo) setTodos(lista);
      } catch (e) {
        if (ativo) setErro(e.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [distrito]);

  // Filtra localmente por trecho do produto, unidade ou classe (sem acento/caixa).
  const filtrados = useMemo(() => {
    const busca = normalizarTexto(termo.trim());
    if (!busca) return todos;
    return todos.filter((item) => {
      const alvo = normalizarTexto(
        `${item.produto || ''} ${item.unidade || ''} ${item.classe || ''}`
      );
      return alvo.includes(busca);
    });
  }, [todos, termo]);

  // Sempre que o termo muda, volta a exibir a primeira "pagina".
  useEffect(() => {
    setLimite(PAGINA);
  }, [termo]);

  const visiveis = filtrados.slice(0, limite);
  const podeCarregarMais = limite < filtrados.length;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Campo de busca */}
      <View style={styles.busca}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.input}
          placeholder="Buscar medicamento ou unidade..."
          placeholderTextColor={colors.textMuted}
          value={termo}
          onChangeText={setTermo}
          returnKeyType="search"
          autoCorrect={false}
        />
        {termo.length > 0 ? (
          <Pressable onPress={() => setTermo('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {/* Conteudo: carregando / erro / vazio / lista */}
      {carregando ? (
        <Carregando mensagem="Carregando medicamentos do distrito..." />
      ) : erro ? (
        <EstadoVazio
          icone="cloud-offline-outline"
          titulo="Não foi possível carregar"
          descricao={erro}
          cor={colors.perigo}
        />
      ) : filtrados.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum medicamento encontrado"
          descricao={
            termo
              ? `Nada encontrado para “${termo}”. Tente outro nome de medicamento ou unidade.`
              : 'Este distrito não retornou medicamentos.'
          }
        />
      ) : (
        <FlatList
          data={visiveis}
          keyExtractor={(item) => String(item._id)}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <Text style={styles.contador}>
              {formatarNumero(filtrados.length)} resultado(s)
              {termo ? ` para “${termo}”` : ''}
            </Text>
          }
          renderItem={({ item }) => (
            <MedicamentoCard
              item={item}
              onPress={() =>
                navigation.navigate('Detalhe', { medicamento: item, distrito })
              }
            />
          )}
          onEndReached={() => {
            // Carrega mais uma "pagina" local ao chegar perto do fim.
            if (podeCarregarMais) setLimite((atual) => atual + PAGINA);
          }}
          onEndReachedThreshold={0.5}
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
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  lista: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  contador: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
});
