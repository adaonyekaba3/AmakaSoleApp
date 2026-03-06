import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Button, Input, ProgressBar, useToast } from '../../design-system';
import { useAuthStore } from '../../store/authStore';
import { subscriptionsApi } from '../../api/subscriptions.queries';

const STEPS = ['About You', 'Activity', 'Conditions'];

export default function IntakeFormScreen() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    dateOfBirth: '',
    weightKg: '',
    heightCm: '',
    primaryActivity: [] as string[],
    knownConditions: [] as string[],
  });
  const { show } = useToast();
  const setIntakeComplete = useAuthStore(s => s.setIntakeComplete);

  const activities = ['Running', 'Walking', 'Hiking', 'Tennis', 'Basketball', 'Golf', 'Standing Work', 'Gym'];
  const conditions = ['Plantar Fasciitis', 'Flat Feet', 'High Arches', 'Bunions', 'Heel Spurs', 'Knee Pain', 'Back Pain', 'None'];

  const toggleItem = (list: string[], item: string) =>
    list.includes(item) ? list.filter(i => i !== item) : [...list, item];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await subscriptionsApi.updateProfile({
        dateOfBirth: form.dateOfBirth || undefined,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        primaryActivity: form.primaryActivity.length > 0 ? form.primaryActivity : undefined,
        knownConditions: form.knownConditions.length > 0 ? form.knownConditions : undefined,
      });
      setIntakeComplete();
    } catch {
      show('Failed to save profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[Typography.caption, { color: Colors.gray[500] }]}>Step {step + 1} of {STEPS.length}</Text>
        <Text style={[Typography.h2, { color: Colors.gray[900], marginTop: 4 }]}>{STEPS[step]}</Text>
        <ProgressBar progress={((step + 1) / STEPS.length) * 100} style={{ marginTop: 16 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 24 }}>
        {step === 0 && (
          <>
            <Input label="Date of Birth" placeholder="YYYY-MM-DD" value={form.dateOfBirth} onChangeText={v => setForm({ ...form, dateOfBirth: v })} />
            <Input label="Weight (kg)" placeholder="70" value={form.weightKg} onChangeText={v => setForm({ ...form, weightKg: v })} keyboardType="numeric" />
            <Input label="Height (cm)" placeholder="170" value={form.heightCm} onChangeText={v => setForm({ ...form, heightCm: v })} keyboardType="numeric" />
          </>
        )}
        {step === 1 && (
          <View style={styles.chips}>
            {activities.map(a => (
              <Button
                key={a}
                title={a}
                variant={form.primaryActivity.includes(a) ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setForm({ ...form, primaryActivity: toggleItem(form.primaryActivity, a) })}
                style={{ marginRight: 8, marginBottom: 8 }}
              />
            ))}
          </View>
        )}
        {step === 2 && (
          <View style={styles.chips}>
            {conditions.map(c => (
              <Button
                key={c}
                title={c}
                variant={form.knownConditions.includes(c) ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setForm({ ...form, knownConditions: toggleItem(form.knownConditions, c) })}
                style={{ marginRight: 8, marginBottom: 8 }}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && <Button title="Back" variant="outline" onPress={() => setStep(step - 1)} style={{ flex: 1, marginRight: 12 }} />}
        <Button
          title={step < STEPS.length - 1 ? 'Next' : 'Complete'}
          onPress={step < STEPS.length - 1 ? () => setStep(step + 1) : handleSubmit}
          loading={loading}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { padding: 24, paddingTop: 60 },
  body: { flex: 1, paddingHorizontal: 24 },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: { flexDirection: 'row', padding: 24, borderTopWidth: 1, borderTopColor: Colors.gray[200] },
});
