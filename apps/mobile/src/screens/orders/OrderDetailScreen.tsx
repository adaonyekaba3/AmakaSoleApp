import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Card, Badge, Button, LoadingSpinner, useToast } from '../../design-system';
import { ordersApi } from '../../api/orders.queries';

export default function OrderDetailScreen({ route }: any) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  useEffect(() => {
    ordersApi.getOrder(orderId).then(r => { setOrder(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [orderId]);

  if (loading) return <LoadingSpinner />;
  if (!order) return <View style={styles.container}><Text>Order not found</Text></View>;

  const handleCancel = async () => {
    try {
      await ordersApi.cancelOrder(orderId);
      setOrder({ ...order, status: 'CANCELLED' });
      show('Order cancelled', 'success');
    } catch {
      show('Cannot cancel order', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[Typography.h2, { color: Colors.gray[900] }]}>Order Details</Text>
          <Badge label={order.status} variant={order.status === 'PAID' ? 'success' : order.status === 'CANCELLED' ? 'error' : 'info'} />
        </View>

        <Card variant="elevated" style={{ marginTop: 20 }}>
          <DataRow label="Order ID" value={order.id.slice(0, 8)} />
          <DataRow label="Amount" value={`$${(order.amount / 100).toFixed(2)}`} />
          <DataRow label="Date" value={new Date(order.createdAt).toLocaleDateString()} />
          {order.trackingNumber && (
            <>
              <DataRow label="Tracking" value={order.trackingNumber} />
              <DataRow label="Carrier" value={order.trackingCarrier || 'N/A'} />
            </>
          )}
        </Card>

        {order.shippingAddress && (
          <Card style={{ marginTop: 16 }}>
            <Text style={[Typography.h3, { color: Colors.gray[900], marginBottom: 8 }]}>Shipping Address</Text>
            <Text style={Typography.body}>{order.shippingAddress.fullName}</Text>
            <Text style={Typography.bodySmall}>{order.shippingAddress.addressLine1}</Text>
            {order.shippingAddress.addressLine2 && <Text style={Typography.bodySmall}>{order.shippingAddress.addressLine2}</Text>}
            <Text style={Typography.bodySmall}>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </Text>
          </Card>
        )}

        {order.status === 'PENDING' && (
          <Button title="Cancel Order" variant="outline" onPress={handleCancel} style={{ marginTop: 24 }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={[Typography.bodySmall, { color: Colors.gray[500] }]}>{label}</Text>
      <Text style={[Typography.label, { color: Colors.gray[900] }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  scroll: { padding: 24 },
});
