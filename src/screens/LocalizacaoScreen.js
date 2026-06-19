/**
 * Tela de Localizacao.
 *
 * Demonstra o RASTREAMENTO DE LOCALIZACAO do usuario usando a API de
 * geolocalizacao (expo-location). Ao abrir, o app pede permissao, le as
 * coordenadas e mostra um MINI MAPA (react-native-maps) com um marcador na
 * posicao atual do usuario.
 */
import { useState, useEffect } from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import { colors, spacing, radius, cardShadow } from '../theme';
import { obterLocalizacaoAtual } from '../services/locationService';
import Cabecalho from '../components/Cabecalho';
import Botao from '../components/Botao';
import Carregando from '../components/Carregando';
import EstadoVazio from '../components/EstadoVazio';

export default function LocalizacaoScreen() {
  const [carregando, setCarregando] = useState(true);
  const [local, setLocal] = useState(null);
  const [erro, setErro] = useState(null);

  // Busca a localizacao do usuario (usada na montagem e no botao "Atualizar").
  async function buscarLocalizacao() {
    try {
      setCarregando(true);
      setErro(null);
      const resultado = await obterLocalizacaoAtual();
      setLocal(resultado);
    } catch (e) {
      setErro(e.message);
      setLocal(null);
    } finally {
      setCarregando(false);
    }
  }

  // Ao abrir a tela, ja tenta mostrar o mapa com a posicao atual.
  useEffect(() => {
    buscarLocalizacao();
  }, []);

  // Abre as coordenadas no aplicativo de mapas do aparelho.
  function abrirNoMapa() {
    if (!local) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${local.latitude},${local.longitude}`;
    Linking.openURL(url);
  }

  // Regiao exibida no mapa (deltas pequenos = mais aproximado/zoom).
  const regiao = local
    ? {
        latitude: local.latitude,
        longitude: local.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }
    : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" />
      <Cabecalho
        titulo="Minha localização"
        subtitulo="Veja no mapa onde você está agora."
      />

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
            <Botao titulo="Tentar novamente" icone="refresh" onPress={buscarLocalizacao} />
          </View>
        </View>
      ) : (
        <View style={styles.conteudo}>
          {/* Mini mapa com marcador na posicao atual */}
          <View style={styles.mapaWrapper}>
            <MapView
              style={StyleSheet.absoluteFillObject}
              region={regiao}
              showsUserLocation
              showsMyLocationButton={false}
            >
              <Marker coordinate={regiao} title="Você está aqui" />
            </MapView>
          </View>

          {/* Acoes */}
          <View style={styles.acoes}>
            <Botao titulo="Atualizar localização" icone="refresh" onPress={buscarLocalizacao} />
            <View style={{ height: spacing.md }} />
            <Botao titulo="Abrir no app de mapas" icone="map" variante="secundaria" onPress={abrirNoMapa} />
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
