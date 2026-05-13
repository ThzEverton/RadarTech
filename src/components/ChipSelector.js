import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function ChipSelector({ opcoes, valor, onChange, multi = false }) {
  function isSelected(op) {
    if (multi) return Array.isArray(valor) && valor.includes(op);
    return valor === op;
  }

  function handlePress(op) {
    if (multi) {
      const arr = Array.isArray(valor) ? valor : [];
      onChange(arr.includes(op) ? arr.filter((v) => v !== op) : [...arr, op]);
      return;
    }

    onChange(valor === op ? '' : op);
  }

  return (
    <View style={styles.row}>
      {opcoes.map((op) => {
        const sel = isSelected(op);
        return (
          <TouchableOpacity
            key={op}
            style={[styles.chip, sel && styles.chipSel]}
            onPress={() => handlePress(op)}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipText, sel && styles.chipTextSel]}>{op}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipSel: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chipTextSel: {
    color: colors.white,
  },
});
