import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Button, Input, useToast } from '../../design-system';
import { useAuthStore } from '../../store/authStore';

export default function RegisterScreen({ navigation }: { navigation: NativeStackNavigationProp<any> }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore(s => s.register);
  const { show } = useToast();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) { show('Please fill in all fields', 'error'); return; }
    setLoading(true);
    try {
      await register({ email, password, firstName, lastName });
    } catch (error: any) {
      show(error.response?.data?.error || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={[Typography.h1, { color: Colors.gray[900] }]}>Create Account</Text>
        <Text style={[Typography.body, { color: Colors.gray[500], marginTop: 8, marginBottom: 32 }]}>
          Start your custom orthotic journey
        </Text>

        <View style={styles.row}>
          <View style={styles.half}>
            <Input label="First Name" placeholder="Jane" value={firstName} onChangeText={setFirstName} />
          </View>
          <View style={styles.half}>
            <Input label="Last Name" placeholder="Doe" value={lastName} onChangeText={setLastName} />
          </View>
        </View>
        <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Input label="Password" placeholder="Min 8 chars, 1 uppercase, 1 number" value={password} onChangeText={setPassword} secureTextEntry />

        <Button title="Create Account" onPress={handleRegister} loading={loading} size="lg" style={{ marginTop: 8 }} />

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.link}>
          <Text style={[Typography.body, { color: Colors.gray[500] }]}>
            Already have an account? <Text style={{ color: Colors.primary[600], fontWeight: '600' }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  link: { alignItems: 'center', marginTop: 24 },
});
