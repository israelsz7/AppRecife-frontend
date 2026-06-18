/**
 * Tela de Localizacao.
 *
 * Demonstra o RASTREAMENTO DE LOCALIZACAO do usuario usando a API de
 * geolocalizacao (expo-location). Ao tocar no botao, o app pede permissao,
 * le as coordenadas e as exibe. Tambem permite abrir o ponto no app de mapas.
 */
import { useState } from 'react';
import { ScrollView, View, Text, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, cardShadow } from '../theme';
import { obterLocalizacaoAtual } from '../services/locationService';
import { formatarData } from '../utils/formatadores';
import Cabecalho from '../components/Cabecalho';
import Botao from '../components/Botao';
import EstadoVazio from '../components/EstadoVazio';

// Bloco que mostra um valor de coordenada com rotulo.
function Coordenada({ icone, rotulo, valor }) {
  return (
    <View style={styles.coord}>
      <Ionicons name={icone} size={20} color={colors.primary} />
      <View style={{ marginLeft: spacing.md }}>
        <Text style={styles.coordRotulo}>{rotulo}</Text>
        <Text style={styles.coordValor}>{valor}</Text>
      </View>
    </View>
  );
}

export default function LocalizacaoScreen() {
  const [carregando, setCarregando] = useState(false);
  const [local, setLocal] = useState(null);
  const [erro, setErro] = useState(null);
  const [atualizadoEm, setAtualizadoEm] = useState(null);

  async function buscarLocalizacao() {
    try {
      setCarregando(true);
      setErro(null);
      const resultado = await obterLocalizacaoAtual();
      setLocal(resultado);
      setAtualizadoEm(new Date().toISOString());
    } catch (e) {
      setErro(e.message);
      setLocal(null);
    } finally {
      setCarregando(false);
    }
  }

  // Abre as coordenadas no aplicativo de mapas do aparelho.
  function abrirNoMapa() {
    if (!local) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${local.latitude},${local.longitude}`;
    Linking.openURL(url);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <Cabecalho
          titulo="Minha localização"
          subtitulo="Use o GPS do aparelho para obter as suas coordenadas atuais."
        />

        <View style={styles.cardAcao}>
          <Botao
            titulo="Obter minha localização"
            icone="navigate"
            carregando={carregando}
            onPress={buscarLocalizacao}
          />
        </View>

        {/* Resultado */}
        {erro ? (
          <EstadoVazio
            icone="warning-outline"
            titulo="Não foi possível obter a localização"
            descricao={erro}
            cor={colors.perigo}
          />
        ) : local ? (
          <View style={styles.card}>
            <Coordenada icone="location" rotulo="Latitude" valor={local.latitude.toFixed(6)} />
            <View style={styles.divisor} />
            <Coordenada icone="location-outline" rotulo="Longitude" valor={local.longitude.toFixed(6)} />
            <View style={styles.divisor} />
            <Coordenada
              icone="speedometer-outline"
              rotulo="Precisão aproximada"
              valor={local.precisao != null ? `${local.precisao.toFixed(0)} metros` : 'Indisponível'}
            />
            {atualizadoEm ? (
              <Text style={styles.atualizado}>Atualizado em {formatarData(atualizadoEm)}</Text>
            ) : null}

            <View style={{ marginTop: spacing.lg }}>
              <Botao
                titulo="Ver no mapa"
                icone="map"
                variante="secundaria"
                onPress={abrirNoMapa}
              />
            </View>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="map-outline" size={56} color={colors.textMuted} />
            <Text style={styles.placeholderTexto}>
              Toque no botão acima para descobrir onde você está.
            </Text>
          </View>
        )}
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
    paddingBottom: spacing.xxl,
  },
  cardAcao: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  coord: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  coordRotulo: {
    fontSize: 12,
    color: colors.textMuted,
  },
  coordValor: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  divisor: {
    height: 1,
    backgroundColor: colors.border,
  },
  atualizado: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  placeholder: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  placeholderTexto: {
    marginTop: spacing.md,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});
