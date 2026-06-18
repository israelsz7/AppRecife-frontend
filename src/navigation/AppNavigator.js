/**
 * Configuracao da navegacao do app (react-navigation).
 *
 * Estrutura:
 *   - Abas inferiores (Bottom Tabs):
 *       1) "Medicamentos" -> Stack: Distritos -> Medicamentos -> Detalhe
 *       2) "Localização"  -> tela de GPS
 *       3) "Registros"    -> dados salvos no backend
 */
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import MedicamentosScreen from '../screens/MedicamentosScreen';
import DetalheScreen from '../screens/DetalheScreen';
import LocalizacaoScreen from '../screens/LocalizacaoScreen';
import RegistrosScreen from '../screens/RegistrosScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tema de navegacao com o fundo claro do app.
const tema = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

// Aparencia padrao do header nativo nas telas internas.
const headerPadrao = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.primary,
  headerTitleStyle: { color: colors.text, fontWeight: '700' },
  headerShadowVisible: false,
};

// Pilha de telas do fluxo de medicamentos (1a aba).
function MedicamentosStack() {
  return (
    <Stack.Navigator screenOptions={headerPadrao}>
      <Stack.Screen name="Distritos" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Medicamentos" component={MedicamentosScreen} options={{ title: 'Medicamentos' }} />
      <Stack.Screen name="Detalhe" component={DetalheScreen} options={{ title: 'Detalhes' }} />
    </Stack.Navigator>
  );
}

// Icone de cada aba.
const ICONES = {
  Inicio: 'medical',
  Localizacao: 'location',
  Registros: 'bookmarks',
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={tema}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={ICONES[route.name]} size={size} color={color} />
          ),
        })}
      >
        <Tab.Screen name="Inicio" component={MedicamentosStack} options={{ title: 'Medicamentos' }} />
        <Tab.Screen name="Localizacao" component={LocalizacaoScreen} options={{ title: 'Localização' }} />
        <Tab.Screen name="Registros" component={RegistrosScreen} options={{ title: 'Registros' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
