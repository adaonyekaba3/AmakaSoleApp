import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Button, Card } from '../../design-system';
import { useCartStore } from '../../store/cartStore';

export default function OrderConfirmationScreen({ navigation }: any) {
  const { orderId, reset } = useCartStore();

  const handleDone = () => {
    reset();
    navigation.navigate('OrderList');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={{ fontSize: 64, textAlign: 'center' }}>✅</Text>
        <Text style={[Typography.h2, { color: Colors.gray[900], textAlign: 'center', marginTop: 24 }]}>
          Order Placed!
        </Text>
        <Text style={[Typography.body, { color: Colors.gray[500], textAlign: 'center', marginTop: 12 }]}>
          Your custom orthotics are being manufactured. We'll notify you when they ship.
        </Text>

        {orderId && (
          <Card variant="outlined" style={{ marginTop: 24, alignItems: 'center' }}>
            <Text style={[Typography.caption, { color: Colors.gray[500] }]}>Order ID</Text>
            <Text style={[Typography.label, { color: Colors.gray[900], marginTop: 4 }]}>{orderId.slice(0, 8)}</Text>
          </Card>
        )}

        <Button title="View Orders" onPress={handleDone} style={{ marginTop: 32 }} />
        <Button title="Back to Home" variant="ghost" onPress={() => { reset(); navigation.navigate('Home'); }} style={{ marginTop: 12 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
});
