/**
 * Componente raiz do AppRecife.
 *
 * Apenas envolve a navegacao com o SafeAreaProvider (necessario para respeitar
 * as areas seguras do aparelho, como o "notch"). Toda a logica de navegacao
 * fica em src/navigation/AppNavigator.js.
 */
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
