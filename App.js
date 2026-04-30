// App.js

import { registerRootComponent } from 'expo';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

import AppNavigator from './src/navigation';
import { carregarPerfil } from './src/services/storage';
import { paperTheme, colors } from './src/theme';

function App() {
  const [iniciando, setIniciando] = useState(true);
  const [temPerfil, setTemPerfil] = useState(false);

  useEffect(() => {
    inicializar();

    // Listener de notificações recebidas
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notificação recebida:', notification);
    });

    // Listener de toque na notificação
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notificação tocada:', response);
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  async function inicializar() {
    try {
      const perfil = await carregarPerfil();
      setTemPerfil(!!perfil);
    } catch (e) {
      console.error('Erro ao inicializar:', e);
    } finally {
      setIniciando(false);
    }
  }

  if (iniciando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <AppNavigator temPerfil={temPerfil} />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
registerRootComponent(App);