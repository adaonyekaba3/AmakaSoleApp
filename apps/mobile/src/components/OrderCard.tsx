import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Badge } from '../design-system';
import { Typography } from '../design-system/Typography';
import { Colors } from '../design-system/Colors';

interface OrderCardProps {
  order: { id: string; amount: number; status: string; createdAt: string };
  onPress: () => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={Typography.label}>Order {order.id.slice(0, 8)}</Text>
            <Text style={[Typography.bodySmall, { color: Colors.gray[900] }]}>${(order.amount / 100).toFixed(2)}</Text>
            <Text style={[Typography.caption, { color: Colors.gray[500] }]}>
              {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <Badge label={order.status} variant={order.status === 'DELIVERED' ? 'success' : order.status === 'CANCELLED' ? 'error' : 'info'} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}
