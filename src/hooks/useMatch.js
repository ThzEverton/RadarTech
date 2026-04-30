// src/hooks/useMatch.js

/**
 * Calcula o percentual de match entre uma vaga e o perfil do usuário.
 *
 * Critérios:
 *  - Stack tecnológica:  50 pontos (ponderado pelo nível de interesse 1-5)
 *  - Nível profissional: 30 pontos (correspondência exata)
 *  - Tipo de trabalho:   20 pontos (remoto/presencial)
 *
 * @param {Object} vaga   - objeto da vaga da API Remotive
 * @param {Object} perfil - { nivel, tipo, interesses: { 'React Native': 5, ... } }
 * @returns {number} - percentual de 0 a 100
 */
export function calcularMatch(vaga, perfil) {
  if (!perfil) return 0;

  let pontos = 0;
  const titulo = (vaga.title || '').toLowerCase();
  const desc = (vaga.description || '').toLowerCase();
  const tags = (vaga.tags || []).map((t) => t.toLowerCase());
  const texto = `${titulo} ${desc} ${tags.join(' ')}`;

  // ── 1. Stack (até 50 pontos) ──────────────────────────────────────────────
  const stackMap = {
    'React Native': ['react native', 'reactnative', 'rn'],
    Python: ['python', 'django', 'fastapi', 'flask'],
    Java: ['java', 'spring', 'springboot'],
    'Node.js': ['node', 'nodejs', 'node.js', 'express'],
    'Vue.js': ['vue', 'vuejs', 'vue.js', 'nuxt'],
  };

  let melhorPontuacaoStack = 0;

  for (const [stack, palavras] of Object.entries(stackMap)) {
    const interesse = perfil.interesses?.[stack] || 0; // 0-5
    const encontrou = palavras.some((p) => texto.includes(p));
    if (encontrou && interesse > 0) {
      const pontuacao = (interesse / 5) * 50;
      if (pontuacao > melhorPontuacaoStack) melhorPontuacaoStack = pontuacao;
    }
  }
  pontos += melhorPontuacaoStack;

  // ── 2. Nível (até 30 pontos) ──────────────────────────────────────────────
  const nivelMap = {
    Junior: ['junior', 'jr', 'entry', 'júnior', 'estágio', 'trainee'],
    Pleno: ['pleno', 'mid', 'middle', 'mid-level'],
    Sênior: ['senior', 'sênior', 'sr', 'lead', 'staff', 'principal'],
  };

  const palavrasNivel = nivelMap[perfil.nivel] || [];
  const bateNivel = palavrasNivel.some((p) => texto.includes(p));
  if (bateNivel) pontos += 30;
  else pontos += 10; // ponto parcial se não for possível determinar

  // ── 3. Tipo de trabalho (até 20 pontos) ───────────────────────────────────
  const tipoVaga = (vaga.candidate_required_location || '').toLowerCase();
  if (perfil.tipo === 'Remoto' && tipoVaga.includes('worldwide')) {
    pontos += 20;
  } else if (perfil.tipo === 'Remoto' && tipoVaga === '') {
    pontos += 15; // remoto por padrão na Remotive
  } else if (perfil.tipo === 'Presencial' && tipoVaga.includes('brazil')) {
    pontos += 20;
  } else {
    pontos += 5;
  }

  return Math.min(Math.round(pontos), 100);
}

/**
 * Retorna label e cor do badge conforme o percentual de match.
 */
export function badgeMatch(percentual) {
  if (percentual >= 80) {
    return { label: 'Ótimo match', cor: '#1D9E75', fundo: '#E1F5EE' };
  }
  if (percentual >= 55) {
    return { label: 'Match médio', cor: '#854F0B', fundo: '#FAEEDA' };
  }
  return { label: 'Match baixo', cor: '#5F5E5A', fundo: '#F1EFE8' };
}
