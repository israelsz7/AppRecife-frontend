/**
 * Configuracao de enderecos das APIs usadas pelo app.
 *
 * O ponto mais delicado e o endereco do NOSSO backend (AppRecife-backend):
 * quando o app roda no Expo Go em um CELULAR FISICO, "localhost" apontaria
 * para o proprio celular, e nao para o PC onde o backend esta rodando.
 *
 * Para resolver isso automaticamente, descobrimos o IP da maquina de
 * desenvolvimento a partir das informacoes que o Expo ja conhece
 * (Constants.expoConfig.hostUri, algo como "192.168.0.10:8081"). Assim, o
 * mesmo IP usado pelo Metro/Expo e reaproveitado para falar com o backend.
 */
import Constants from 'expo-constants';

// Porta em que o backend (AppRecife-backend) esta escutando.
const PORTA_BACKEND = 3000;

function descobrirHostDoBackend() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    '';
  const host = hostUri.split(':')[0];
  return host || 'localhost';
}

// Caso queira fixar o endereco manualmente, basta definir
// "expo.extra.backendUrl" no app.json — esse valor tem prioridade.
const override = Constants.expoConfig?.extra?.backendUrl;

export const BACKEND_URL = override || `http://${descobrirHostDoBackend()}:${PORTA_BACKEND}`;
