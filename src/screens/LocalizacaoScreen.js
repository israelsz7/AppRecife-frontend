/**
 * Tela de Localizacao.
 *
 * Demonstra o RASTREAMENTO DE LOCALIZACAO do usuario (expo-location) exibindo
 * um mini mapa (react-native-maps) com a posicao atual. Acima do mapa ha uma
 * barra de pesquisa: ao digitar o nome de uma unidade de saude, o app usa
 * geocodificacao para encontrar o endereco e mover o marcador ate ela.
 */
import { useState, useEffect, useRef } from 'react';
import { View, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, cardShadow } from '../theme';
import { obterLocalizacaoAtual, geocodificarEndereco } from '../services/locationService';
import Cabecalho from '../components/Cabecalho';
import Botao from '../components/Botao';
import Carregando from '../components/Carregando';
import EstadoVazio from '../components/EstadoVazio';

// Quanto de area o mapa mostra (deltas menores = mais zoom).
const DELTA = 0.01;

export default function LocalizacaoScreen() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [minhaLocal, setMinhaLocal] = useState(null); // posicao do usuario
  const [marcador, setMarcador] = useState(null); // ponto exibido no mapa
  const [termo, setTermo] = useState('');
  const [buscando, setBuscando] = useState(false);
  const mapRef = useRef(null);

  // Busca a localizacao do usuario ao abrir a tela.
  async function carregarMinhaLocalizacao() {
    try {
      setCarregando(true);
      setErro(null);
      const atual = await obterLocalizacaoAtual();
      setMinhaLocal(atual);
      setMarcador({ latitude: atual.latitude, longitude: atual.longitude, titulo: 'Você está aqui' });
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarMinhaLocalizacao();
  }, []);

  // Pesquisa uma unidade de saude pelo nome e move o mapa ate ela.
  async function buscarUnidade() {
    const texto = termo.trim();
    if (!texto) return;
    try {
      setBuscando(true);
      const ponto = await geocodificarEndereco(texto);
      if (!ponto) {
        Alert.alert(
          'Não encontrado',
          `Não foi possível localizar "${texto}". Tente um nome mais completo ou inclua o bairro.`
        );
        return;
      }
      setMarcador({ ...ponto, titulo: texto });
      mapRef.current?.animateToRegion(
        { ...ponto, latitudeDelta: DELTA, longitudeDelta: DELTA },
        700
      );
    } catch (e) {
      Alert.alert('Erro na busca', e.message);
    } finally {
      setBuscando(false);
    }
  }

  // Recentraliza o mapa na posicao do usuario.
  function voltarParaMinhaLocal() {
    if (!minhaLocal) return;
    setMarcador({
      latitude: minhaLocal.latitude,
      longitude: minhaLocal.longitude,
      titulo: 'Você está aqui',
    });
    mapRef.current?.animateToRegion(
      {
        latitude: minhaLocal.latitude,
        longitude: minhaLocal.longitude,
        latitudeDelta: DELTA,
        longitudeDelta: DELTA,
      },
      700
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" />
      <Cabecalho
        titulo="Minha localização"
        subtitulo="Pesquise uma unidade de saúde ou veja onde você está."
      />

      {/* Barra de pesquisa (acima do mapa) */}
      <View style={styles.busca}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.input}
          placeholder="Pesquisar unidade de saúde..."
          placeholderTextColor={colors.textMuted}
          value={termo}
          onChangeText={setTermo}
          onSubmitEditing={buscarUnidade}
          returnKeyType="search"
          autoCorrect={false}
        />
        {termo.length > 0 ? (
          <Pressable onPress={() => setTermo('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
        <Pressable onPress={buscarUnidade} hitSlop={8} disabled={buscando}>
          <Ionicons
            name="arrow-forward-circle"
            size={26}
            color={buscando ? colors.textMuted : colors.primary}
          />
        </Pressable>
      </View>

      {/* Conteudo: carregando / erro / mapa */}
      {carregando ? (
        <Carregando mensagem="Obtendo sua localização..." />
      ) : erro ? (
        <View style={styles.centro}>
          <EstadoVazio
            icone="warning-outline"
            titulo="Não foi possível obter a localização"
            descricao={erro}
            cor={colors.perigo}
          />
          <View style={styles.acaoErro}>
            <Botao titulo="Tentar novamente" icone="refresh" onPress={carregarMinhaLocalizacao} />
          </View>
        </View>
      ) : (
        <View style={styles.conteudo}>
          <View style={styles.mapaWrapper}>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude: minhaLocal.latitude,
                longitude: minhaLocal.longitude,
                latitudeDelta: DELTA,
                longitudeDelta: DELTA,
              }}
              showsUserLocation
              showsMyLocationButton={false}
            >
              {marcador ? (
                <Marker coordinate={marcador} title={marcador.titulo} />
              ) : null}
            </MapView>
          </View>

          <View style={styles.acoes}>
            <Botao
              titulo="Minha localização"
              icone="locate"
              variante="secundaria"
              onPress={voltarParaMinhaLocal}
            />
          </View>
        </View>
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
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  mapaWrapper: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  acoes: {
    marginTop: spacing.lg,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
  },
  acaoErro: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
});
