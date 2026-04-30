// src/navigation/index.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import CadastroPerfilScreen from '../screens/CadastroPerfilScreen';
import CadastroInteressesScreen from '../screens/CadastroInteressesScreen';
import HomeScreen from '../screens/HomeScreen';
import BuscaScreen from '../screens/BuscaScreen';
import FavoritosScreen from '../screens/FavoritosScreen';
import DetalheVagaScreen from '../screens/DetalheVagaScreen';

import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ── Tab Navigator (telas principais) ─────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Buscar"
        component={BuscaScreen}
        options={{
          tabBarLabel: 'Buscar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={FavoritosScreen}
        options={{
          tabBarLabel: 'Favs',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'heart' : 'heart-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ── Stack Navigator raiz ──────────────────────────────────────────────────────
export default function AppNavigator({ temPerfil }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={temPerfil ? 'MainTabs' : 'CadastroPerfil'}
        screenOptions={{ headerShown: false }}
      >
        {/* Onboarding */}
        <Stack.Screen name="CadastroPerfil" component={CadastroPerfilScreen} />
        <Stack.Screen name="CadastroInteresses" component={CadastroInteressesScreen} />

        {/* App principal */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* Tela de detalhe */}
        <Stack.Screen
          name="DetalheVaga"
          component={DetalheVagaScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
