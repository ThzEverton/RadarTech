import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function solicitarPermissao() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Radar de Vagas',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1D9E75',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  if (!Device.isDevice) {
    console.log('Rodando em emulador: notificacoes locais serao testadas sem push token.');
  }

  const { status: statusAtual } = await Notifications.getPermissionsAsync();
  let statusFinal = statusAtual;

  if (statusAtual !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    statusFinal = status;
  }

  return statusFinal === 'granted';
}

export async function notificarVagaMatch(vaga, percentualMatch) {
  const autorizado = await solicitarPermissao();
  if (!autorizado) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Nova vaga com ${percentualMatch}% de match!`,
      body: `${vaga.title} - ${vaga.company_name}`,
      data: { vagaId: vaga.id },
      sound: true,
    },
    trigger: null,
  });
}

export async function agendarVerificacao() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
