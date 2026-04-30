// src/services/remotiveApi.js

import axios from 'axios';

const BASE_URL = 'https://remotive.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Busca vagas de tecnologia na API Remotive.
 * @param {Object} filtros - { stack, nivel, tipo }
 * @returns {Promise<Array>} - lista de vagas
 */
export async function buscarVagas(filtros = {}) {
  const params = {};

  if (filtros.stack) {
    params.search = filtros.stack;
  }

  if (filtros.categoria) {
    params.category = filtros.categoria;
  }

  const { data } = await api.get('/remote-jobs', { params });

  let vagas = data.jobs || [];

  // Filtro adicional por nível no título/descrição
  if (filtros.nivel) {
    const nivelMap = {
      Junior: ['junior', 'jr', 'entry', 'estágio', 'estagio', 'trainee'],
      Pleno: ['pleno', 'mid', 'middle', 'mid-level'],
      Sênior: ['sênior', 'senior', 'sr', 'lead', 'staff'],
    };
    const palavras = nivelMap[filtros.nivel] || [];
    if (palavras.length > 0) {
      vagas = vagas.filter((v) =>
        palavras.some(
          (p) =>
            v.title?.toLowerCase().includes(p) ||
            v.description?.toLowerCase().includes(p)
        )
      );
    }
  }

  // Filtro por tipo (remote/presencial)
  if (filtros.tipo === 'Remoto') {
    vagas = vagas.filter((v) => v.job_type?.toLowerCase().includes('full_time') || true);
  }

  return vagas.slice(0, 30);
}

/**
 * Busca vagas recomendadas com base no perfil do usuário.
 * Usa as stacks favoritas do usuário como termos de busca.
 * @param {Object} perfil - perfil salvo do usuário
 * @returns {Promise<Array>} - vagas ranqueadas por match
 */
export async function buscarVagasRecomendadas(perfil) {
  const stacksOrdenadas = Object.entries(perfil.interesses || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([stack]) => stack);

  const termo = stacksOrdenadas.join(' ') || 'react native developer';

  const { data } = await api.get('/remote-jobs', {
    params: { search: termo },
  });

  return data.jobs || [];
}

export default api;
