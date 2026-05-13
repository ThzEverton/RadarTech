import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { badgeMatch } from '../hooks/useMatch';
import { colors, radius, spacing } from '../theme';

export default function VagaCard({ vaga, match, favorito, onPress, onToggleFavorito }) {
  const badge = badgeMatch(match);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.row}>
        <Text style={styles.titulo} numberOfLines={1}>{vaga.title}</Text>
        <Text style={[styles.pct, { color: match >= 80 ? colors.primary : match >= 55 ? colors.secondary : colors.textTertiary }]}>
          {match}%
        </Text>
      </View>

      <Text style={styles.sub} numberOfLines={1}>
        {vaga.company_name} - {vaga.candidate_required_location || 'Remoto'}
      </Text>

      <View style={[styles.row, { marginTop: spacing.sm }]}>
        <View style={[styles.badge, { backgroundColor: badge.fundo }]}>
          <Text style={[styles.badgeText, { color: badge.cor }]}>{badge.label}</Text>
        </View>
        <TouchableOpacity onPress={onToggleFavorito} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialCommunityIcons
            name={favorito ? 'heart' : 'heart-outline'}
            size={22}
            color={favorito ? colors.danger : colors.textTertiary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titulo: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  pct: {
    fontSize: 18,
    fontWeight: '700',
  },
  sub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
