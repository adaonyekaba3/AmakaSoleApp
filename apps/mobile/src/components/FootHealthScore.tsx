import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../design-system/Colors';
import { Typography } from '../design-system/Typography';

interface FootHealthScoreProps {
  score: number;
  size?: number;
}

export function FootHealthScore({ score, size = 120 }: FootHealthScoreProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  const getColor = () => {
    if (score >= 75) return Colors.success;
    if (score >= 50) return Colors.warning;
    return Colors.error;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle cx={center} cy={center} r={radius} stroke={Colors.gray[200]} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
      </Svg>
      <View style={[styles.label, { width: size, height: size }]}>
        <Text style={[Typography.h2, { color: getColor() }]}>{score}</Text>
        <Text style={[Typography.caption, { color: Colors.gray[500] }]}>/ 100</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  label: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
});
