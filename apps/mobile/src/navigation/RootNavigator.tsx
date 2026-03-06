import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { LoadingSpinner } from '../design-system';
import AuthStack from './AuthStack';
import IntakeStack from './IntakeStack';
import MainTabs from './MainTabs';

export type RootStackParamList = {
  Auth: undefined;
  Intake: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['amakasole://'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: 'home',
          Scan: 'scan',
          Designs: 'designs',
          Orders: 'orders',
          Profile: 'profile',
        },
      },
    },
  },
};

export default function RootNavigator() {
  const { isAuthenticated, isLoading, hasCompletedIntake, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : !hasCompletedIntake ? (
          <Stack.Screen name="Intake" component={IntakeStack} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
