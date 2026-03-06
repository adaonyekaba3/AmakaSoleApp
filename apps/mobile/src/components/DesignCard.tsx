import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Badge } from '../design-system';
import { Typography } from '../design-system/Typography';
import { Colors } from '../design-system/Colors';

interface DesignCardProps {
  design: { id: string; shoeType: string; material: string; useCase: string; status: string; createdAt: string };
  onPress: () => void;
}

export function DesignCard({ design, onPress }: DesignCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={Typography.label}>{design.shoeType} - {design.material?.replace(/_/g, ' ')}</Text>
            <Text style={[Typography.caption, { color: Colors.gray[500] }]}>
              {design.useCase} | {new Date(design.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <Badge label={design.status} variant={design.status === 'CONFIRMED' ? 'success' : 'neutral'} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}
