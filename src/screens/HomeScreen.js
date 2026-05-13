import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import VagaCard from '../components/VagaCard';
import { buscarVagasRecomendadas } from '../services/vagasApi';
import { carregarPerfil, carregarFavoritos, salvarFavorito, removerFavorito } from '../services/storage';
import { notificarVagaMatch } from '../services/notificacoes';
import { calcularMatch } from '../hooks/useMatch';
import { colors, spacing, radius, typography } from '../theme';

export default function HomeScreen({ navigation }) {
  const [vagas, setVagas] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    setCarregando(true);
    setErro(null);

    try {
      const [perfilSalvo, favsSalvos] = await Promise.all([
        carregarPerfil(),
        carregarFavoritos(),
      ]);

      setPerfil(perfilSalvo);
      setFavoritos(favsSalvos.map((f) => f.id));

      if (!perfilSalvo) {
        navigation.reset({ index: 0, routes: [{ name: 'CadastroPerfil' }] });
        return;
      }

      const vagasApi = await buscarVagasRecomendadas(perfilSalvo);
      const vagasComMatch = vagasApi
        .map((v) => ({ ...v, matchPct: calcularMatch(v, perfilSalvo) }))
        .sort((a, b) => b.matchPct - a.matchPct);

      setVagas(vagasComMatch);

      const melhorVaga = vagasComMatch.find((vaga) => vaga.matchPct >= 80);
      if (melhorVaga) {
        await notificarVagaMatch(melhorVaga, melhorVaga.matchPct);
      }
    } catch (e) {
      setErro('Nao foi possivel carregar as vagas. Verifique sua conexao.');
    } finally {
      setCarregando(false);
    }
  }

  async function toggleFavorito(vaga) {
    const ehFav = favoritos.includes(vaga.id);

    if (ehFav) {
      await removerFavorito(vaga.id);
      setFavoritos((prev) => prev.filter((id) => id !== vaga.id));
      return;
    }

    await salvarFavorito(vaga);
    setFavoritos((prev) => [...prev, vaga.id]);
  }

  function renderVaga({ item }) {
    return (
      <VagaCard
        vaga={item}
        match={item.matchPct}
        favorito={favoritos.includes(item.id)}
        onPress={() => navigation.navigate('DetalheVaga', { vaga: item, matchPct: item.matchPct })}
        onToggleFavorito={() => toggleFavorito(item)}
      />
    );
  }

  if (carregando) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.carregandoText}>Buscando vagas para voce...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={vagas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderVaga}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={carregando}
            onRefresh={carregarDados}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.ola}>
              Ola, {perfil?.nome?.split(' ')[0] || 'Desenvolvedor'}
            </Text>
            <Text style={styles.subtitulo}>Vagas recomendadas para voce hoje</Text>

            <TouchableOpacity
              style={styles.btnEditarPerfil}
              onPress={() => navigation.navigate('CadastroPerfil', { perfil })}
            >
              <MaterialCommunityIcons name="account-edit-outline" size={16} color={colors.primary} />
              <Text style={styles.btnEditarPerfilText}>Editar perfil</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          erro ? (
            <View style={styles.centro}>
              <MaterialCommunityIcons name="wifi-off" size={48} color={colors.textTertiary} />
              <Text style={styles.erroText}>{erro}</Text>
              <TouchableOpacity style={styles.btnTentar} onPress={carregarDados}>
                <Text style={styles.btnTentarText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.centro}>
              <Text style={styles.vazioText}>Nenhuma vaga encontrada.</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  lista: { padding: spacing.lg },
  header: { marginBottom: spacing.lg },
  ola: { ...typography.h1 },
  subtitulo: { ...typography.caption, fontSize: 13, marginTop: 2 },
  btnEditarPerfil: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  btnEditarPerfilText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: 60,
  },
  carregandoText: {
    ...typography.caption,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  erroText: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 20,
  },
  btnTentar: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  btnTentarText: { color: colors.white, fontWeight: '600', fontSize: 13 },
  vazioText: { ...typography.caption, textAlign: 'center' },
});
