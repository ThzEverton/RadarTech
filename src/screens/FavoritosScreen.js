// src/screens/FavoritosScreen.js

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import VagaCard from '../components/VagaCard';
import { carregarFavoritos, removerFavorito } from '../services/storage';
import { colors, spacing, typography } from '../theme';

export default function FavoritosScreen({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarFavoritos().then(setFavoritos);
    }, [])
  );

  async function remover(vagaId) {
    await removerFavorito(vagaId);
    setFavoritos((prev) => prev.filter((f) => f.id !== vagaId));
  }

  function renderVaga({ item }) {
    return (
      <VagaCard
        vaga={item}
        match={item.matchPct || 0}
        favorito={true}
        onPress={() => navigation.navigate('DetalheVaga', { vaga: item, matchPct: item.matchPct || 0 })}
        onToggleFavorito={() => remover(item.id)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderVaga}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.titulo}>Favoritos</Text>
            <Text style={styles.subtitulo}>
              {favoritos.length} {favoritos.length === 1 ? 'vaga salva' : 'vagas salvas'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.vazio}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={56}
              color={colors.textTertiary}
            />
            <Text style={styles.vazioTitulo}>Nenhum favorito ainda</Text>
            <Text style={styles.vazioDesc}>
              Toque no ícone de coração em qualquer vaga para salvá-la aqui.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  lista: { padding: spacing.lg },
  header: { marginBottom: spacing.lg },
  titulo: { ...typography.h1 },
  subtitulo: { ...typography.caption, fontSize: 13, marginTop: 2 },
  vazio: {
    alignItems: 'center',
    marginTop: 60,
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  vazioTitulo: { ...typography.h3, color: colors.textSecondary },
  vazioDesc: {
    ...typography.caption,
    textAlign: 'center',
    lineHeight: 20,
  },
});
