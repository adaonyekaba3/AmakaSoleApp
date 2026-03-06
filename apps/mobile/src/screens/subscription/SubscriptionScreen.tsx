import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Button, Card, useToast } from '../../design-system';
import { SUBSCRIPTION_PRICE, SUBSCRIPTION_ANNUAL_PRICE } from '@amakasole/shared';
import { ordersApi } from '../../api/orders.queries';

const benefits = [
  'Unlimited foot scans',
  '20% discount on orthotics',
  'Priority support',
  'Early access to new features',
  'Free shipping on all orders',
];

export default function SubscriptionScreen() {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await ordersApi.createSubscription('pm_card_placeholder');
      show('Subscription activated!', 'success');
    } catch {
      show('Subscription failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.h2, { color: Colors.gray[900] }]}>AmakaSole Premium</Text>
        <Text style={[Typography.body, { color: Colors.gray[500], marginTop: 8 }]}>
          Get the most out of your foot health journey
        </Text>

        <View style={styles.planSelector}>
          <Button
            title={`Monthly $${(SUBSCRIPTION_PRICE / 100).toFixed(2)}/mo`}
            variant={plan === 'monthly' ? 'primary' : 'outline'}
            onPress={() => setPlan('monthly')}
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button
            title={`Annual $${(SUBSCRIPTION_ANNUAL_PRICE / 100).toFixed(2)}/yr`}
            variant={plan === 'annual' ? 'primary' : 'outline'}
            onPress={() => setPlan('annual')}
            style={{ flex: 1 }}
          />
        </View>

        <Card variant="elevated" style={{ marginTop: 24 }}>
          <Text style={[Typography.h3, { color: Colors.gray[900], marginBottom: 16 }]}>What's Included</Text>
          {benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <Text style={{ color: Colors.success, fontSize: 16 }}>✓</Text>
              <Text style={[Typography.body, { color: Colors.gray[700], marginLeft: 12 }]}>{b}</Text>
            </View>
          ))}
        </Card>

        <Button title="Subscribe Now" onPress={handleSubscribe} loading={loading} size="lg" style={{ marginTop: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  scroll: { padding: 24 },
  planSelector: { flexDirection: 'row', marginTop: 24 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
});
