import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Card, Badge, Button, Input, useToast } from '../../design-system';
import { subscriptionsApi } from '../../api/subscriptions.queries';

export default function ShoeCollectionScreen() {
  const [shoes, setShoes] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ brand: '', model: '', size: '', shoeType: 'SNEAKER' });
  const { show } = useToast();

  useEffect(() => {
    subscriptionsApi.getProfile().then(r => {
      const profile = r.data?.profile;
      if (profile?.shoeCollection) setShoes(profile.shoeCollection);
    }).catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!form.brand || !form.model || !form.size) { show('Fill in all fields', 'error'); return; }
    try {
      const result = await subscriptionsApi.updateShoeCollection('ADD', form);
      setShoes(result.data.shoeCollection);
      setAdding(false);
      setForm({ brand: '', model: '', size: '', shoeType: 'SNEAKER' });
      show('Shoe added!', 'success');
    } catch {
      show('Failed to add shoe', 'error');
    }
  };

  const handleRemove = async (shoeId: string) => {
    try {
      const result = await subscriptionsApi.updateShoeCollection('REMOVE', { shoeId });
      setShoes(result.data.shoeCollection);
    } catch {
      show('Failed to remove', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[Typography.h2, { color: Colors.gray[900] }]}>Shoe Collection</Text>
        <Button title="Add" size="sm" onPress={() => setAdding(!adding)} />
      </View>

      {adding && (
        <Card style={{ margin: 24, marginBottom: 0 }}>
          <Input label="Brand" value={form.brand} onChangeText={v => setForm({ ...form, brand: v })} />
          <Input label="Model" value={form.model} onChangeText={v => setForm({ ...form, model: v })} />
          <Input label="Size" value={form.size} onChangeText={v => setForm({ ...form, size: v })} />
          <Button title="Add Shoe" onPress={handleAdd} />
        </Card>
      )}

      <FlatList
        data={shoes}
        contentContainerStyle={{ padding: 24 }}
        keyExtractor={(item: any) => item.id}
        ListEmptyComponent={
          <Text style={[Typography.body, { color: Colors.gray[500], textAlign: 'center' }]}>No shoes in collection</Text>
        }
        renderItem={({ item }: any) => (
          <Card style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={Typography.label}>{item.brand} {item.model}</Text>
                <Text style={[Typography.caption, { color: Colors.gray[500] }]}>Size {item.size} | {item.shoeType}</Text>
              </View>
              <Button title="Remove" variant="ghost" size="sm" onPress={() => handleRemove(item.id)} />
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 0 },
});
