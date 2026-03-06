import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Button, Card, Badge, LoadingSpinner, useToast } from '../../design-system';
import { gaitApi } from '../../api/gait.queries';

export default function GaitAnalysisScreen({ navigation, route }: any) {
  const { scanId } = route.params;
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { show } = useToast();

  const startAnalysis = async () => {
    setAnalyzing(true);
    try {
      // Get upload URL for gait video
      await gaitApi.getUploadUrl(scanId);
      // In production, upload video here

      // Start analysis
      await gaitApi.analyzeGait(scanId);

      // Poll for results (simplified)
      const pollResult = async () => {
        for (let i = 0; i < 20; i++) {
          await new Promise(r => setTimeout(r, 3000));
          try {
            const res = await gaitApi.getResults(scanId);
            if (res.data.pronationType !== 'UNKNOWN') {
              setResults(res.data);
              return;
            }
          } catch {}
        }
      };
      await pollResult();
    } catch (error: any) {
      show('Analysis failed', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  if (analyzing) return <LoadingSpinner message="Analyzing your gait..." />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.h2, { color: Colors.gray[900] }]}>Gait Analysis</Text>

        {!results ? (
          <Card variant="elevated" style={{ marginTop: 24, alignItems: 'center', padding: 32 }}>
            <Text style={[Typography.body, { color: Colors.gray[600], textAlign: 'center', marginBottom: 24 }]}>
              Record yourself walking to analyze your gait pattern and pronation type.
            </Text>
            <Button title="Start Gait Analysis" onPress={startAnalysis} size="lg" />
          </Card>
        ) : (
          <>
            <Card variant="elevated" style={{ marginTop: 24 }}>
              <Text style={[Typography.label, { color: Colors.gray[600] }]}>Pronation Type</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <Text style={[Typography.h2, { color: Colors.gray[900] }]}>{results.pronationType}</Text>
                <Badge label={`${results.confidenceScore}%`} variant="info" />
              </View>
            </Card>

            {results.analysisData && (
              <Card style={{ marginTop: 16 }}>
                <Text style={[Typography.h3, { color: Colors.gray[900], marginBottom: 12 }]}>Stride Data</Text>
                <DataRow label="Stride Length" value={`${results.analysisData.stride?.stride_length_cm}cm`} />
                <DataRow label="Cadence" value={`${results.analysisData.stride?.cadence_spm} spm`} />
                <DataRow label="Ground Contact" value={`${results.analysisData.stride?.ground_contact_time_ms}ms`} />
                <DataRow label="Symmetry" value={`${results.analysisData.symmetry_index}%`} />
              </Card>
            )}

            <Button
              title="Generate Orthotic with Gait Data"
              onPress={() => navigation.navigate('Designs', { screen: 'OrthoticBuilder', params: { scanId } })}
              style={{ marginTop: 24 }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={[Typography.bodySmall, { color: Colors.gray[500] }]}>{label}</Text>
      <Text style={[Typography.label, { color: Colors.gray[900] }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  scroll: { padding: 24 },
});
