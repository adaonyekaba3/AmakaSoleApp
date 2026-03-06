import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Button, Card, ProgressBar, useToast } from '../../design-system';
import { useOrthoticStore } from '../../store/orthoticStore';
import { INSOLE_PRICE_RANGE, MATERIAL_DESCRIPTIONS } from '@amakasole/shared';
import { MaterialType } from '@amakasole/shared';

const shoeTypes = ['SNEAKER', 'BOOT', 'HEEL', 'LOAFER', 'SANDAL', 'SPORT'];
const useCases = ['EVERYDAY', 'SPORT', 'MEDICAL'];
const materials = Object.keys(INSOLE_PRICE_RANGE);
const archPrefs = ['LOW', 'MEDIUM', 'HIGH'];

export default function OrthoticBuilderScreen({ navigation, route }: any) {
  const scanId = route.params?.scanId;
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    shoeType: 'SNEAKER',
    useCase: 'EVERYDAY',
    material: 'EVA_FOAM',
    archHeightPref: 'MEDIUM',
  });
  const { generate, isGenerating } = useOrthoticStore();
  const { show } = useToast();

  const steps = ['Shoe Type', 'Use Case', 'Material', 'Arch Height'];
  const options = [shoeTypes, useCases, materials, archPrefs];
  const keys = ['shoeType', 'useCase', 'material', 'archHeightPref'] as const;

  const handleGenerate = async () => {
    if (!scanId) { show('Please complete a scan first', 'error'); return; }
    try {
      const design = await generate({ scanId, ...config });
      navigation.replace('DesignDetail', { orthoticId: design.id });
    } catch {
      show('Failed to generate design', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[Typography.h2, { color: Colors.gray[900] }]}>Design Your Orthotic</Text>
        <ProgressBar progress={((step + 1) / steps.length) * 100} style={{ marginTop: 12 }} />
        <Text style={[Typography.caption, { color: Colors.gray[500], marginTop: 8 }]}>{steps[step]}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {options[step].map(option => {
          const isSelected = config[keys[step]] === option;
          const priceInfo = step === 2 ? ` — $${(INSOLE_PRICE_RANGE[option as MaterialType] / 100).toFixed(0)}` : '';
          const desc = step === 2 ? MATERIAL_DESCRIPTIONS[option as MaterialType] : '';
          return (
            <Card
              key={option}
              variant={isSelected ? 'elevated' : 'outlined'}
              style={[styles.optionCard, isSelected && { borderColor: Colors.primary[500], borderWidth: 2 }]}
            >
              <Button
                title={`${option.replace(/_/g, ' ')}${priceInfo}`}
                variant={isSelected ? 'primary' : 'ghost'}
                onPress={() => setConfig({ ...config, [keys[step]]: option })}
              />
              {desc ? <Text style={[Typography.caption, { color: Colors.gray[500], marginTop: 4 }]}>{desc}</Text> : null}
            </Card>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && <Button title="Back" variant="outline" onPress={() => setStep(step - 1)} style={{ flex: 1, marginRight: 12 }} />}
        <Button
          title={step < steps.length - 1 ? 'Next' : 'Generate Design'}
          onPress={step < steps.length - 1 ? () => setStep(step + 1) : handleGenerate}
          loading={isGenerating}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { padding: 24 },
  scroll: { flex: 1, paddingHorizontal: 24 },
  optionCard: { marginBottom: 12 },
  footer: { flexDirection: 'row', padding: 24, borderTopWidth: 1, borderTopColor: Colors.gray[200] },
});
