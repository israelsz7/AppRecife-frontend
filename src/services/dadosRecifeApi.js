/**
 * Integracao com a API de Dados Abertos do Recife (plataforma CKAN).
 *
 * Conjunto de dados utilizado:
 *   "Estoque dos medicamentos nas farmacias da rede municipal de saude"
 *   https://dados.recife.pe.gov.br/dataset/estoque-dos-medicamentos-nas-farmacias-da-rede-municipal-de-saude
 *
 * Os dados estao divididos em 8 Distritos Sanitarios, cada um com um "recurso"
 * (resource) proprio identificado por um UUID. A consulta e feita pelo endpoint
 * "datastore_search", que aceita busca textual (q), paginacao (limit/offset) e
 * retorna os campos: distrito, unidade, classe, apresentacao, produto, quantidade...
 */

const BASE_URL = 'https://dados.recife.pe.gov.br/api/3/action/datastore_search';

// Lista dos 8 Distritos Sanitarios, com a regiao, alguns bairros que cada um
// abrange e o respectivo resource_id do portal de dados.
export const DISTRITOS = [
  {
    numero: 1,
    nome: 'Distrito Sanitário 1',
    regiao: 'Centro',
    bairros: 'Boa Vista, Santo Amaro, Santo Antônio e Coelhos',
    resourceId: '537f0b95-4eb7-4912-9d7c-32caf9fd68ac',
  },
  {
    numero: 2,
    nome: 'Distrito Sanitário 2',
    regiao: 'Zona Norte',
    bairros: 'Beberibe, Arruda, Campo Grande e Cajueiro',
    resourceId: '30e87813-b5a3-4cbd-b35e-b09156f52698',
  },
  {
    numero: 3,
    nome: 'Distrito Sanitário 3',
    regiao: 'Noroeste',
    bairros: 'Casa Amarela, Casa Forte e Jaqueira',
    resourceId: '832ae42d-0163-45e8-82c1-a4e00a5ec1b6',
  },
  {
    numero: 4,
    nome: 'Distrito Sanitário 4',
    regiao: 'Oeste',
    bairros: 'Madalena, Cordeiro e Iputinga',
    resourceId: 'a4d419a8-4355-4ae9-b116-9cc35b914f50',
  },
  {
    numero: 5,
    nome: 'Distrito Sanitário 5',
    regiao: 'Sudoeste',
    bairros: 'Afogados, San Martin e Mustardinha',
    resourceId: '77040c32-2a39-4416-ba93-5c7386b46dcb',
  },
  {
    numero: 6,
    nome: 'Distrito Sanitário 6',
    regiao: 'Zona Sul',
    bairros: 'Boa Viagem, Pina e Imbiribeira',
    resourceId: 'ac869f94-a655-4388-871b-9957b0a642a4',
  },
  {
    numero: 7,
    nome: 'Distrito Sanitário 7',
    regiao: 'Norte',
    bairros: 'Nova Descoberta e Macaxeira',
    resourceId: '97109f18-a189-4084-acaf-b3aff6e65d51',
  },
  {
    numero: 8,
    nome: 'Distrito Sanitário 8',
    regiao: 'Extremo Oeste',
    bairros: 'Várzea, Caxangá e Barro',
    resourceId: '2e411ebc-0bef-4e03-ae34-2b792b5468c2',
  },
];

/**
 * Busca medicamentos de um distrito.
 *
 * @param {object} opcoes
 * @param {string} opcoes.resourceId - UUID do distrito (ver DISTRITOS)
 * @param {string} [opcoes.termo]    - texto para filtrar (nome do remedio, unidade...)
 * @param {number} [opcoes.limit]    - quantos registros trazer por pagina
 * @param {number} [opcoes.offset]   - a partir de qual registro (paginacao)
 * @returns {Promise<{registros: Array, total: number}>}
 */
export async function buscarMedicamentos({ resourceId, termo = '', limit = 40, offset = 0 }) {
  const params = new URLSearchParams({
    resource_id: resourceId,
    limit: String(limit),
    offset: String(offset),
  });

  // "q" faz busca textual em todas as colunas (produto, unidade, classe...).
  if (termo.trim()) {
    params.append('q', termo.trim());
  }

  const url = `${BASE_URL}?${params.toString()}`;
  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} ao consultar a API do Recife.`);
  }

  const json = await resposta.json();
  if (!json.success) {
    throw new Error('A API do Recife retornou uma resposta de erro.');
  }

  return {
    registros: json.result.records,
    total: json.result.total,
  };
}

// O servidor do Recife limita cada requisicao a no maximo 500 registros.
const LIMITE_POR_PAGINA = 500;

/**
 * Baixa TODOS os medicamentos de um distrito.
 *
 * Como a API limita 500 itens por requisicao, fazemos a 1a pagina para
 * descobrir o total e, em seguida, buscamos as demais paginas em paralelo.
 * Trazer tudo de uma vez permite que a BUSCA seja feita localmente (por trecho
 * do nome), ja que o parametro "q" da API so encontra palavras inteiras.
 *
 * @param {string} resourceId - UUID do distrito
 * @returns {Promise<Array>} lista completa de medicamentos do distrito
 */
export async function buscarTodosMedicamentos(resourceId) {
  // 1) Primeira pagina: ja descobre o total de registros do distrito.
  const primeira = await buscarMedicamentos({
    resourceId,
    limit: LIMITE_POR_PAGINA,
    offset: 0,
  });

  let registros = primeira.registros;
  const total = primeira.total;

  // 2) Busca as paginas restantes em paralelo (offsets 500, 1000, 1500...).
  if (total > LIMITE_POR_PAGINA) {
    const promessas = [];
    for (let offset = LIMITE_POR_PAGINA; offset < total; offset += LIMITE_POR_PAGINA) {
      promessas.push(
        buscarMedicamentos({ resourceId, limit: LIMITE_POR_PAGINA, offset })
      );
    }
    const paginas = await Promise.all(promessas);
    paginas.forEach((pagina) => {
      registros = registros.concat(pagina.registros);
    });
  }

  return registros;
}
