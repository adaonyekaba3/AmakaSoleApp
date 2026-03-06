import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntakeFormScreen from '../screens/intake/IntakeFormScreen';

export type IntakeStackParamList = {
  IntakeForm: undefined;
};

const Stack = createNativeStackNavigator<IntakeStackParamList>();

export default function IntakeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IntakeForm" component={IntakeFormScreen} />
    </Stack.Navigator>
  );
}
