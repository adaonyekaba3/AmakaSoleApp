import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Button } from '../../design-system';

const { width } = Dimensions.get('window');

const slides = [
  { title: 'Scan Your Feet', description: 'Use your phone camera to create a precise 3D model of your feet in seconds.' },
  { title: 'AI-Powered Analysis', description: 'Our ML engine analyzes your foot structure and gait for the perfect fit.' },
  { title: 'Custom Orthotics', description: 'Receive personalized orthotic insoles manufactured just for you.' },
];

export default function OnboardingScreen({ navigation }: { navigation: NativeStackNavigationProp<any> }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[Typography.h2, { color: Colors.white, textAlign: 'center' }]}>
          {slides[currentSlide].title}
        </Text>
        <Text style={[Typography.body, { color: Colors.gray[300], textAlign: 'center', marginTop: 16 }]}>
          {slides[currentSlide].description}
        </Text>
      </View>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentSlide && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.buttons}>
        <Button title={currentSlide < slides.length - 1 ? 'Next' : 'Get Started'} onPress={handleNext} size="lg" />
        {currentSlide < slides.length - 1 && (
          <Button title="Skip" onPress={() => navigation.replace('Login')} variant="ghost" style={{ marginTop: 12 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.bg, padding: 24, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gray[600], marginHorizontal: 4 },
  dotActive: { backgroundColor: Colors.primary[500], width: 24 },
  buttons: { marginBottom: 32 },
});
