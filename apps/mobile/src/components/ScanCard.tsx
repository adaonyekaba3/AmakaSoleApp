import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Badge } from '../design-system';
import { Typography } from '../design-system/Typography';
import { Colors } from '../design-system/Colors';

interface ScanCardProps {
  scan: { id: string; status: string; createdAt: string };
  onPress: () => void;
}

export function ScanCard({ scan, onPress }: ScanCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={Typography.label}>Scan {scan.id.slice(0, 8)}</Text>
            <Text style={[Typography.caption, { color: Colors.gray[500] }]}>
              {new Date(scan.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <Badge label={scan.status} variant={scan.status === 'COMPLETE' ? 'success' : 'info'} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}
