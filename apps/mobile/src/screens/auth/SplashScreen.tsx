import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';

export default function SplashScreen({ navigation }: { navigation: NativeStackNavigationProp<any> }) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Onboarding'), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[Typography.h1, { color: Colors.white }]}>AmakaSole</Text>
      <Text style={[Typography.body, { color: Colors.primary[200], marginTop: 8 }]}>
        Custom orthotics, designed by AI
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
