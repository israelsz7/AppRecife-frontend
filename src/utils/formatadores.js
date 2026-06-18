/**
 * Funcoes utilitarias de formatacao e classificacao usadas nas telas.
 */

// Formata numeros com separador de milhar pt-BR (ex.: 2370 -> "2.370").
export function formatarNumero(valor) {
  if (valor == null || Number.isNaN(Number(valor))) return '—';
  return Number(valor).toLocaleString('pt-BR');
}

/**
 * Classifica a quantidade em estoque para exibir um selo colorido.
 * Regras simples: 0 = sem estoque, ate 50 = baixo, acima disso = disponivel.
 */
export function statusEstoque(quantidade) {
  const q = Number(quantidade);
  if (quantidade == null || Number.isNaN(q)) {
    return { label: 'Sem informação', tipo: 'neutro' };
  }
  if (q <= 0) return { label: 'Sem estoque', tipo: 'perigo' };
  if (q <= 50) return { label: 'Estoque baixo', tipo: 'alerta' };
  return { label: 'Disponível', tipo: 'ok' };
}

// Formata uma data ISO para algo legivel em pt-BR.
export function formatarData(iso) {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(iso);
  }
}

// Converte textos "TODOS EM MAIUSCULAS" para uma forma mais legivel
// (primeira letra de cada palavra em maiuscula).
export function capitalizarTexto(texto = '') {
  return String(texto)
    .toLowerCase()
    .split(' ')
    .map((parte) => (parte ? parte.charAt(0).toUpperCase() + parte.slice(1) : parte))
    .join(' ');
}

/**
 * Normaliza um texto para busca: deixa minusculo e remove acentos.
 * Assim "DIPIRONA", "dipirona" e uma busca por "dipi" se encontram, e
 * "ANALGÉSICO" casa com "analgesico". Evitamos String.normalize() porque o
 * motor Hermes (React Native) nem sempre o suporta — usamos substituicao direta.
 */
export function normalizarTexto(texto = '') {
  return String(texto)
    .toLowerCase()
    .replace(/[àáâãä]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n');
}
