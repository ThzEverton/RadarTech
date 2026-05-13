export function calcularMatch(vaga, perfil) {
  if (!perfil) return 0;

  let pontos = 0;
  const normalizar = (valor = '') =>
    String(valor)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const titulo = normalizar(vaga.title || '');
  const desc = normalizar(vaga.description || '');
  const tags = (vaga.tags || []).map((t) => normalizar(t));
  const texto = `${titulo} ${desc} ${tags.join(' ')}`;

  const stackMap = {
    'React Native': ['react native', 'reactnative', 'rn'],
    React: ['react', 'react.js', 'reactjs'],
    Python: ['python', 'django', 'fastapi', 'flask'],
    Java: ['java', 'spring', 'springboot'],
    'Node.js': ['node', 'nodejs', 'node.js', 'express'],
    'Vue.js': ['vue', 'vuejs', 'vue.js', 'nuxt'],
  };

  let melhorPontuacaoStack = 0;

  for (const [stack, palavras] of Object.entries(stackMap)) {
    const interesse = perfil.interesses?.[stack] || 0;
    const encontrou = palavras.some((p) => texto.includes(p));

    if (encontrou && interesse > 0) {
      const pontuacao = (interesse / 5) * 50;
      if (pontuacao > melhorPontuacaoStack) melhorPontuacaoStack = pontuacao;
    }
  }

  pontos += melhorPontuacaoStack;

  const nivelMap = {
    Junior: ['junior', 'jr', 'entry', 'estagio', 'trainee'],
    Pleno: ['pleno', 'mid', 'middle', 'mid-level'],
    Senior: ['senior', 'sr', 'lead', 'staff', 'principal'],
  };

  const palavrasNivel = nivelMap[perfil.nivel] || [];
  const bateNivel = palavrasNivel.some((p) => texto.includes(p));
  pontos += bateNivel ? 30 : 10;

  const tipoVaga = normalizar(vaga.candidate_required_location || '');
  const textoTipo = normalizar(`${vaga.title || ''} ${vaga.description || ''} ${tags.join(' ')}`);

  if (perfil.tipo === 'Remoto' && (tipoVaga.includes('remoto') || textoTipo.includes('remoto') || textoTipo.includes('remote'))) {
    pontos += 20;
  } else if (
    perfil.tipo === 'Presencial' &&
    (tipoVaga.includes('brasil') || textoTipo.includes('presencial') || textoTipo.includes('hibrido') || textoTipo.includes('hybrid'))
  ) {
    pontos += 20;
  } else {
    pontos += 5;
  }

  return Math.min(Math.round(pontos), 100);
}

export function badgeMatch(percentual) {
  if (percentual >= 80) {
    return { label: 'Otimo match', cor: '#1D9E75', fundo: '#E1F5EE' };
  }

  if (percentual >= 55) {
    return { label: 'Match medio', cor: '#854F0B', fundo: '#FAEEDA' };
  }

  return { label: 'Match baixo', cor: '#5F5E5A', fundo: '#F1EFE8' };
}
