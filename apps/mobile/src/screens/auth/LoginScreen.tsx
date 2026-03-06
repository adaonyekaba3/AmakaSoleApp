import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../design-system/Colors';
import { Typography } from '../../design-system/Typography';
import { Button, Input, useToast } from '../../design-system';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen({ navigation }: { navigation: NativeStackNavigationProp<any> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const { show } = useToast();

  const handleLogin = async () => {
    if (!email || !password) { show('Please fill in all fields', 'error'); return; }
    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      show(error.response?.data?.error || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={[Typography.h1, { color: Colors.gray[900] }]}>Welcome Back</Text>
        <Text style={[Typography.body, { color: Colors.gray[500], marginTop: 8, marginBottom: 32 }]}>
          Sign in to your account
        </Text>

        <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Input label="Password" placeholder="Enter password" value={password} onChangeText={setPassword} secureTextEntry />

        <Button title="Sign In" onPress={handleLogin} loading={loading} size="lg" style={{ marginTop: 8 }} />

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
          <Text style={[Typography.body, { color: Colors.gray[500] }]}>
            Don't have an account? <Text style={{ color: Colors.primary[600], fontWeight: '600' }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  link: { alignItems: 'center', marginTop: 24 },
});
