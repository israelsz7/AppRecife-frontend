/**
 * Integracao com o NOSSO backend (AppRecife-backend).
 *
 * Aqui ficam as chamadas HTTP para salvar e listar os "registros" que
 * relacionam a localizacao do usuario com um medicamento consultado.
 * O endereco base (BACKEND_URL) e resolvido em src/config.js.
 */
import { BACKEND_URL } from '../config';

/**
 * POST /api/registros — salva um registro (localizacao + medicamento).
 * @param {object} payload - { localizacao, medicamento }
 * @returns {Promise<object>} registro salvo (com id e criadoEm)
 */
export async function salvarRegistro(payload) {
  const resposta = await fetch(`${BACKEND_URL}/api/registros`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(json.erro || 'Falha ao salvar o registro no backend.');
  }
  return json;
}

/**
 * GET /api/registros — lista todos os registros salvos.
 * @returns {Promise<Array>} lista de registros
 */
export async function listarRegistros() {
  const resposta = await fetch(`${BACKEND_URL}/api/registros`);
  if (!resposta.ok) {
    throw new Error('Falha ao carregar os registros do backend.');
  }
  const json = await resposta.json();
  return json.registros || [];
}

/**
 * DELETE /api/registros/:id — remove um registro.
 * @param {string} id
 */
export async function removerRegistro(id) {
  const resposta = await fetch(`${BACKEND_URL}/api/registros/${id}`, {
    method: 'DELETE',
  });
  if (!resposta.ok && resposta.status !== 204) {
    throw new Error('Falha ao remover o registro.');
  }
}

// Exporta a URL base para que telas possam exibi-la (ex.: tela de registros).
export { BACKEND_URL };
