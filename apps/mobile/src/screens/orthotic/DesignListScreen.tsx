import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Card, Badge, Button } from '../../design-system';
import { useOrthoticStore } from '../../store/orthoticStore';

export default function DesignListScreen({ navigation }: any) {
  const { designs, loadDesigns } = useOrthoticStore();

  useEffect(() => { loadDesigns(); }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[Typography.h2, { color: Colors.gray[900] }]}>My Designs</Text>
      </View>
      <FlatList
        data={designs}
        contentContainerStyle={{ padding: 24 }}
        keyExtractor={(item: any) => item.id}
        ListEmptyComponent={
          <Card variant="outlined" style={{ alignItems: 'center', padding: 32 }}>
            <Text style={[Typography.body, { color: Colors.gray[500], marginBottom: 16, textAlign: 'center' }]}>
              No designs yet. Complete a scan to generate your first custom orthotic.
            </Text>
          </Card>
        }
        renderItem={({ item }: any) => (
          <TouchableOpacity onPress={() => navigation.navigate('DesignDetail', { orthoticId: item.id })}>
            <Card style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={Typography.label}>{item.shoeType} - {item.material?.replace(/_/g, ' ')}</Text>
                  <Text style={[Typography.caption, { color: Colors.gray[500] }]}>
                    {item.useCase} | {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Badge label={item.status} variant={item.status === 'CONFIRMED' ? 'success' : item.status === 'ORDERED' ? 'info' : 'neutral'} />
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
  header: { padding: 24, paddingBottom: 0 },
});
