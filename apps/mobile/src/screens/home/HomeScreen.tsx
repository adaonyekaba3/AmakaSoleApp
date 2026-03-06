import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Card, Badge, Button } from '../../design-system';
import { useAuthStore } from '../../store/authStore';
import { useScanStore } from '../../store/scanStore';
import { subscriptionsApi } from '../../api/subscriptions.queries';

export default function HomeScreen({ navigation }: any) {
  const user = useAuthStore(s => s.user);
  const { scans, loadScans } = useScanStore();
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      await loadScans();
      const result = await subscriptionsApi.getFootHealthScore();
      setHealthScore(result.data.footHealthScore);
    } catch {}
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={[Typography.h2, { color: Colors.gray[900] }]}>
          Hi, {user?.firstName || 'there'}
        </Text>
        <Text style={[Typography.bodySmall, { color: Colors.gray[500], marginTop: 4 }]}>
          Your foot health dashboard
        </Text>

        {/* Health Score Card */}
        <Card variant="elevated" style={styles.scoreCard}>
          <Text style={[Typography.label, { color: Colors.gray[600] }]}>Foot Health Score</Text>
          <Text style={[Typography.h1, { color: Colors.primary[600], marginTop: 8 }]}>
            {healthScore ?? '--'}
          </Text>
          <Text style={[Typography.caption, { color: Colors.gray[500], marginTop: 4 }]}>
            {healthScore && healthScore >= 75 ? 'Great condition!' : 'Room for improvement'}
          </Text>
        </Card>

        {/* Quick Actions */}
        <Text style={[Typography.h3, { color: Colors.gray[900], marginTop: 24, marginBottom: 12 }]}>Quick Actions</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Scan')}>
            <Text style={styles.actionEmoji}>📸</Text>
            <Text style={[Typography.label, { color: Colors.gray[800] }]}>New Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Designs')}>
            <Text style={styles.actionEmoji}>🦶</Text>
            <Text style={[Typography.label, { color: Colors.gray[800] }]}>My Designs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.actionEmoji}>📦</Text>
            <Text style={[Typography.label, { color: Colors.gray[800] }]}>Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Scans */}
        <Text style={[Typography.h3, { color: Colors.gray[900], marginTop: 24, marginBottom: 12 }]}>Recent Scans</Text>
        {scans.length === 0 ? (
          <Card variant="outlined">
            <Text style={[Typography.body, { color: Colors.gray[500], textAlign: 'center' }]}>
              No scans yet. Start your first scan!
            </Text>
            <Button title="Start Scan" onPress={() => navigation.navigate('Scan')} variant="secondary" style={{ marginTop: 12 }} />
          </Card>
        ) : (
          scans.slice(0, 3).map((scan: any) => (
            <Card key={scan.id} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={Typography.label}>Scan {scan.id.slice(0, 8)}</Text>
                  <Text style={[Typography.caption, { color: Colors.gray[500] }]}>
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Badge label={scan.status} variant={scan.status === 'COMPLETE' ? 'success' : scan.status === 'FAILED' ? 'error' : 'info'} />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  scroll: { padding: 24 },
  scoreCard: { marginTop: 24, alignItems: 'center', paddingVertical: 32 },
  actions: { flexDirection: 'row', gap: 12 },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  actionEmoji: { fontSize: 28, marginBottom: 8 },
});
