import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { useScan } from './useScan';
import { ScanResult, OrthoticDesignResult } from './types';

interface AmakaFitScanButtonProps {
  foot?: 'LEFT' | 'RIGHT';
  fileType?: 'STL' | 'OBJ' | 'PLY';
  onScanComplete?: (result: ScanResult) => void;
  onDesignReady?: (design: OrthoticDesignResult) => void;
  onError?: (error: Error) => void;
  buttonStyle?: object;
  textStyle?: object;
  title?: string;
}

export function AmakaFitScanButton({
  foot = 'LEFT',
  fileType = 'PLY',
  onScanComplete,
  onError,
  buttonStyle,
  textStyle,
  title = 'Scan Your Feet',
}: AmakaFitScanButtonProps) {
  const { startScan, isScanning } = useScan();

  const handlePress = async () => {
    try {
      const result = await startScan(foot, fileType);
      onScanComplete?.(result);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={handlePress}
      disabled={isScanning}
      activeOpacity={0.7}
    >
      {isScanning ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color="#FFFFFF" size="small" />
          <Text style={[styles.text, textStyle, { marginLeft: 8 }]}>Scanning...</Text>
        </View>
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
