import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChipSelector from '../components/ChipSelector';
import { colors, spacing, radius, typography } from '../theme';

const NIVEIS = ['Junior', 'Pleno', 'Senior'];
const TIPOS = ['Remoto', 'Presencial'];

export default function CadastroPerfilScreen({ navigation, route }) {
  const perfilExistente = route?.params?.perfil;

  const [nome, setNome] = useState(perfilExistente?.nome || '');
  const [email, setEmail] = useState(perfilExistente?.email || '');
  const [nivel, setNivel] = useState(perfilExistente?.nivel || '');
  const [tipo, setTipo] = useState(perfilExistente?.tipo || '');

  function avancar() {
    if (!nome.trim()) {
      Alert.alert('Atencao', 'Por favor, informe seu nome.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Atencao', 'Por favor, informe um e-mail valido.');
      return;
    }

    if (!nivel) {
      Alert.alert('Atencao', 'Selecione seu nivel profissional.');
      return;
    }

    if (!tipo) {
      Alert.alert('Atencao', 'Selecione o tipo de trabalho preferido.');
      return;
    }

    navigation.navigate('CadastroInteresses', {
      dadosParciais: { nome: nome.trim(), email: email.trim(), nivel, tipo },
      perfilExistente,
    });
  }

  const isEdicao = !!perfilExistente;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.titulo}>
              {isEdicao ? 'Editar perfil' : 'Criar perfil'}
            </Text>
            <Text style={styles.subtitulo}>
              {isEdicao ? 'Atualize suas informacoes' : 'Configure seus interesses uma vez'}
            </Text>
            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotAtivo]} />
              <View style={styles.dot} />
            </View>
          </View>

          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor={colors.textTertiary}
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor={colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Nivel profissional</Text>
          <ChipSelector opcoes={NIVEIS} valor={nivel} onChange={setNivel} />

          <Text style={styles.label}>Tipo de trabalho preferido</Text>
          <ChipSelector opcoes={TIPOS} valor={tipo} onChange={setTipo} />

          <TouchableOpacity style={styles.btnPrimario} onPress={avancar} activeOpacity={0.85}>
            <Text style={styles.btnPrimarioText}>Proximo</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  btnPrimario: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  btnPrimarioText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
