/**
 * Servico de localizacao (GPS) usando a biblioteca expo-location.
 *
 * Encapsula o pedido de permissao e a leitura das coordenadas para que as
 * telas nao precisem lidar diretamente com a API de geolocalizacao.
 */
import * as Location from 'expo-location';

/**
 * Solicita permissao e retorna a localizacao atual do dispositivo.
 * @returns {Promise<{latitude:number, longitude:number, precisao:number|null}>}
 * @throws {Error} se a permissao for negada
 */
export async function obterLocalizacaoAtual() {
  // 1) Pede a permissao de uso da localizacao em primeiro plano.
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error(
      'Permissão de localização negada. Habilite o acesso ao GPS para usar este recurso.'
    );
  }

  // 2) Le a posicao atual com alta precisao.
  const posicao = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: posicao.coords.latitude,
    longitude: posicao.coords.longitude,
    precisao: posicao.coords.accuracy, // em metros (pode ser null em alguns aparelhos)
  };
}
