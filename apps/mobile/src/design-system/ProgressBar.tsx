import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from './Colors';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({ progress, color = Colors.primary[600], height = 8, style }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  return (
    <View style={[styles.track, { height }, style]}>
      <View style={[styles.fill, { width: `${clampedProgress}%`, backgroundColor: color, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: Colors.gray[200],
    borderRadius: 100,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: 100,
  },
});
