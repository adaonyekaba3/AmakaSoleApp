import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Card, Badge, Button, LoadingSpinner } from '../../design-system';
import { scansApi } from '../../api/scans.queries';

export default function ScanResultsScreen({ navigation, route }: any) {
  const { scanId } = route.params;
  const [scan, setScan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scansApi.getScan(scanId).then(r => { setScan(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [scanId]);

  if (loading) return <LoadingSpinner message="Loading results..." />;
  if (!scan) return <View style={styles.container}><Text style={Typography.body}>Scan not found</Text></View>;

  const measurements = scan.measurements;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[Typography.h2, { color: Colors.gray[900] }]}>Scan Results</Text>
          <Badge label={scan.status} variant="success" />
        </View>

        {measurements && (
          <>
            {['left', 'right'].map(side => {
              const m = measurements[side];
              if (!m) return null;
              return (
                <Card key={side} variant="elevated" style={{ marginTop: 16 }}>
                  <Text style={[Typography.h3, { color: Colors.gray[900], textTransform: 'capitalize' }]}>
                    {side} Foot
                  </Text>
                  <View style={styles.measurementRow}>
                    <MeasurementItem label="Length" value={`${m.length_mm}mm`} />
                    <MeasurementItem label="Width" value={`${m.width_mm}mm`} />
                  </View>
                  <View style={styles.measurementRow}>
                    <MeasurementItem label="Arch Height" value={`${m.arch_height_mm}mm`} />
                    <MeasurementItem label="Heel Width" value={`${m.heel_width_mm}mm`} />
                  </View>
                </Card>
              );
            })}
          </>
        )}

        <View style={styles.actions}>
          <Button title="Analyze Gait" variant="secondary" onPress={() => navigation.navigate('GaitAnalysis', { scanId })} style={{ marginBottom: 12 }} />
          <Button title="Generate Orthotic" onPress={() => navigation.navigate('Designs', { screen: 'OrthoticBuilder', params: { scanId } })} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MeasurementItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={[Typography.caption, { color: Colors.gray[500] }]}>{label}</Text>
      <Text style={[Typography.label, { color: Colors.gray[900], marginTop: 2 }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  scroll: { padding: 24 },
  measurementRow: { flexDirection: 'row', marginTop: 12, gap: 16 },
  actions: { marginTop: 32 },
});
