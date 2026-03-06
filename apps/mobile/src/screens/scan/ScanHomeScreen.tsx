import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Button, Card, Badge, LoadingSpinner } from '../../design-system';
import { useScanStore } from '../../store/scanStore';

export default function ScanHomeScreen({ navigation }: any) {
  const { scans, isLoading, loadScans } = useScanStore();

  useEffect(() => { loadScans(); }, []);

  if (isLoading) return <LoadingSpinner message="Loading scans..." />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[Typography.h2, { color: Colors.gray[900] }]}>Foot Scans</Text>
        <Button title="New Scan" onPress={() => navigation.navigate('ScanTutorial')} size="sm" />
      </View>
      <FlatList
        data={scans}
        contentContainerStyle={{ padding: 24 }}
        keyExtractor={(item: any) => item.id}
        ListEmptyComponent={
          <Card variant="outlined" style={{ alignItems: 'center', padding: 32 }}>
            <Text style={[Typography.body, { color: Colors.gray[500], marginBottom: 16 }]}>No scans yet</Text>
            <Button title="Start Your First Scan" onPress={() => navigation.navigate('ScanTutorial')} />
          </Card>
        }
        renderItem={({ item }: any) => (
          <TouchableOpacity onPress={() => {
            if (item.status === 'COMPLETE') navigation.navigate('ScanResults', { scanId: item.id });
          }}>
            <Card style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={Typography.label}>Scan {item.id.slice(0, 8)}</Text>
                  <Text style={[Typography.caption, { color: Colors.gray[500] }]}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Badge label={item.status} variant={item.status === 'COMPLETE' ? 'success' : item.status === 'FAILED' ? 'error' : 'info'} />
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 0 },
});
