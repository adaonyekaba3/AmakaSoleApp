import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Button, Card } from '../../design-system';

const steps = [
  { title: 'Find Good Lighting', desc: 'Natural or bright indoor light works best.' },
  { title: 'Place on Flat Surface', desc: 'Stand on a flat, solid surface with your feet shoulder-width apart.' },
  { title: 'Follow the Guide', desc: 'Move your phone slowly around each foot following the on-screen guide.' },
];

export default function ScanTutorialScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.h2, { color: Colors.gray[900] }]}>How to Scan</Text>
        <Text style={[Typography.body, { color: Colors.gray[500], marginTop: 8, marginBottom: 24 }]}>
          Follow these steps for the best results
        </Text>

        {steps.map((step, i) => (
          <Card key={i} style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={styles.stepNumber}>
                <Text style={[Typography.label, { color: Colors.white }]}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[Typography.label, { color: Colors.gray[900] }]}>{step.title}</Text>
                <Text style={[Typography.bodySmall, { color: Colors.gray[500], marginTop: 4 }]}>{step.desc}</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Start Scanning" onPress={() => navigation.navigate('ScanCapture')} size="lg" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { padding: 24, paddingTop: 16 },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: Colors.gray[200] },
});
