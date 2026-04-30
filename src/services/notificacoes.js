// src/services/notificacoes.js

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configura como as notificações são exibidas enquanto o app está aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Solicita permissão de notificações ao usuário.
 * @returns {Promise<boolean>} - true se autorizado
 */
export async function solicitarPermissao() {
  if (!Device.isDevice) {
    console.log('Notificações só funcionam em dispositivo físico.');
    return false;
  }

  const { status: statusAtual } = await Notifications.getPermissionsAsync();
  let statusFinal = statusAtual;

  if (statusAtual !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    statusFinal = status;
  }

  return statusFinal === 'granted';
}

/**
 * Envia uma notificação local imediata sobre uma vaga com alto match.
 * @param {Object} vaga - objeto da vaga
 * @param {number} percentualMatch - percentual de match calculado
 */
export async function notificarVagaMatch(vaga, percentualMatch) {
  const autorizado = await solicitarPermissao();
  if (!autorizado) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Nova vaga com ${percentualMatch}% de match! 🎯`,
      body: `${vaga.title} — ${vaga.company_name}`,
      data: { vagaId: vaga.id },
      sound: true,
    },
    trigger: null, // imediata
  });
}

/**
 * Agenda verificação periódica de vagas (background check simulado).
 * Em produção, isso seria feito via Background Fetch.
 */
export async function agendarVerificacao() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
