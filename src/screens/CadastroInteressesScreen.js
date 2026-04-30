// src/screens/CadastroInteressesScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StarRating from '../components/StarRating';
import { salvarPerfil } from '../services/storage';
import { solicitarPermissao } from '../services/notificacoes';
import { colors, spacing, radius, typography } from '../theme';

const STACKS = ['React Native', 'Python', 'Java', 'Node.js', 'Vue.js'];

export default function CadastroInteressesScreen({ navigation, route }) {
  const { dadosParciais, perfilExistente } = route.params;

  const [interesses, setInteresses] = useState(
    perfilExistente?.interesses || {
      'React Native': 0,
      Python: 0,
      Java: 0,
      'Node.js': 0,
      'Vue.js': 0,
    }
  );
  const [salvando, setSalvando] = useState(false);

  function setEstrela(stack, valor) {
    setInteresses((prev) => ({ ...prev, [stack]: valor }));
  }

  async function salvar() {
    setSalvando(true);
    try {
      const perfil = { ...dadosParciais, interesses };
      await salvarPerfil(perfil);
      await solicitarPermissao(); // pede permissão de notificação
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { perfil } }],
      });
    } catch (e) {
      console.error('Erro ao salvar perfil:', e);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Seus interesses</Text>
          <Text style={styles.subtitulo}>Avalie cada tecnologia de 1 a 5 estrelas</Text>
          <View style={styles.dots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotAtivo]} />
          </View>
        </View>

        {/* Lista de stacks */}
        <View style={styles.lista}>
          {STACKS.map((stack, idx) => (
            <View
              key={stack}
              style={[styles.stackRow, idx === STACKS.length - 1 && { borderBottomWidth: 0 }]}
            >
              <Text style={styles.stackNome}>{stack}</Text>
              <StarRating
                valor={interesses[stack] || 0}
                onChange={(v) => setEstrela(stack, v)}
              />
            </View>
          ))}
        </View>

        <Text style={styles.dica}>
          💡 As avaliações são usadas para calcular o percentual de match das vagas
        </Text>

        {/* Botão */}
        <TouchableOpacity
          style={[styles.btnPrimario, salvando && { opacity: 0.7 }]}
          onPress={salvar}
          disabled={salvando}
          activeOpacity={0.85}
        >
          {salvando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.btnPrimarioText}>Salvar perfil</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  header: { marginBottom: spacing.lg },
  titulo: { ...typography.h1, marginBottom: 4 },
  subtitulo: { ...typography.caption, fontSize: 13 },
  dots: { flexDirection: 'row', gap: 6, marginTop: spacing.sm },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  dotAtivo: { backgroundColor: colors.primary },
  lista: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  stackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stackNome: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dica: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  btnPrimario: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  btnPrimarioText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
