import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVES = {
  PERFIL: '@radar_vagas:perfil',
  FAVORITOS: '@radar_vagas:favoritos',
};

export async function salvarPerfil(perfil) {
  await AsyncStorage.setItem(CHAVES.PERFIL, JSON.stringify(perfil));
}

export async function carregarPerfil() {
  const raw = await AsyncStorage.getItem(CHAVES.PERFIL);
  return raw ? JSON.parse(raw) : null;
}

export async function limparPerfil() {
  await AsyncStorage.removeItem(CHAVES.PERFIL);
}

export async function carregarFavoritos() {
  const raw = await AsyncStorage.getItem(CHAVES.FAVORITOS);
  return raw ? JSON.parse(raw) : [];
}

export async function salvarFavorito(vaga) {
  const favoritos = await carregarFavoritos();
  const jaExiste = favoritos.some((f) => f.id === vaga.id);

  if (!jaExiste) {
    favoritos.push(vaga);
    await AsyncStorage.setItem(CHAVES.FAVORITOS, JSON.stringify(favoritos));
  }
}

export async function removerFavorito(vagaId) {
  const favoritos = await carregarFavoritos();
  const novos = favoritos.filter((f) => f.id !== vagaId);
  await AsyncStorage.setItem(CHAVES.FAVORITOS, JSON.stringify(novos));
}

export async function ehFavorito(vagaId) {
  const favoritos = await carregarFavoritos();
  return favoritos.some((f) => f.id === vagaId);
}
