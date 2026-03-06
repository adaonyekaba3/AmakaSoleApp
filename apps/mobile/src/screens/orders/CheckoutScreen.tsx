import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Button, Input, Card, useToast } from '../../design-system';
import { useCartStore } from '../../store/cartStore';

export default function CheckoutScreen({ navigation, route }: any) {
  const orthoticDesignId = route.params?.orthoticDesignId;
  const { setSelectedDesign, setShippingAddress, createPaymentIntent } = useCartStore();
  const [loading, setLoading] = useState(false);
  const { show } = useToast();
  const [address, setAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

  const handleCheckout = async () => {
    if (!address.fullName || !address.addressLine1 || !address.city || !address.state || !address.postalCode) {
      show('Please fill in all required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      if (orthoticDesignId) setSelectedDesign(orthoticDesignId);
      setShippingAddress(address);
      await createPaymentIntent();
      navigation.replace('OrderConfirmation');
    } catch (error: any) {
      show(error.response?.data?.error || 'Checkout failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.h2, { color: Colors.gray[900] }]}>Checkout</Text>

        <Card style={{ marginTop: 24 }}>
          <Text style={[Typography.h3, { color: Colors.gray[900], marginBottom: 16 }]}>Shipping Address</Text>
          <Input label="Full Name" value={address.fullName} onChangeText={v => setAddress({ ...address, fullName: v })} />
          <Input label="Address Line 1" value={address.addressLine1} onChangeText={v => setAddress({ ...address, addressLine1: v })} />
          <Input label="Address Line 2 (optional)" value={address.addressLine2} onChangeText={v => setAddress({ ...address, addressLine2: v })} />
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input label="City" value={address.city} onChangeText={v => setAddress({ ...address, city: v })} />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="State" value={address.state} onChangeText={v => setAddress({ ...address, state: v })} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input label="Postal Code" value={address.postalCode} onChangeText={v => setAddress({ ...address, postalCode: v })} />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Country" value={address.country} onChangeText={v => setAddress({ ...address, country: v })} />
            </View>
          </View>
        </Card>

        <Button title="Place Order" onPress={handleCheckout} loading={loading} size="lg" style={{ marginTop: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  scroll: { padding: 24 },
  row: { flexDirection: 'row' },
});
