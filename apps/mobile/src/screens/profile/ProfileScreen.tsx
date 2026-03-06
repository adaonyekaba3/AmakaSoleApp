import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Card, Button } from '../../design-system';
import { useAuthStore } from '../../store/authStore';
import { subscriptionsApi } from '../../api/subscriptions.queries';

export default function ProfileScreen({ navigation }: any) {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    subscriptionsApi.getProfile().then(r => setProfile(r.data)).catch(() => {});
  }, []);

  const menuItems = [
    { label: 'Shoe Collection', icon: 'footsteps-outline' as const, screen: 'ShoeCollection' },
    { label: 'Subscription', icon: 'card-outline' as const, screen: 'Subscription' },
    { label: 'Settings', icon: 'settings-outline' as const, screen: 'Settings' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card variant="elevated" style={{ alignItems: 'center', paddingVertical: 32 }}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 32, color: Colors.white }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Text>
          </View>
          <Text style={[Typography.h3, { color: Colors.gray[900], marginTop: 12 }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[Typography.bodySmall, { color: Colors.gray[500] }]}>{user?.email}</Text>
          {profile?.profile && (
            <Text style={[Typography.caption, { color: Colors.primary[600], marginTop: 8 }]}>
              Health Score: {profile.profile.footHealthScore}
            </Text>
          )}
        </Card>

        <View style={{ marginTop: 24 }}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.label} onPress={() => navigation.navigate(item.screen)}>
              <Card style={styles.menuItem}>
                <Ionicons name={item.icon} size={22} color={Colors.gray[600]} />
                <Text style={[Typography.body, { color: Colors.gray[800], flex: 1, marginLeft: 12 }]}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Sign Out" variant="outline" onPress={logout} style={{ marginTop: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  scroll: { padding: 24 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 14,
  },
});
