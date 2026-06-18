/**
 * Tela inicial: lista os 8 Distritos Sanitarios do Recife.
 *
 * Ao tocar em um distrito, o usuario navega para a tela de medicamentos
 * daquele distrito. No topo ha um "hero" explicando o app.
 */
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme';
import { DISTRITOS } from '../services/dadosRecifeApi';
import DistritoCard from '../components/DistritoCard';

// Cabecalho "hero" exibido acima da lista.
function Hero() {
  return (
    <View>
      <View style={styles.hero}>
        <View style={styles.heroIcone}>
          <Ionicons name="medical" size={26} color={colors.textOnPrimary} />
        </View>
        <Text style={styles.heroTitulo}>Medicamentos da Rede Municipal</Text>
        <Text style={styles.heroSubtitulo}>
          Consulte o estoque de medicamentos nas farmácias das unidades de saúde
          da cidade do Recife.
        </Text>
      </View>
      <Text style={styles.secao}>Distritos Sanitários</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" />
      <FlatList
        data={DISTRITOS}
        keyExtractor={(d) => String(d.numero)}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={<Hero />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <DistritoCard
            distrito={item}
            onPress={() => navigation.navigate('Medicamentos', { distrito: item })}
          />
        )}
      />
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
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  heroIcone: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitulo: {
    color: colors.textOnPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  heroSubtitulo: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  secao: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
});
