import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { LoadingSpinner } from '../../design-system';
import { useScanStore } from '../../store/scanStore';
import { SCAN_POLL_INTERVAL_MS } from '@amakasole/shared';

export default function ScanProcessingScreen({ navigation, route }: any) {
  const { scanId } = route.params;
  const { pollStatus, scanStatus } = useScanStore();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const status = await pollStatus(scanId);
      if (status === 'COMPLETE') {
        clearInterval(intervalRef.current!);
        navigation.replace('ScanResults', { scanId });
      } else if (status === 'FAILED') {
        clearInterval(intervalRef.current!);
        navigation.goBack();
      }
    }, SCAN_POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [scanId]);

  return (
    <View style={styles.container}>
      <LoadingSpinner message="Processing your scan..." />
      <Text style={[Typography.caption, { color: Colors.gray[400], marginTop: 16, textAlign: 'center' }]}>
        Status: {scanStatus || 'PROCESSING'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.bg, justifyContent: 'center', alignItems: 'center' },
});
