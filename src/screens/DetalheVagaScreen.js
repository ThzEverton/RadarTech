// src/screens/DetalheVagaScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { badgeMatch } from '../hooks/useMatch';
import { ehFavorito, salvarFavorito, removerFavorito } from '../services/storage';
import { colors, spacing, radius, typography } from '../theme';

function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function InfoRow({ chave, valor }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoChave}>{chave}</Text>
      <Text style={styles.infoValor}>{valor || '—'}</Text>
    </View>
  );
}

export default function DetalheVagaScreen({ route, navigation }) {
  const { vaga, matchPct } = route.params;
  const badge = badgeMatch(matchPct);

  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    ehFavorito(vaga.id).then(setFavorito);
  }, []);

  async function toggleFavorito() {
    if (favorito) {
      await removerFavorito(vaga.id);
      setFavorito(false);
    } else {
      await salvarFavorito({ ...vaga, matchPct });
      setFavorito(true);
    }
  }

  async function candidatar() {
    const url = vaga.url;
    if (!url) {
      Alert.alert('Erro', 'Link da vaga não disponível.');
      return;
    }
    const suporte = await Linking.canOpenURL(url);
    if (suporte) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Erro', 'Não foi possível abrir o link da vaga.');
    }
  }

  const descricao = stripHtml(vaga.description).slice(0, 300);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Botão voltar */}
        <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.primary} />
          <Text style={styles.voltarText}>Voltar</Text>
        </TouchableOpacity>

        {/* Cabeçalho da vaga */}
        <Text style={styles.titulo}>{vaga.title}</Text>
        <View style={[styles.badge, { backgroundColor: badge.fundo }]}>
          <Text style={[styles.badgeText, { color: badge.cor }]}>
            {matchPct}% de match com seu perfil
          </Text>
        </View>

        {/* Detalhes */}
        <View style={styles.card}>
          <InfoRow chave="Empresa" valor={vaga.company_name} />
          <InfoRow chave="Tipo" valor={vaga.job_type?.replace('_', ' ')} />
          <InfoRow chave="Localização" valor={vaga.candidate_required_location || 'Remoto'} />
          <InfoRow chave="Categoria" valor={vaga.category} />
          <InfoRow chave="Salário" valor={vaga.salary || 'Não informado'} />
        </View>

        {/* Tags de tecnologia */}
        {vaga.tags?.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>TECNOLOGIAS</Text>
            <View style={styles.tagsRow}>
              {vaga.tags.slice(0, 8).map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Descrição */}
        <Text style={styles.sectionLabel}>SOBRE A VAGA</Text>
        <View style={styles.descCard}>
          <Text style={styles.descText}>{descricao}...</Text>
        </View>

        {/* Botões de ação */}
        <TouchableOpacity style={styles.btnCandidatar} onPress={candidatar} activeOpacity={0.85}>
          <MaterialCommunityIcons name="send-outline" size={18} color={colors.white} />
          <Text style={styles.btnCandidatarText}>Candidatar-se</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnFavoritar} onPress={toggleFavorito} activeOpacity={0.85}>
          <MaterialCommunityIcons
            name={favorito ? 'heart' : 'heart-outline'}
            size={18}
            color={favorito ? colors.danger : colors.primary}
          />
          <Text style={[styles.btnFavoritarText, favorito && { color: colors.danger }]}>
            {favorito ? 'Remover dos favoritos' : 'Favoritar vaga'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.md,
  },
  voltarText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  titulo: { ...typography.h2, marginBottom: spacing.sm },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: spacing.lg,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoChave: { fontSize: 13, color: colors.textSecondary },
  infoValor: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, maxWidth: '60%', textAlign: 'right' },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.lg },
  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  tagText: { fontSize: 11, color: colors.primaryDark, fontWeight: '600' },
  descCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  descText: { fontSize: 13, color: colors.primaryDark, lineHeight: 20 },
  btnCandidatar: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  btnCandidatarText: { color: colors.white, fontSize: 15, fontWeight: '600' },
  btnFavoritar: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  btnFavoritarText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
});
