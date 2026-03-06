import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Button, useToast } from '../../design-system';
import { useScanStore } from '../../store/scanStore';

export default function ScanCaptureScreen({ navigation }: any) {
  const [capturing, setCapturing] = useState(false);
  const [foot, setFoot] = useState<'LEFT' | 'RIGHT'>('LEFT');
  const { startScan, confirmScan } = useScanStore();
  const { show } = useToast();

  const handleCapture = async () => {
    setCapturing(true);
    try {
      const { scanId } = await startScan(foot, 'PLY');

      // In a real app, the camera would upload the scan file to the presigned URL.
      // For MVP, we simulate the upload and confirm immediately.
      await confirmScan(scanId, foot);

      navigation.replace('ScanProcessing', { scanId });
    } catch (error: any) {
      show('Scan failed. Please try again.', 'error');
    } finally {
      setCapturing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraArea}>
        <View style={styles.placeholder}>
          <Text style={[Typography.h3, { color: Colors.white }]}>Camera View</Text>
          <Text style={[Typography.bodySmall, { color: Colors.gray[300], marginTop: 8 }]}>
            Point camera at your {foot.toLowerCase()} foot
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <View style={styles.footSelector}>
          <Button
            title="Left Foot"
            variant={foot === 'LEFT' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => setFoot('LEFT')}
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button
            title="Right Foot"
            variant={foot === 'RIGHT' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => setFoot('RIGHT')}
            style={{ flex: 1 }}
          />
        </View>
        <Button title={capturing ? 'Scanning...' : 'Capture Scan'} onPress={handleCapture} loading={capturing} size="lg" style={{ marginTop: 16 }} />
        <Button title="Cancel" variant="ghost" onPress={() => navigation.goBack()} style={{ marginTop: 8 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  cameraArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholder: {
    width: '80%',
    aspectRatio: 3 / 4,
    backgroundColor: Colors.dark.card,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary[500],
    borderStyle: 'dashed',
  },
  controls: { padding: 24, backgroundColor: Colors.dark.bg },
  footSelector: { flexDirection: 'row' },
});
