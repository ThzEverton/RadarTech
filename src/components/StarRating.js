import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function StarRating({ valor = 0, onChange, tamanho = 28 }) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((estrela) => (
        <TouchableOpacity
          key={estrela}
          onPress={() => onChange(estrela)}
          hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
        >
          <MaterialCommunityIcons
            name={estrela <= valor ? 'star' : 'star-outline'}
            size={tamanho}
            color={estrela <= valor ? colors.primary : colors.gray200}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
});
