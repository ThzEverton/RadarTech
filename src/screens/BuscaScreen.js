// src/screens/BuscaScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ChipSelector from '../components/ChipSelector';
import VagaCard from '../components/VagaCard';
import { buscarVagas } from '../services/remotiveApi';
import { carregarPerfil, carregarFavoritos, salvarFavorito, removerFavorito } from '../services/storage';
import { calcularMatch } from '../hooks/useMatch';
import { colors, spacing, radius, typography } from '../theme';

const STACKS = ['React', 'React Native', 'Python', 'Java', 'Node.js', 'Vue.js'];
const NIVEIS = ['Junior', 'Pleno', 'Sênior'];
const TIPOS = ['Remoto', 'Presencial'];

export default function BuscaScreen({ navigation }) {
  const [stackSel, setStackSel] = useState([]);
  const [nivelSel, setNivelSel] = useState('');
  const [tipoSel, setTipoSel] = useState('');
  const [vagas, setVagas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [buscouUmaVez, setBuscouUmaVez] = useState(false);

  async function buscar() {
    if (stackSel.length === 0 && !nivelSel && !tipoSel) {
      Alert.alert('Atenção', 'Selecione ao menos um filtro para buscar.');
      return;
    }

    setCarregando(true);
    setBuscouUmaVez(true);

    try {
      const [perfil, favsSalvos] = await Promise.all([
        carregarPerfil(),
        carregarFavoritos(),
      ]);

      setFavoritos(favsSalvos.map((f) => f.id));

      const vagasApi = await buscarVagas({
        stack: stackSel.join(' '),
        nivel: nivelSel,
        tipo: tipoSel,
      });

      const vagasComMatch = vagasApi
        .map((v) => ({ ...v, matchPct: calcularMatch(v, perfil) }))
        .sort((a, b) => b.matchPct - a.matchPct);

      setVagas(vagasComMatch);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível buscar as vagas. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  async function toggleFavorito(vaga) {
    const ehFav = favoritos.includes(vaga.id);
    if (ehFav) {
      await removerFavorito(vaga.id);
      setFavoritos((prev) => prev.filter((id) => id !== vaga.id));
    } else {
      await salvarFavorito(vaga);
      setFavoritos((prev) => [...prev, vaga.id]);
    }
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

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={vagas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderVaga}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <Text style={styles.titulo}>Buscar vagas</Text>

            <Text style={styles.label}>Stack</Text>
            <ChipSelector
              opcoes={STACKS}
              valor={stackSel}
              onChange={setStackSel}
              multi
            />

            <Text style={styles.label}>Nível</Text>
            <ChipSelector opcoes={NIVEIS} valor={nivelSel} onChange={setNivelSel} />

            <Text style={styles.label}>Tipo de trabalho</Text>
            <ChipSelector opcoes={TIPOS} valor={tipoSel} onChange={setTipoSel} />

            <TouchableOpacity
              style={[styles.btnBuscar, carregando && { opacity: 0.7 }]}
              onPress={buscar}
              disabled={carregando}
              activeOpacity={0.85}
            >
              {carregando ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <MaterialCommunityIcons name="magnify" size={18} color={colors.white} />
                  <Text style={styles.btnBuscarText}>Buscar vagas</Text>
                </>
              )}
            </TouchableOpacity>

            {buscouUmaVez && !carregando && (
              <Text style={styles.resultados}>
                {vagas.length} {vagas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          buscouUmaVez && !carregando ? (
            <View style={styles.vazio}>
              <MaterialCommunityIcons name="briefcase-search-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.vazioText}>
                Nenhuma vaga encontrada{'\n'}para esses filtros.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  lista: { padding: spacing.lg },
  titulo: { ...typography.h1, marginBottom: spacing.lg },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  btnBuscar: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  btnBuscarText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  resultados: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  vazio: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  vazioText: {
    ...typography.caption,
    textAlign: 'center',
    lineHeight: 20,
  },
});
