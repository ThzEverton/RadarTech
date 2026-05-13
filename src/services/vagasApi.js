import axios from 'axios';

const BASE_URL = 'https://apibr.com/vagas/api/v2';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function normalizarTexto(valor = '') {
  return String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function extrairEmpresa(titulo = '', vaga = {}) {
  const matchNa = titulo.match(/\sna\s(.+)$/i);
  const matchArroba = titulo.match(/\s@\s?(.+)$/i);
  const empresa = matchNa?.[1] || matchArroba?.[1];

  if (empresa) return empresa.trim();

  return (
    vaga.user?.name ||
    vaga.user?.login ||
    vaga.repository?.organization?.login ||
    vaga.repository?.full_name ||
    'Empresa nao informada'
  );
}

function extrairLocal(vaga = {}) {
  const nomes = [
    ...(vaga.keywords || []),
    ...(vaga.labels || []).map((label) => label.name),
  ];

  const remoto = nomes.find((nome) => normalizarTexto(nome).includes('remoto'));
  if (remoto) return 'Remoto';

  const hibrido = nomes.find((nome) => normalizarTexto(nome).includes('hibrido'));
  if (hibrido) return 'Hibrido';

  const brasil = nomes.find((nome) => normalizarTexto(nome).includes('brasil'));
  if (brasil) return 'Brasil';

  return vaga.keywords?.[0] || 'Brasil';
}

function extrairTipo(vaga = {}) {
  const labels = (vaga.labels || []).map((label) => label.name);
  const contrato = labels.find((label) => ['clt', 'pj', 'estagio', 'freela'].includes(normalizarTexto(label)));
  return contrato || 'Nao informado';
}

function extrairSalario(vaga = {}) {
  const labels = (vaga.labels || []).map((label) => label.name);
  const labelSalario = labels.find((label) => label.includes('k') || label.includes('R$') || label.includes('$'));
  return labelSalario || '';
}

function normalizarVaga(vaga) {
  const labels = (vaga.labels || []).map((label) => label.name);
  const keywords = vaga.keywords || [];
  const descricao = vaga.body || vaga.repository?.description || '';

  return {
    id: vaga.id,
    title: vaga.title,
    company_name: extrairEmpresa(vaga.title, vaga),
    candidate_required_location: extrairLocal(vaga),
    job_type: extrairTipo(vaga),
    category: vaga.repository?.full_name || 'Vagas Brasil',
    salary: extrairSalario(vaga),
    description: descricao,
    tags: [...new Set([...labels, ...keywords])],
    url: vaga.url,
    publication_date: vaga.created_at,
    source: 'API BR Vagas',
  };
}

function aplicarFiltrosLocais(vagas, filtros = {}) {
  let resultado = vagas;

  if (filtros.nivel) {
    const nivelMap = {
      Junior: ['junior', 'jr', 'estagio', 'trainee'],
      Pleno: ['pleno', 'mid'],
      Senior: ['senior', 'sr', 'lead', 'staff'],
    };

    const palavras = nivelMap[filtros.nivel] || [];
    resultado = resultado.filter((vaga) => {
      const texto = normalizarTexto(`${vaga.title} ${vaga.description} ${vaga.tags.join(' ')}`);
      return palavras.some((palavra) => texto.includes(palavra));
    });
  }

  if (filtros.tipo) {
    const tipo = normalizarTexto(filtros.tipo);
    resultado = resultado.filter((vaga) => {
      const texto = normalizarTexto(`${vaga.title} ${vaga.description} ${vaga.candidate_required_location} ${vaga.tags.join(' ')}`);

      if (tipo === 'remoto') return texto.includes('remoto') || texto.includes('remote');
      if (tipo === 'presencial') return texto.includes('presencial') || texto.includes('hibrido') || texto.includes('onsite');
      return true;
    });
  }

  return resultado;
}

async function buscarIssues(params = {}) {
  const { data } = await api.get('/issues', {
    params: {
      page: 1,
      per_page: 50,
      includeBody: true,
      ...params,
    },
  });

  return Array.isArray(data) ? data : data.value || [];
}

export async function buscarVagas(filtros = {}) {
  const params = {};

  if (filtros.stack) {
    params.term = filtros.stack;
  }

  if (filtros.tipo === 'Remoto') {
    params.labels = 'remoto';
  }

  const vagasApi = await buscarIssues(params);
  const vagas = vagasApi.map(normalizarVaga);

  return aplicarFiltrosLocais(vagas, filtros).slice(0, 30);
}

export async function buscarVagasRecomendadas(perfil) {
  const stacksOrdenadas = Object.entries(perfil?.interesses || {})
    .filter(([, nota]) => nota > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([stack]) => stack);

  const termo = stacksOrdenadas.join(' ') || 'react developer';
  const vagasApi = await buscarIssues({ term: termo });
  const vagas = vagasApi.map(normalizarVaga);

  return aplicarFiltrosLocais(vagas, { tipo: perfil?.tipo }).slice(0, 30);
}

export default api;
