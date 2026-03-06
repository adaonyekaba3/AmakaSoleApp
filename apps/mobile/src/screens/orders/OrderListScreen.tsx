import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Card, Badge, LoadingSpinner } from '../../design-system';
import { ordersApi } from '../../api/orders.queries';

export default function OrderListScreen({ navigation }: any) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.listOrders().then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading orders..." />;

  const statusVariant = (status: string) => {
    if (['PAID', 'DELIVERED'].includes(status)) return 'success';
    if (status === 'CANCELLED') return 'error';
    if (['MANUFACTURING', 'SHIPPED'].includes(status)) return 'info';
    return 'warning';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[Typography.h2, { color: Colors.gray[900], padding: 24, paddingBottom: 0 }]}>My Orders</Text>
      <FlatList
        data={orders}
        contentContainerStyle={{ padding: 24 }}
        keyExtractor={(item: any) => item.id}
        ListEmptyComponent={
          <Card variant="outlined" style={{ alignItems: 'center', padding: 32 }}>
            <Text style={[Typography.body, { color: Colors.gray[500] }]}>No orders yet</Text>
          </Card>
        }
        renderItem={({ item }: any) => (
          <TouchableOpacity onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}>
            <Card style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={Typography.label}>Order {item.id.slice(0, 8)}</Text>
                  <Text style={[Typography.bodySmall, { color: Colors.gray[900] }]}>
                    ${(item.amount / 100).toFixed(2)}
                  </Text>
                  <Text style={[Typography.caption, { color: Colors.gray[500] }]}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Badge label={item.status} variant={statusVariant(item.status)} />
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
});
