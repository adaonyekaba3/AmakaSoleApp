import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Card } from '../../design-system';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [emailEnabled, setEmailEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.h2, { color: Colors.gray[900] }]}>Settings</Text>

        <Text style={[Typography.label, { color: Colors.gray[500], marginTop: 24, marginBottom: 12 }]}>Notifications</Text>
        <Card>
          <SettingRow label="Push Notifications" value={pushEnabled} onToggle={setPushEnabled} />
          <SettingRow label="Email Notifications" value={emailEnabled} onToggle={setEmailEnabled} />
        </Card>

        <Text style={[Typography.label, { color: Colors.gray[500], marginTop: 24, marginBottom: 12 }]}>About</Text>
        <Card>
          <View style={styles.aboutRow}>
            <Text style={Typography.body}>Version</Text>
            <Text style={[Typography.bodySmall, { color: Colors.gray[500] }]}>1.0.0</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={Typography.body}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray[400]} />
          </View>
          <View style={styles.aboutRow}>
            <Text style={Typography.body}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray[400]} />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ label, value, onToggle }: { label: string; value: boolean; onToggle: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
      <Text style={Typography.body}>{label}</Text>
      <Switch value={value} onValueChange={onToggle} trackColor={{ true: Colors.primary[500] }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray[50] },
  scroll: { padding: 24 },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
});
