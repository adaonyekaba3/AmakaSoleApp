import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Card, Badge, Button, LoadingSpinner, useToast } from '../../design-system';
import { useOrthoticStore } from '../../store/orthoticStore';

export default function DesignDetailScreen({ navigation, route }: any) {
  const { orthoticId } = route.params;
  const { currentDesign, loadDesign, confirmDesign } = useOrthoticStore();
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  useEffect(() => {
    loadDesign(orthoticId).then(() => setLoading(false)).catch(() => setLoading(false));
  }, [orthoticId]);

  if (loading) return <LoadingSpinner message="Loading design..." />;
  if (!currentDesign) return <View style={styles.container}><Text>Design not found</Text></View>;

  const spec = currentDesign.cadSpec;

  const handleConfirm = async () => {
    try {
      await confirmDesign(orthoticId);
      show('Design confirmed!', 'success');
    } catch {
      show('Failed to confirm', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[Typography.h2, { color: Colors.gray[900] }]}>Orthotic Design</Text>
          <Badge label={currentDesign.status} variant={currentDesign.status === 'CONFIRMED' ? 'success' : 'info'} />
        </View>

        <Card variant="elevated" style={{ marginTop: 20 }}>
          <Text style={[Typography.h3, { color: Colors.gray[900] }]}>Configuration</Text>
          <DataRow label="Shoe Type" value={currentDesign.shoeType} />
          <DataRow label="Use Case" value={currentDesign.useCase} />
          <DataRow label="Material" value={currentDesign.material?.replace(/_/g, ' ')} />
          <DataRow label="Arch Preference" value={currentDesign.archHeightPref} />
        </Card>

        {spec && (
          <Card style={{ marginTop: 16 }}>
            <Text style={[Typography.h3, { color: Colors.gray[900] }]}>Specifications</Text>
            <DataRow label="Arch Height" value={`${spec.arch_profile?.height_mm}mm`} />
            <DataRow label="Heel Cup Depth" value={`${spec.heel_cup?.depth_mm}mm`} />
            <DataRow label="Thickness" value={`${spec.thickness_mm}mm`} />
            <DataRow label="Total Length" value={`${spec.total_length_mm}mm`} />
            <DataRow label="Shore Hardness" value={`${spec.shore_hardness}`} />
          </Card>
        )}

        {currentDesign.status === 'DRAFT' && (
          <View style={{ marginTop: 24 }}>
            <Button title="Confirm Design" onPress={handleConfirm} size="lg" />
            <Button title="Edit Design" variant="outline" onPress={() => navigation.goBack()} style={{ marginTop: 12 }} />
          </View>
        )}
        {currentDesign.status === 'CONFIRMED' && (
          <Button
            title="Order Now"
            onPress={() => navigation.navigate('Orders', { screen: 'Checkout', params: { orthoticDesignId: orthoticId } })}
            size="lg"
            style={{ marginTop: 24 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
      <Text style={[Typography.bodySmall, { color: Colors.gray[500] }]}>{label}</Text>
      <Text style={[Typography.label, { color: Colors.gray[900] }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  scroll: { padding: 24 },
});
